<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список всех базовых лицензий</h1>
    <div class="mx-auto my-4 flex max-w-[900px] flex-wrap justify-end gap-4">
      <!-- Фильтры и поиск -->
      <div class="flex flex-wrap items-center gap-4">
        <!-- Поиск по названию лицензии -->
        <label class="floating-label">
          <input
            v-model="nameLicenseQuery"
            type="text"
            placeholder="Поиск по лицензии"
            class="input input-sm min-w-[160px] border"
            @input="handleSearchInput"
          />
          <span>Название лицензии</span>
        </label>

        <!-- Фильтр по продукту -->
        <select
          v-model="productIdFilter"
          class="select select-sm border"
          @change="fetchLicenses"
        >
          <option :value="null">Все продукты</option>
          <option
            v-for="product in products"
            :key="product.id"
            :value="product.id"
          >
            {{ product.name_product }}
          </option>
        </select>

        <!-- Сортировка -->
        <div class="flex gap-2">
          <select
            v-model="sortField"
            class="select select-sm border"
            @change="handleSortChange"
          >
            <option :value="null">Без сортировки</option>
            <option value="name_license">По названию</option>
            <option value="price">По цене</option>
          </select>

          <select
            v-model="sortDirection"
            class="select select-sm border"
            @change="fetchLicenses"
            :disabled="!sortField"
          >
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </div>

        <!-- Кнопка сброса -->
        <button
          class="btn btn-sm btn-outline"
          @click="resetFilters"
          :disabled="!hasActiveFilters"
        >
          Сбросить
        </button>
      </div>

      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedBaseLicensesModal
        v-model:is-open="isOpenAdded"
        :products="products"
        @update-products="fetchLicenses"
      />
    </div>

    <!-- Карточки не пустые -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-3 items-start justify-center gap-4"
    >
      <!-- Licenses -->
      <template v-if="!isLoading">
        <div
          v-for="item in baseLicenses"
          :key="item.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <h1 class="card-title text-green-600">
              {{ item.product?.nameProduct || 'Без продукта' }}
            </h1>
            <h2 class="card-title text-blue-600">
              {{ item.nameLicense }}
            </h2>
            <p class="truncate text-gray-600">
              {{ truncate(item.descriptionLicense, 60) }}
            </p>
            <div class="mt-4 flex flex-col gap-2">
              <div class="flex justify-between">
                <span class="font-semibold">Цена покупки:</span>
                <span>{{ item.purchasePriceLicense }} ₽</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Цена продления:</span>
                <span>{{ item.offerPriceLicense }} ₽</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Макс. скидка:</span>
                <span>{{ item.maxDiscount }}%</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="font-semibold">Тип лицензии</span>
                <span>{{ item.typeLicense }}</span>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap justify-end gap-2">
              <button
                class="btn btn-sm btn-error"
                @click="handleOpenDelete(item.id)"
              >
                Удалить
              </button>
              <button
                class="btn btn-sm btn-warning"
                @click="handleOpenEdit(item.id)"
              >
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Skeletons -->
      <template v-else>
        <div
          v-for="n in 6"
          :key="n"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <SekeletonCards />
        </div>
      </template>
    </div>

    <!-- Карточки с бека пустые -->
    <div
      v-if="baseLicenses.length === 0 && !isLoading"
      class="mx-auto flex max-w-[900px] items-center justify-center gap-4"
    >
      <p class="flex flex-col gap-4 text-2xl font-semibold">
        На данный момент записей нет, хотите
        <br />
        <button class="btn btn-sm btn-outline btn-success" @click="openModal">
          добавить?
        </button>
      </p>
    </div>

    <EditBaseLicensesModal
      v-model:is-open="isOpenEdit"
      v-model:licenses="licenses"
      v-model:is-loading="isLoadingEdit"
      v-model:products="products"
      :id-product="editProductId!"
      @update-licenses="fetchLicenses"
    />
    <DeleteBaseLicensesModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="fetchLicenses"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import AddedBaseLicensesModal from '../components/BaseLicenses/AddedBaseLicensesModal.vue'
import EditBaseLicensesModal from '../components/BaseLicenses/EditBaseLicensesModal.vue'
import DeleteBaseLicensesModal from '../components/BaseLicenses/DeleteBaseLicensesModal.vue'
import type { BaseLicenses, Product } from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'
import { useProduct } from '../composables/useProduct'
import { useBaseLicenses } from '../composables/useBaseLicenses'

definePageMeta({
  layout: 'custom'
})

const route = useRoute()
const router = useRouter()
const { getAllProducts } = useProduct()
const { getAllBaseLicenses, getBaseLicensesById } = useBaseLicenses()

// Реактивные данные
const baseLicenses = ref<BaseLicenses[]>([])
const products = ref<Product[]>([])
const licenses = ref<BaseLicenses>()
const nameLicenseQuery = ref('')
const productIdFilter = ref<number | null>(null)
const sortField = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const isOpenAdded = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)
const isLoading = ref(false)
const isLoadingEdit = ref(false)
const editProductId = ref<number | null>(null)
const deleteProductId = ref<number | null>(null)

// Проверка активных фильтров
const hasActiveFilters = computed(() => {
  return (
    nameLicenseQuery.value ||
    productIdFilter.value !== null ||
    sortField.value !== null
  )
})

// Дебаунс для поиска
const debouncedSearch = debounce(() => {
  fetchLicenses()
}, 500)

// Обработчик ввода поиска
const handleSearchInput = () => {
  debouncedSearch()
}

// Обработчик изменения сортировки
const handleSortChange = () => {
  if (!sortField.value) {
    sortDirection.value = 'asc'
  }
  fetchLicenses()
}

// Получение лицензий с учетом фильтров
async function fetchLicenses() {
  isLoading.value = true
  try {
    const params = {
      name_license: nameLicenseQuery.value || undefined,
      product_id: productIdFilter.value || undefined,
      sort: sortField.value || undefined,
      direction: sortField.value ? sortDirection.value : undefined
    }

    // Обновляем URL
    router.push({ query: params })

    const [licensesResponse, productsResponse] = await Promise.all([
      getAllBaseLicenses(params),
      getAllProducts()
    ])

    baseLicenses.value = licensesResponse
    products.value = productsResponse
  } catch (error) {
    console.error('Ошибка при загрузке лицензий:', error)
  } finally {
    isLoading.value = false
  }
}

// Сброс фильтров
function resetFilters() {
  nameLicenseQuery.value = ''
  productIdFilter.value = null
  sortField.value = null
  sortDirection.value = 'asc'
  fetchLicenses()
}

// Инициализация из query параметров URL
onMounted(() => {
  if (route.query.name_license)
    nameLicenseQuery.value = route.query.name_license as string
  if (route.query.product_id)
    productIdFilter.value = parseInt(route.query.product_id as string)
  if (route.query.sort) sortField.value = route.query.sort as string
  if (route.query.direction)
    sortDirection.value = route.query.direction as 'asc' | 'desc'

  fetchLicenses()
})

function openModal() {
  isOpenAdded.value = true
}

function truncate(str: string, num: number) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

async function handleOpenEdit(id: number) {
  isOpenEdit.value = true
  editProductId.value = id
  isLoadingEdit.value = true
  try {
    const response = await getBaseLicensesById(id)
    licenses.value = response
  } catch (error) {
    console.error('Ошибка при загрузке лицензии:', error)
  } finally {
    isLoadingEdit.value = false
  }
}

function handleOpenDelete(id: number) {
  isOpenDelete.value = true
  deleteProductId.value = id
}
</script>

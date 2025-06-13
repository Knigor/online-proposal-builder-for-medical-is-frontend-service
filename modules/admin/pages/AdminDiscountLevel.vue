<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список уровней скидок для продуктов</h1>

    <!-- Фильтры и кнопка добавления -->
    <div class="mx-auto my-4 flex max-w-[900px] flex-wrap justify-end gap-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Поиск по продукту -->
        <label class="floating-label">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по продукту"
            class="input input-sm min-w-[160px] border"
            @input="handleSearchInput"
          />
          <span>Название продукта</span>
        </label>

        <!-- Фильтр по продукту -->
        <select
          v-model="productIdFilter"
          class="select select-sm border"
          @change="fetchDiscountLevels"
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

        <!-- Фильтр по типу скидки -->
        <select
          v-model="typeFilter"
          class="select select-sm border"
          @change="fetchDiscountLevels"
        >
          <option :value="null">Все типы</option>
          <option v-for="type in discountTypes" :key="type" :value="type">
            {{ type }}
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
            <option value="discount_percent">По размеру скидки</option>
            <option value="min_licenses">По минимальным лицензиям</option>
            <option value="max_licenses">По максимальным лицензиям</option>
          </select>

          <select
            v-model="sortDirection"
            class="select select-sm border"
            @change="fetchDiscountLevels"
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
      <AddedDiscountLevel
        v-model:is-open="isOpenAdded"
        v-model:products="products"
        @update-products="fetchDiscountLevels"
      />
    </div>

    <!-- Карточки -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-3 items-start justify-center gap-4"
    >
      <template v-if="!isLoading">
        <div
          v-for="item in discountLevels"
          :key="item.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <h2 class="card-title text-lg font-bold">
              {{ item.product?.name || 'Без продукта' }}
            </h2>

            <div class="badge badge-accent p-2 text-sm">
              Тип: {{ item.type }}
            </div>

            <div class="mt-2 space-y-1 text-sm">
              <p>
                <strong>Лицензии:</strong> от {{ item.min_licenses }} до
                {{ item.max_licenses }}
              </p>
              <p>
                <strong>Сумма:</strong> от {{ item.min_amount }} до
                {{ item.max_amount }}
              </p>
              <p>
                <strong>Скидка:</strong> {{ item.discount_percent }}
                <span class="text-gray-900">%</span>
              </p>
            </div>

            <div class="mt-4 flex justify-end gap-2">
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

    <!-- Пустой список -->
    <div
      v-if="discountLevels.length === 0 && !isLoading"
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

    <EditDiscountLevel
      v-model:is-open="isOpenEdit"
      v-model:products="products"
      v-model:discount-level="discountLevel"
      v-model:is-loading="isLoadingEdit"
      :id-product="editProductId!"
      @update-products="fetchDiscountLevels"
    />
    <DeleteDiscountLevel
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="fetchDiscountLevels"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import AddedDiscountLevel from '../components/DiscountLevel/AddedDiscountLevel.vue'
import EditDiscountLevel from '../components/DiscountLevel/EditDiscountLevel.vue'
import DeleteDiscountLevel from '../components/DiscountLevel/DeleteDiscountLevel.vue'
import { useProduct } from '~/modules/admin/composables/useProduct'
import type { Product, PricingTier } from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'
import { useDiscountLevel } from '../composables/useDiscountLevel'

definePageMeta({
  layout: 'custom'
})

const route = useRoute()
const router = useRouter()
const { getAllProducts } = useProduct()
const { getAllDiscountLevel, getDiscountLevelById } = useDiscountLevel()

// Реактивные данные
const products = ref<Product[]>([])
const discountLevels = ref<PricingTier[]>([])
const discountLevel = ref<PricingTier>()
const searchQuery = ref('')
const productIdFilter = ref<number | null>(null)
const typeFilter = ref<string | null>(null)
const sortField = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const isOpenAdded = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)
const isLoading = ref(false)
const isLoadingEdit = ref(false)
const editProductId = ref<number | null>(null)
const deleteProductId = ref<number | null>(null)

// Уникальные типы скидок
const discountTypes = computed(() => {
  const types = new Set<string>()
  discountLevels.value.forEach((item) => types.add(item.type))
  return Array.from(types)
})

// Проверка активных фильтров
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    productIdFilter.value !== null ||
    typeFilter.value !== null ||
    sortField.value !== null
  )
})

// Дебаунс для поиска
const debouncedSearch = debounce(() => {
  fetchDiscountLevels()
}, 500)

// Обработчики
const handleSearchInput = () => {
  debouncedSearch()
}

const handleSortChange = () => {
  if (!sortField.value) {
    sortDirection.value = 'asc'
  }
  fetchDiscountLevels()
}

// Получение данных с фильтрами
async function fetchDiscountLevels() {
  isLoading.value = true
  try {
    const params = {
      search: searchQuery.value || undefined,
      product_id: productIdFilter.value || undefined,
      type: typeFilter.value || undefined,
      sort: sortField.value || undefined,
      direction: sortField.value ? sortDirection.value : undefined
    }

    // Обновляем URL
    router.push({ query: params })

    const [levelsResponse, productsResponse] = await Promise.all([
      getAllDiscountLevel(params),
      getAllProducts()
    ])

    discountLevels.value = levelsResponse
    products.value = productsResponse
  } catch (error) {
    console.error('Ошибка при загрузке уровней скидок:', error)
  } finally {
    isLoading.value = false
  }
}

// Сброс фильтров
function resetFilters() {
  searchQuery.value = ''
  productIdFilter.value = null
  typeFilter.value = null
  sortField.value = null
  sortDirection.value = 'asc'
  fetchDiscountLevels()
}

// Инициализация из query параметров URL
onMounted(() => {
  if (route.query.search) searchQuery.value = route.query.search as string
  if (route.query.product_id)
    productIdFilter.value = parseInt(route.query.product_id as string)
  if (route.query.type) typeFilter.value = route.query.type as string
  if (route.query.sort) sortField.value = route.query.sort as string
  if (route.query.direction)
    sortDirection.value = route.query.direction as 'asc' | 'desc'

  fetchDiscountLevels()
})

// Остальные методы
function openModal() {
  isOpenAdded.value = true
}

async function handleOpenEdit(id: number) {
  isOpenEdit.value = true
  editProductId.value = id
  isLoadingEdit.value = true
  try {
    const response = await getDiscountLevelById(id)
    discountLevel.value = response
  } catch (error) {
    console.error('Ошибка при загрузке уровня скидки:', error)
  } finally {
    isLoadingEdit.value = false
  }
}

function handleOpenDelete(id: number) {
  isOpenDelete.value = true
  deleteProductId.value = id
}
</script>

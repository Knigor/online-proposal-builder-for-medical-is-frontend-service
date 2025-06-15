<template>
  <div>
    <h1 class="p-4 text-left text-2xl">
      Список дополнительных модулей (Функциональные блоки)
    </h1>
    <div class="mx-auto my-4 flex max-w-[900px] flex-wrap justify-end gap-4">
      <!-- Фильтры и поиск -->
      <div class="flex flex-wrap items-center gap-4">
        <!-- Поиск по названию модуля -->
        <label class="floating-label">
          <input
            v-model="nameModuleQuery"
            type="text"
            placeholder="Поиск по модулю"
            class="input input-sm min-w-[160px] border"
            @input="handleSearchInput"
          />
          <span>Название модуля</span>
        </label>

        <!-- Фильтр по продукту -->
        <select
          v-model="productIdFilter"
          class="select select-sm border"
          @change="fetchModules"
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
            <option value="name_module">По названию</option>
            <option value="offer_price">По цене продления</option>
            <option value="purchase_price">По цене покупки</option>
          </select>

          <select
            v-model="sortDirection"
            class="select select-sm border"
            @change="fetchModules"
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
      <AddedAdditionalModuleModal
        v-model:is-open="isOpenAdded"
        :products="products"
        @update-products="fetchModules"
      />
    </div>

    <!-- Карточки не пустые -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-3 items-start justify-center gap-4"
    >
      <!-- Modules -->
      <template v-if="!isLoading">
        <div
          v-for="item in additionalModules"
          :key="item.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <h1 class="card-title text-green-600">
              {{ item.name_product }}
            </h1>
            <h2 class="card-title text-blue-600">
              {{ item.name_module }}
            </h2>
            <p class="truncate text-gray-600">
              {{ truncate(item.description_module, 60) }}
            </p>
            <div class="mt-4 flex flex-col gap-2">
              <div class="flex justify-between">
                <span class="font-semibold">Цена покупки:</span>
                <span>{{ item.purchase_price }} ₽</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Цена продления:</span>
                <span>{{ item.offer_price }} ₽</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Макс. скидка:</span>
                <span>{{ item.max_discount_percent }}%</span>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap justify-end gap-3">
              <Pencil
                class="h-6 w-6 cursor-pointer text-gray-600 hover:text-green-600"
                @click="handleOpenEdit(item.id)"
              />
              <Trash2
                class="h-6 w-6 cursor-pointer text-gray-600 hover:text-red-600"
                @click="handleOpenDelete(item.id)"
              />
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
      v-if="additionalModules.length === 0 && !isLoading"
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

    <EditAdditionalModuleModal
      v-model:is-open="isOpenEdit"
      v-model:additional="additional"
      v-model:is-loading="isLoadingEdit"
      v-model:products="products"
      :id-product="editProductId!"
      @update-products="fetchModules"
    />
    <DeleteAdditionalModuleModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="fetchModules"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import AddedAdditionalModuleModal from '../components/AdditionalModule/AddedAdditionalModuleModal.vue'
import EditAdditionalModuleModal from '../components/AdditionalModule/EditAdditionalModuleModal.vue'
import DeleteAdditionalModuleModal from '../components/AdditionalModule/DeleteAdditionalModuleModal.vue'
import type {
  AdditionalModule,
  Product
} from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'
import { useAdditionalModule } from '../composables/useAdditionalModule'
import { useProduct } from '../composables/useProduct'
import { Pencil, Trash2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'custom'
})

const route = useRoute()
const router = useRouter()
const { getAllProducts } = useProduct()
const { getAllAdditionalModules, getAdditionalModuleById } =
  useAdditionalModule()

// Реактивные данные
const additionalModules = ref<AdditionalModule[]>([])
const additional = ref<AdditionalModule>()
const products = ref<Product[]>([])
const nameModuleQuery = ref('')
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
    nameModuleQuery.value ||
    productIdFilter.value !== null ||
    sortField.value !== null
  )
})

// Дебаунс для поиска
const debouncedSearch = debounce(() => {
  fetchModules()
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
  fetchModules()
}

// Получение модулей с учетом фильтров
async function fetchModules() {
  isLoading.value = true
  try {
    const params = {
      name_module: nameModuleQuery.value || undefined,
      product_id: productIdFilter.value || undefined,
      sort: sortField.value || undefined,
      direction: sortField.value ? sortDirection.value : undefined
    }

    // Обновляем URL
    router.push({ query: params })

    const [modulesResponse, productsResponse] = await Promise.all([
      getAllAdditionalModules(params),
      getAllProducts()
    ])

    additionalModules.value = modulesResponse
    products.value = productsResponse
  } catch (error) {
    console.error('Ошибка при загрузке модулей:', error)
  } finally {
    isLoading.value = false
  }
}

// Сброс фильтров
function resetFilters() {
  nameModuleQuery.value = ''
  productIdFilter.value = null
  sortField.value = null
  sortDirection.value = 'asc'
  fetchModules()
}

// Инициализация из query параметров URL
onMounted(() => {
  if (route.query.name_module)
    nameModuleQuery.value = route.query.name_module as string
  if (route.query.product_id)
    productIdFilter.value = parseInt(route.query.product_id as string)
  if (route.query.sort) sortField.value = route.query.sort as string
  if (route.query.direction)
    sortDirection.value = route.query.direction as 'asc' | 'desc'

  fetchModules()
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
    const response = await getAdditionalModuleById(id)
    additional.value = response
  } catch (error) {
    console.error('Ошибка при загрузке модуля:', error)
  } finally {
    isLoadingEdit.value = false
  }
}

function handleOpenDelete(id: number) {
  isOpenDelete.value = true
  deleteProductId.value = id
}
</script>

<style scoped></style>

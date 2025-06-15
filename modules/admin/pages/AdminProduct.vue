<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список продуктов</h1>
    <div class="mx-auto my-4 flex max-w-[900px] flex-wrap justify-end gap-4">
      <!-- Фильтры и поиск -->
      <div class="flex flex-wrap items-center gap-4">
        <!-- Поиск по названию продукта -->
        <label class="floating-label">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по названию"
            class="input input-sm min-w-[160px] border"
            @input="handleSearchInput"
          />
          <span>Поиск</span>
        </label>

        <!-- Сортировка -->
        <div class="flex gap-2">
          <select
            v-model="sortField"
            class="select select-sm border"
            @change="handleSortChange"
          >
            <option :value="null">Без сортировки</option>
            <option value="name_product">По названию</option>
          </select>

          <select
            v-model="sortDirection"
            class="select select-sm border"
            @change="fetchProducts"
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
      <AddedProductModal
        v-model:is-open="isOpenAdded"
        @update-products="fetchProducts"
      />
    </div>

    <!-- Карточки не пустые -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-3 items-start justify-center gap-4"
    >
      <!-- Products -->
      <template v-if="!isLoading">
        <div
          v-for="item in products"
          :key="item.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <h2 class="card-title">
              {{ item.name_product }}
            </h2>
            <div class="badge badge-accent p-2">Активный</div>
            <p>
              {{ truncate(item.discription_product, 60) }}
            </p>
            <div class="flex flex-wrap justify-end gap-3">
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
      v-if="products.length === 0 && !isLoading"
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

    <EditProductModal
      v-model:is-open="isOpenEdit"
      v-model:product="product"
      v-model:is-loading="isLoadingEdit"
      :id-product="editProductId!"
      @update-products="fetchProducts"
    />
    <DeleteProductModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="fetchProducts"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import AddedProductModal from '../components/Product/AddedProductModal.vue'
import EditProductModal from '../components/Product/EditProductModal.vue'
import DeleteProductModal from '../components/Product/DeleteProductModal.vue'
import { useProduct } from '~/modules/admin/composables/useProduct'
import type { Product } from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'
import { Pencil, Trash2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'custom'
})

const route = useRoute()
const router = useRouter()
const { getAllProducts, getProductById } = useProduct()

// Реактивные данные
const products = ref<Product[]>([])
const product = ref<Product>()
const searchQuery = ref('')
const userIdFilter = ref<number | null>(null)
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
    searchQuery.value || userIdFilter.value !== null || sortField.value !== null
  )
})

// Дебаунс для поиска
const debouncedSearch = debounce(() => {
  fetchProducts()
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
  fetchProducts()
}

// Получение продуктов с учетом фильтров
async function fetchProducts() {
  isLoading.value = true
  try {
    const params = {
      search: searchQuery.value || undefined,
      user_id: userIdFilter.value || undefined,
      sort: sortField.value || undefined,
      direction: sortField.value ? sortDirection.value : undefined
    }

    // Обновляем URL
    router.push({ query: params })

    const response = await getAllProducts(params)
    products.value = response
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error)
  } finally {
    isLoading.value = false
  }
}

// Сброс фильтров
function resetFilters() {
  searchQuery.value = ''
  userIdFilter.value = null
  sortField.value = null
  sortDirection.value = 'asc'
  fetchProducts()
}

// Инициализация из query параметров URL
onMounted(() => {
  if (route.query.search) searchQuery.value = route.query.search as string
  if (route.query.user_id)
    userIdFilter.value = parseInt(route.query.user_id as string)
  if (route.query.sort) sortField.value = route.query.sort as string
  if (route.query.direction)
    sortDirection.value = route.query.direction as 'asc' | 'desc'

  fetchProducts()
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
    const response = await getProductById(id)
    product.value = response
  } catch (error) {
    console.error('Ошибка при загрузке продукта:', error)
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

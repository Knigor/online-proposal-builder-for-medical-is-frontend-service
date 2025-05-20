<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список продуктов</h1>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedProductModal
        v-model:is-open="isOpenAdded"
        @update-products="updateProducts"
      />
    </div>

    <!-- Карточки не пустые  -->
    <div
      v-if="products.length !== 0"
      class="mx-auto grid max-w-[900px] grid-cols-3 items-start justify-center gap-4"
    >
      <!-- Products -->
      <template v-if="!isLoading">
        <div
          v-for="product in products"
          :key="product.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <h2 class="card-title">
              {{ product.nameProduct }}
            </h2>
            <div v-if="product.isActive" class="badge badge-accent p-2">
              Активный
            </div>
            <div v-else class="badge badge-error p-2">Не активный</div>
            <p>
              {{ truncate(product.discriptionProduct, 60) }}
            </p>
            <div class="flex flex-wrap justify-end gap-2">
              <button
                class="btn btn-sm btn-error"
                @click="handleOpenDelete(product.id)"
              >
                Удалить
              </button>
              <button
                class="btn btn-sm btn-warning"
                @click="handleOpenEdit(product.id)"
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
      v-else
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
      @update-products="updateProducts"
    />
    <DeleteProductModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="updateProducts"
    />
  </div>
</template>

<script setup lang="ts">
import AddedProductModal from '../components/Product/AddedProductModal.vue'
import EditProductModal from '../components/Product/EditProductModal.vue'
import DeleteProductModal from '../components/Product/DeleteProductModal.vue'
import { useProduct } from '~/modules/admin/composables/useProduct'
import type { Product } from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'

definePageMeta({
  layout: 'custom'
})

const { getAllProducts, getProductById } = useProduct()

const products = ref<Product[]>([])
const product = ref<Product>()

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await getAllProducts()

    console.log(response)
    products.value = response
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

const isOpenAdded = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)
const isLoading = ref(false)
const isLoadingEdit = ref(false)
const editProductId = ref<number | null>(null)
const deleteProductId = ref<number | null>(null)

function openModal() {
  isOpenAdded.value = true
}

async function updateProducts() {
  isLoading.value = true
  try {
    const response = await getAllProducts()

    console.log(response)
    products.value = response
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
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
    console.log(response)
  } catch (error) {
    console.log(error)
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

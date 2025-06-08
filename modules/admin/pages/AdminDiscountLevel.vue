<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список уровней скидок для продуктов</h1>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedDiscountLevel
        v-model:is-open="isOpenAdded"
        v-model:products="products"
        @update-products="updateProducts"
      />
    </div>

    <!-- Карточки не пустые  -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-3 items-start justify-center gap-4"
    >
      <!-- Products -->
      <template v-if="!isLoading">
        <div
          v-for="item in discountLevels"
          :key="item.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <h2 class="card-title text-lg font-bold">
              {{ item.product.name }}
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
            <button
              class="btn btn-sm btn-success"
              @click="calculateDiuscountLevels(item.id)"
            >
              Расчитать процент скидки
            </button>
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

    <EditDiscountLevel
      v-model:is-open="isOpenEdit"
      v-model:products="products"
      v-model:discount-level="discountLevel"
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
import AddedDiscountLevel from '../components/DiscountLevel/AddedDiscountLevel.vue'
import EditDiscountLevel from '../components/DiscountLevel/EditDiscountLevel.vue'
import { useProduct } from '~/modules/admin/composables/useProduct'
import type { Product, PricingTier } from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'
import { useDiscountLevel } from '../composables/useDiscountLevel'

definePageMeta({
  layout: 'custom'
})

const { getAllProducts } = useProduct()

const { getAllDiscountLevel, getDiscountLevelById, generateDiscountPrice } =
  useDiscountLevel()

const products = ref<Product[]>([])
const product = ref<Product>()

const discountLevels = ref<PricingTier[]>([])
const discountLevel = ref<PricingTier>()

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await getAllProducts()
    const responseDiscountLevel = await getAllDiscountLevel()

    console.log(response)
    discountLevels.value = responseDiscountLevel
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
    const responseDiscountLevel = await getAllDiscountLevel()

    console.log(response)
    discountLevels.value = responseDiscountLevel
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
    const response = await getDiscountLevelById(id)
    discountLevel.value = response
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

async function calculateDiuscountLevels(id: number) {
  isLoading.value = true
  try {
    await generateDiscountPrice(id)
    updateProducts()
  } catch (e) {
    console.error('Ошибка при создании:', e)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>

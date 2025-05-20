<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список прайс-листа</h1>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedPriceList
        v-model:is-open="isOpenAdded"
        :product-names="productNameList"
        @update-price-list="updatePriceList"
      />
    </div>

    <!-- Карточки -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-3 items-center justify-center gap-4"
    >
      <template v-if="!isLoading">
        <!-- Карточка -->
        <div
          v-for="price in priceList"
          :key="price.id"
          class="card bg-base-100 mb-4 min-h-[220px] w-64 shadow-sm"
        >
          <div class="card-body flex flex-col justify-between">
            <h2 class="card-title">
              {{ price.product }}
            </h2>
            <div>
              <span class="text-sm text-gray-900"> Цена: </span>
              <span class="text-sm text-gray-500"> {{ price.price }} </span>
            </div>
            <div>
              <span class="text-sm text-gray-900"> Количество: </span>
              <span class="text-sm text-gray-500"> {{ price.quantity }} </span>
            </div>
            <div class="flex flex-wrap justify-end gap-2">
              <button
                class="btn btn-sm btn-error"
                @click="handleOpenDelete(price.id)"
              >
                Удалить
              </button>
              <button
                class="btn btn-sm btn-warning"
                @click="handleOpenEdit(price.id)"
              >
                Редактировать
              </button>
            </div>
          </div>
        </div></template
      >

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

    <EditPriceList v-model:is-open="isOpenEdit" :id-product="editProductId" />
    <DeletePriceList
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
    />
  </div>
</template>

<script setup lang="ts">
import AddedPriceList from '../components/PriceList/AddedPriceList.vue'
import EditPriceList from '../components/PriceList/EditPriceList.vue'
import DeletePriceList from '../components/PriceList/DeletePriceList.vue'
import type { PriceList, ProductNames } from '~/modules/shared/types/adminTypes'
import { usePrice } from '../composables/usePrice'
import { useProduct } from '../composables/useProduct'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'

definePageMeta({
  layout: 'custom'
})

const { getAllPrice } = usePrice()
const { getAllProductsName } = useProduct()
const priceList = ref<PriceList[]>([])
const productNameList = ref<ProductNames[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    const [priceResponse, productNamesResponse] = await Promise.all([
      getAllPrice(),
      getAllProductsName()
    ])

    const { product_names } = productNamesResponse

    productNameList.value = product_names
    priceList.value = priceResponse
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

const editProductId = ref<number | null>(null)
const deleteProductId = ref<number | null>(null)

function openModal() {
  isOpenAdded.value = true
}

function handleOpenEdit(id: number) {
  isOpenEdit.value = true
  editProductId.value = id
}

function handleOpenDelete(id: number) {
  isOpenDelete.value = true
  deleteProductId.value = id
}

async function updatePriceList() {
  isLoading.value = true
  try {
    const response = await getAllPrice()
    priceList.value = response
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>

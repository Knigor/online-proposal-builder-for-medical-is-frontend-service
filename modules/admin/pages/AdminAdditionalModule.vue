<template>
  <div>
    <h1 class="p-4 text-left text-2xl">
      Список дополнительных модулей (Функциональные блоки)
    </h1>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedAdditionalModuleModal
        v-model:is-open="isOpenAdded"
        :products="products"
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
          v-for="item in AdditionalModules"
          :key="item.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <h2 class="card-title">
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
                <span class="font-semibold">Цена предложения:</span>
                <span>{{ item.offer_price }} ₽</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Макс. скидка:</span>
                <span>{{ item.max_discount_percent }}%</span>
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
      v-if="AdditionalModules.length === 0 && !isLoading"
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
      @update-products="updateProducts"
    />
    <DeleteAdditionalModuleModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="updateProducts"
    />
  </div>
</template>

<script setup lang="ts">
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

definePageMeta({
  layout: 'custom'
})
const { getAllProducts } = useProduct()
const { getAllAdditionalModules, getAdditionalModuleById } =
  useAdditionalModule()

const AdditionalModules = ref<AdditionalModule[]>([])
const additional = ref<AdditionalModule>()
const products = ref<Product[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await getAllAdditionalModules()
    const responseProducts = await getAllProducts()

    AdditionalModules.value = response
    products.value = responseProducts
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
    const response = await getAllAdditionalModules()

    console.log(response)
    AdditionalModules.value = response
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
    const response = await getAdditionalModuleById(id)

    additional.value = response
    console.log(additional.value)
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

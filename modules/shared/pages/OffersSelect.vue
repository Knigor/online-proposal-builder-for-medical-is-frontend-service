<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
  >
    <div
      class="relative w-full max-w-md rounded-md border border-blue-300 bg-white p-6 shadow-md"
    >
      <progress
        class="progress progress-success absolute top-0 left-0 max-w-md"
        :value="currentProgress"
        max="100"
      ></progress>
      <h1>
        Пройдите опрос и выберите соответствующие фильтры и мы подберем для вас
        <br />
        <span class="text-orange-400">Коммерческое предложение</span>
      </h1>
      <br />
      <KeepAlive>
        <component
          :is="current"
          v-model:product-id="product_id"
          v-model:base-license-id="base_license_id"
          v-model:selected-modules="selectedModules"
          :products="ProductData"
          :licenses="BaseLicenseData"
          :additional-module="AdditionalModuleData"
          class="mt-2"
        ></component>
      </KeepAlive>
      <div class="mt-6 flex gap-4">
        <button
          v-if="currentIndex > 0"
          class="btn btn-outline btn-default border"
          @click="handleBack"
        >
          Назад
        </button>
        <button
          v-else
          class="btn btn-outline btn-default border"
          @click="navigateTo('/manager-lk')"
        >
          Назад
        </button>
        <button
          v-if="currentIndex === 0"
          class="btn btn-info border"
          @click="handleStartKP"
        >
          Начать
        </button>
        <button
          v-else-if="currentIndex < components.length - 1"
          class="btn btn-info border"
          @click="handleNext"
        >
          Далее
        </button>
        <button
          v-else
          class="btn btn-success border"
          @click="generateCommercialOffer(commercial_offer_id)"
        >
          Получить предложения
        </button>
        <!-- <button
          v-if="currentIndex === 0"
          class="btn btn-link btn-info"
          @click="navigateTo('/manager-lk')"
        >
          Пропустить
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TypeProduct from '../components/TypeProduct.vue'
import TypeAdditionalModule from '../components/TypeAdditionalModule.vue'
import TypeBaseLicense from '../components/TypeBaseLicense.vue'
import StartKP from '../components/StartKP.vue'
import { useCommercialOffer } from '~/modules/admin/composables/useCommercialOffer'
import type {
  CommercialOffersItems,
  Product,
  BaseLicenses,
  AdditionalModule
} from '../types/adminTypes'
import { useProduct } from '~/modules/admin/composables/useProduct'
import { useBaseLicenses } from '~/modules/admin/composables/useBaseLicenses'
import { useAdditionalModule } from '~/modules/admin/composables/useAdditionalModule'

const route = useRoute()

onMounted(async () => {
  if (route.query.id) {
    commercial_offer_id.value = Number(route.query.id)
    currentIndex.value = 1
  }

  try {
    const response = await getAllProducts()
    const responseBaseLicenses = await getAllBaseLicenses()
    const responseAdditionalModules = await getAllAdditionalModules()

    ProductData.value = response
    BaseLicenseData.value = responseBaseLicenses
    AdditionalModuleData.value = responseAdditionalModules
  } catch (error) {
    console.error(error)
  }
})

// DATA API
const ProductData = ref<Product[]>([])
const BaseLicenseData = ref<BaseLicenses[]>([])
const AdditionalModuleData = ref<AdditionalModule[]>([])
const commercial_offer_id = ref<number>(0)

const { createCommercialOffer, addedProductKP } = useCommercialOffer()

// получае продукты, лицензии и модули
const { getAllProducts } = useProduct()
const { getAllBaseLicenses } = useBaseLicenses()
const { getAllAdditionalModules } = useAdditionalModule()

const components = [StartKP, TypeProduct, TypeBaseLicense]
const currentIndex = ref(0)

const currentProgress = computed(
  () => ((currentIndex.value + 1) / components.length) * 100
)

const current = computed(() => components[currentIndex.value])

//FORM
const product_id = ref(0)
const base_license_id = ref(0)
// const additional_module_id = ref(0)
const selectedModules = ref<number[]>([])

//FORM SEND
const dataKPitems = ref<CommercialOffersItems>({
  product_id: product_id.value,
  base_license_id: base_license_id.value,
  additional_module_ids: selectedModules.value
})
// Следим за изменением переменных
watch(
  [product_id, base_license_id, selectedModules],
  ([newProductId, newBaseLicenseId, newSelectedModules]) => {
    dataKPitems.value = {
      product_id: newProductId,
      base_license_id: newBaseLicenseId,
      additional_module_ids: newSelectedModules
    }
  }
)

function handleNext() {
  if (currentIndex.value < components.length - 1) {
    currentIndex.value++
  }
}

function handleBack() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

async function handleStartKP() {
  try {
    const response = await createCommercialOffer()
    handleNext()
    commercial_offer_id.value = response.id
  } catch (error) {
    console.log(error)
  }
}

async function generateCommercialOffer(id: number) {
  try {
    await addedProductKP(dataKPitems.value, id)
    navigateTo('/manager-lk')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>

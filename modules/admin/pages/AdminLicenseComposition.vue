<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список связных модулей и лицензий</h1>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedLicenseCompositionModal
        v-model:is-open="isOpenAdded"
        :base-license-data="baseLicenseData"
        :additional-data="additionalData"
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
          v-for="item in licenseData"
          :key="item.id"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <div class="card-body">
            <div class="">
              <h2 class="card-title text-blue-600">
                {{ item.additionalModule.nameModule }}
              </h2>
              <span class="text-md">Связана c</span>
              <h2 class="card-title text-green-600">
                {{ item.baseLicense.nameLicense }}
              </h2>
            </div>

            <h1>Входят ли связанные модули?</h1>
            <div class="mt-4 flex flex-col gap-2">
              <div class="flex justify-between">
                <span class="font-semibold">Входит:</span>
                <span>{{ item.required ? 'Да' : 'Нет' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Сочетается:</span>
                <span>{{ item.compatible ? 'Да' : 'Нет' }}</span>
              </div>
            </div>

            <div class="flex flex-wrap justify-end gap-2">
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

    <EditLicenseCompositionModal
      v-model:is-open="isOpenEdit"
      v-model:license="license"
      v-model:is-loading="isLoadingEdit"
      :base-license-data="baseLicenseData"
      :additional-data="additionalData"
      :id-product="editProductId!"
      @update-products="updateProducts"
    />
    <DeleteLicenseCompositionModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="updateProducts"
    />
  </div>
</template>

<script setup lang="ts">
import AddedLicenseCompositionModal from '../components/LicenseComposition/AddedLicenseCompositionModal.vue'
import EditLicenseCompositionModal from '../components/LicenseComposition/EditLicenseCompositionModal.vue'
import DeleteLicenseCompositionModal from '../components/LicenseComposition/DeleteLicenseCompositionModal.vue'
import { useProduct } from '~/modules/admin/composables/useProduct'
import type {
  Product,
  LicenseComposition,
  AdditionalModule,
  BaseLicenses
} from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'
import { useLicenseComposition } from '../composables/useLicenseComposition'
import { useAdditionalModule } from '../composables/useAdditionalModule'
import { useBaseLicenses } from '../composables/useBaseLicenses'

definePageMeta({
  layout: 'custom'
})

const { getAllProducts } = useProduct()
const { getAllBaseLicenses } = useBaseLicenses()
const { getAllAdditionalModules } = useAdditionalModule()
const { getAllLicenseComposition, getLicenseCompositionById } =
  useLicenseComposition()

const licenseData = ref<LicenseComposition[]>([])
const license = ref<LicenseComposition>()

const additionalData = ref<AdditionalModule[]>([])
const baseLicenseData = ref<BaseLicenses[]>([])
const products = ref<Product[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await getAllProducts()
    const responseLicense = await getAllLicenseComposition()
    const responseBaseLicense = await getAllBaseLicenses()
    const responseAdditional = await getAllAdditionalModules()

    console.log(response)
    additionalData.value = responseAdditional
    baseLicenseData.value = responseBaseLicense
    licenseData.value = responseLicense
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
    const responseLicense = await getAllLicenseComposition()
    const responseBaseLicense = await getAllBaseLicenses()
    const responseAdditional = await getAllAdditionalModules()

    console.log(response)
    additionalData.value = responseAdditional
    baseLicenseData.value = responseBaseLicense
    licenseData.value = responseLicense
    products.value = response
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

async function handleOpenEdit(id: number) {
  isOpenEdit.value = true
  editProductId.value = id
  isLoadingEdit.value = true
  try {
    const response = await getLicenseCompositionById(id)
    license.value = response
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

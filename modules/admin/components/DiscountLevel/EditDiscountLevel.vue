<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <template v-if="isLoadingEdit">
                <SkeletonInput />
              </template>
              <template v-else>
                <h1 class="text-lg leading-6 font-medium text-gray-900">
                  Редактирование: <br />
                  {{ discountLevel?.product.name }}
                </h1>
                <br />

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">
                    Продукт
                  </label>
                  <select
                    v-model="productId"
                    class="select select-info mt-1 w-full border"
                  >
                    <option disabled>-- Выберите продукт --</option>
                    <option
                      v-for="item in products"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name_product }}
                    </option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">
                    Выберите тип
                  </label>
                  <select
                    v-model="type"
                    class="select select-info mt-1 w-full border"
                  >
                    <option disabled>-- Выберите продукт --</option>
                    <option
                      v-for="item in typeDiscount"
                      :key="item.id"
                      :value="item.type"
                    >
                      {{ item.type }}
                    </option>
                  </select>
                </div>

                <!-- Поля уровня скидки -->
                <div class="space-y-4">
                  <div class="flex gap-2">
                    <div class="w-1/2">
                      <label class="block text-sm font-medium text-gray-700">
                        Мин. лицензий
                      </label>
                      <input
                        v-model.number="minLicenses"
                        type="number"
                        class="input input-info border-info mt-1 w-full border"
                        min="1"
                      />
                    </div>
                    <div class="w-1/2">
                      <label class="block text-sm font-medium text-gray-700">
                        Макс. лицензий
                      </label>
                      <input
                        v-model.number="maxLicenses"
                        type="number"
                        class="input input-info border-info mt-1 w-full border"
                        min="1"
                      />
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <div class="w-1/2">
                      <label class="block text-sm font-medium text-gray-700">
                        Мин. сумма
                      </label>
                      <input
                        v-model.number="minAmount"
                        type="number"
                        class="input input-info border-info mt-1 w-full border"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="w-1/2">
                      <label class="block text-sm font-medium text-gray-700">
                        Макс. сумма
                      </label>
                      <input
                        v-model.number="maxAmount"
                        type="number"
                        class="input input-info border-info mt-1 w-full border"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex gap-4">
                  <button
                    class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    Назад
                  </button>
                  <button
                    :disabled="globalStore.loading"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    @click="editProduct"
                  >
                    <span v-if="!globalStore.loading">Сохранить</span>
                    <span v-else class="loading loading-bars loading-md"></span>
                  </button>
                </div>
              </template>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import SkeletonInput from '../skeletons/SkeletonInput.vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import type {
  createPricingTier,
  Product,
  PricingTier
} from '~/modules/shared/types/adminTypes'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import { useAuthStore } from '~/modules/auth/store/authStore'
import { useDiscountLevel } from '../../composables/useDiscountLevel'
import { typeDiscount } from '~/modules/shared/types/adminTypes'

const { updateDiscountLevel } = useDiscountLevel()

const authStore = useAuthStore()
const isOpen = defineModel<boolean>('isOpen')
const isLoadingEdit = defineModel<boolean>('isLoading')
const idProduct = defineModel<number>('idProduct')

const products = defineModel<Product[]>('products')

const discountLevel = defineModel<PricingTier>('discountLevel')

async function closeModal() {
  isOpen.value = false
}

const emit = defineEmits(['updateProducts'])
const globalStore = useGlobalStore()

// FORM
const productId = ref(0)
const type = ref('По количеству')
const minLicenses = ref(1)
const maxLicenses = ref(100)
const minAmount = ref(0)
const maxAmount = ref(100000)

watch(
  discountLevel,
  (newProduct) => {
    if (newProduct) {
      type.value = newProduct.type
      minLicenses.value = newProduct.min_licenses
      maxLicenses.value = newProduct.max_licenses
      minAmount.value = newProduct.min_amount
      maxAmount.value = newProduct.max_amount
      productId.value = newProduct.product.id
    }
  },
  { immediate: true }
)

async function editProduct() {
  globalStore.loading = true
  try {
    if (authStore.user?.id && idProduct.value) {
      const productUpdate: createPricingTier = {
        type: type.value,
        min_licenses: minLicenses.value,
        max_licenses: maxLicenses.value,
        min_amount: minAmount.value,
        max_amount: maxAmount.value,
        product_id: productId.value
      }
      const response = await updateDiscountLevel(idProduct.value, productUpdate)
      console.log(response)
    }
    emit('updateProducts')
    closeModal()
  } catch (error) {
    console.log(error)
  } finally {
    globalStore.loading = false
  }
}
</script>

<style scoped></style>

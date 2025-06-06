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
              <h1 class="text-lg leading-6 font-medium text-gray-900">
                Заполните поля для создания продукта
              </h1>
              <br />

              <!-- Поля для заполнения  -->
              <ProductForm
                v-model:name-product="nameProduct"
                v-model:is-active="isActive"
                v-model:description-product="descriptionProduct"
              />

              <!-- Новые поля -->
              <div class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Цена предложения</label
                  >
                  <input
                    v-model.number="offerPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    class="input input-info mt-1 border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Цена закупки</label
                  >
                  <input
                    v-model.number="purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    class="input input-info mt-1 border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Максимальная скидка (%)</label
                  >
                  <input
                    v-model.number="maxDiscountPercent"
                    type="number"
                    min="0"
                    max="100"
                    class="input input-info mt-1 border"
                  />
                </div>

                <!-- Селект с выбором Продукта -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Продукт</label
                  >
                  <select
                    v-model="currentProduct"
                    class="select select-info mt-1 border"
                  >
                    >
                    <option disabled :value="null">
                      -- Выберите продукт --
                    </option>
                    <option
                      v-for="item in products"
                      :key="item.id"
                      :value="item"
                    >
                      {{ item.name_product }}
                    </option>
                  </select>
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
                  :disabled="
                    globalStore.loading || !nameProduct || !descriptionProduct
                  "
                  :class="
                    globalStore.loading || !nameProduct || !descriptionProduct
                      ? ''
                      : 'hover:bg-indigo-700'
                  "
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50"
                  @click="createProduct"
                >
                  <span v-if="!globalStore.loading">Добавить</span>
                  <span v-else class="loading loading-bars loading-md"></span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import ProductForm from '../ProductForm.vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import { useAuthStore } from '~/modules/auth/store/authStore'

import type {
  AdditionalModuleCreate,
  Product
} from '~/modules/shared/types/adminTypes'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import { useAdditionalModule } from '../../composables/useAdditionalModule'

const isOpen = defineModel<boolean>('isOpen')
const products = defineModel<Product[]>('products')
const emit = defineEmits(['updateProducts'])

function closeModal() {
  isOpen.value = false
}

const { createAdditionalModule } = useAdditionalModule()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const nameProduct = ref('')
const descriptionProduct = ref('')
const currentProduct = ref<Product | null>(null)
const isActive = ref(false)
const offerPrice = ref(0)
const purchasePrice = ref(0)
const maxDiscountPercent = ref(0)

async function createProduct() {
  globalStore.loading = true
  try {
    if (authStore.user?.id) {
      const additionalCreate: AdditionalModuleCreate = {
        name_module: nameProduct.value,
        description_module: descriptionProduct.value,
        offer_price: offerPrice.value,
        purchase_price: purchasePrice.value,
        max_discount_percent: maxDiscountPercent.value,
        product_id: currentProduct.value?.id || 0
      }
      const response = await createAdditionalModule(additionalCreate)
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

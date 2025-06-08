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
                Заполните данные уровня скидки
              </h1>
              <br />

              <!-- Выбор продукта -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">
                  Продукт
                </label>
                <select
                  v-model="currentProduct"
                  class="select select-info mt-1 w-full border"
                >
                  <option disabled :value="null">-- Выберите продукт --</option>
                  <option v-for="item in products" :key="item.id" :value="item">
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
                  <option>По количеству</option>
                  <option>По сумме</option>
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

              <!-- Кнопки -->
              <div class="mt-6 flex justify-end gap-4">
                <button class="btn" @click="closeModal">Назад</button>
                <button
                  class="btn btn-primary"
                  :disabled="!currentProduct || !type"
                  @click="createProduct"
                >
                  <span v-if="!globalStore.loading">Добавить</span>
                  <span v-else class="loading loading-spinner"></span>
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
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import { useAuthStore } from '~/modules/auth/store/authStore'
import { useDiscountLevel } from '../../composables/useDiscountLevel'

import type {
  Product,
  createPricingTier
} from '~/modules/shared/types/adminTypes'

const isOpen = defineModel<boolean>('isOpen')
const products = defineModel<Product[]>('products')
const emit = defineEmits(['updateProducts'])

const globalStore = useGlobalStore()
const authStore = useAuthStore()
const { createDiscountLevel } = useDiscountLevel()

function closeModal() {
  isOpen.value = false
}

// Формы
const currentProduct = ref<Product | null>(null)
const type = ref('По количеству')
const minLicenses = ref(1)
const maxLicenses = ref(100)
const minAmount = ref(0)
const maxAmount = ref(100000)

async function createProduct() {
  if (!currentProduct.value) return
  globalStore.loading = true
  try {
    const payload: createPricingTier = {
      type: type.value,
      min_licenses: minLicenses.value,
      max_licenses: maxLicenses.value,
      min_amount: minAmount.value,
      max_amount: maxAmount.value,
      product_id: currentProduct.value.id
    }

    await createDiscountLevel(payload)
    emit('updateProducts')
    closeModal()
  } catch (e) {
    console.error('Ошибка при создании:', e)
  } finally {
    globalStore.loading = false
  }
}
</script>

<style scoped></style>

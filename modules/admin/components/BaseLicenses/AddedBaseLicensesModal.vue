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
                Создание новой лицензии
              </h1>
              <br />

              <!-- Основные поля -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Название лицензии
                  </label>
                  <input
                    v-model="nameLicense"
                    placeholder="Введите название лицензии"
                    type="text"
                    class="input input-info mt-1 w-full border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Описание лицензии
                  </label>
                  <textarea
                    v-model="descriptionLicense"
                    placeholder="Введите описание лицензии"
                    class="textarea textarea-info mt-1 w-full border"
                  />
                </div>
              </div>

              <!-- Финансовые поля -->
              <div class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Цена продления
                  </label>
                  <input
                    v-model.number="offerPriceLicense"
                    type="number"
                    min="0"
                    step="0.01"
                    class="input input-info mt-1 w-full border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Цена закупки
                  </label>
                  <input
                    v-model.number="purchasePriceLicense"
                    type="number"
                    min="0"
                    step="0.01"
                    class="input input-info mt-1 w-full border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Максимальная скидка (%)
                  </label>
                  <input
                    v-model.number="maxDiscount"
                    type="number"
                    min="0"
                    max="100"
                    class="input input-info mt-1 w-full border"
                  />
                </div>
              </div>

              <!-- Селекты -->
              <div class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Тип лицензии
                  </label>
                  <select
                    v-model="typeLicense"
                    class="select select-info mt-1 w-full border"
                  >
                    <option value="Редакция">Редакция</option>
                    <option value="Программный комплекс">
                      Программный комплекс
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Продукт
                  </label>
                  <select
                    v-model="productId"
                    class="select select-info mt-1 w-full border"
                  >
                    <option disabled :value="0">-- Выберите продукт --</option>
                    <option
                      v-for="product in products"
                      :key="product.id"
                      :value="product.id"
                    >
                      {{ product.name_product }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="mt-6 flex gap-4">
                <button class="btn btn-outline border" @click="closeModal">
                  Назад
                </button>
                <button
                  :disabled="isSubmitDisabled"
                  class="btn btn-primary w-24 border"
                  @click="createLicense"
                >
                  <span v-if="!globalStore.loading">Создать</span>
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
import { ref, computed } from 'vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import { useAuthStore } from '~/modules/auth/store/authStore'
import type {
  BaseLicenseCreate,
  Product
} from '~/modules/shared/types/adminTypes'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import { useBaseLicenses } from '../../composables/useBaseLicenses'

const isOpen = defineModel<boolean>('isOpen')
const products = defineModel<Product[]>('products')
const emit = defineEmits(['updateProducts'])

const { createBaseLicense } = useBaseLicenses()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

// Form fields
const nameLicense = ref('')
const descriptionLicense = ref('')
const offerPriceLicense = ref(0)
const purchasePriceLicense = ref(0)
const maxDiscount = ref(0)
const typeLicense = ref('Редакция')
const productId = ref(0)

const isSubmitDisabled = computed(() => {
  return (
    globalStore.loading ||
    !nameLicense.value ||
    !descriptionLicense.value ||
    productId.value === 0
  )
})

function closeModal() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  nameLicense.value = ''
  descriptionLicense.value = ''
  offerPriceLicense.value = 0
  purchasePriceLicense.value = 0
  maxDiscount.value = 0
  typeLicense.value = 'Редакция'
  productId.value = 0
}

async function createLicense() {
  globalStore.loading = true
  try {
    if (authStore.user?.id) {
      const licenseData: BaseLicenseCreate = {
        name_license: nameLicense.value,
        description_license: descriptionLicense.value,
        offer_price_license: offerPriceLicense.value,
        purchase_price_license: purchasePriceLicense.value,
        max_discount: maxDiscount.value,
        type_license: typeLicense.value,
        product_id: productId.value
      }
      await createBaseLicense(licenseData)
      emit('updateProducts')
      closeModal()
    }
  } catch (error) {
    console.error('Error creating license:', error)
  } finally {
    globalStore.loading = false
  }
}
</script>

<style scoped></style>

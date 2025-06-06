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
                Включение модулей и лицензии
              </h1>
              <br />

              <!-- Основные поля -->
              <div class="space-y-4">
                <div>
                  <label class="label text-gray-900">
                    <input
                      v-model="required"
                      type="checkbox"
                      class="checkbox checkbox-info border"
                    />
                    Обязательно входит
                  </label>
                </div>

                <div>
                  <label class="label text-gray-900">
                    <input
                      v-model="compatible"
                      type="checkbox"
                      class="checkbox checkbox-info border"
                    />
                    Сочетается
                  </label>
                </div>
              </div>

              <!-- Селекты -->
              <div class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Выберите лицензию
                  </label>
                  <select
                    v-model="licenseId"
                    class="select select-info mt-1 w-full border"
                  >
                    <option disabled :value="0">-- Выберите лицензию --</option>
                    <option
                      v-for="item in baseLicenseData"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.nameLicense }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Выберите дополнительный модуль
                  </label>
                  <select
                    v-model="additionalId"
                    class="select select-info mt-1 w-full border"
                  >
                    <option disabled :value="0">-- Выберите модуль --</option>
                    <option
                      v-for="product in additionalData"
                      :key="product.id"
                      :value="product.id"
                    >
                      {{ product.name_module }}
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
  BaseLicenses,
  AdditionalModule,
  createLicenseComposition
} from '~/modules/shared/types/adminTypes'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import { useLicenseComposition } from '../../composables/useLicenseComposition'

const isOpen = defineModel<boolean>('isOpen')
const emit = defineEmits(['updateProducts'])

const baseLicenseData = defineModel<BaseLicenses[]>('baseLicenseData')
const additionalData = defineModel<AdditionalModule[]>('additionalData')

const { createLicenseCompositionPOST } = useLicenseComposition()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

// Form fields
const required = ref(false)
const compatible = ref(false)
const licenseId = ref(0)
const additionalId = ref(0)

const isSubmitDisabled = computed(() => {
  return globalStore.loading
})

function closeModal() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  required.value = false
  compatible.value = false
}

async function createLicense() {
  globalStore.loading = true
  try {
    if (authStore.user?.id) {
      const licenseDataTransfer: createLicenseComposition = {
        required: required.value,
        compatible: compatible.value,
        base_license_id: licenseId.value,
        additional_module_id: additionalId.value
      }
      await createLicenseCompositionPOST(licenseDataTransfer)
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

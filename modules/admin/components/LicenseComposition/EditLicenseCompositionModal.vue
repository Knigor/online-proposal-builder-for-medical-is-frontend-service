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
                  Включение модулей и лицензии
                </h1>
                <br />

                <!-- Выбор лицензии -->
                <div class="mt-4">
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

                <!-- Добавление модулей -->
                <div class="mt-6 space-y-4">
                  <h2 class="text-md font-medium text-gray-900">
                    Добавленные модули
                  </h2>
                  <div
                    v-for="(module, index) in modules"
                    :key="index"
                    class="rounded-lg border p-4"
                  >
                    <div class="mb-2 flex items-center justify-between">
                      <span class="font-medium">{{
                        getModuleName(module.module_id)
                      }}</span>
                      <button
                        @click="removeModule(index)"
                        class="text-red-500 hover:text-red-700"
                      >
                        Удалить
                      </button>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center gap-4">
                        <span class="text-sm font-medium">Тип включения:</span>
                        <label class="flex items-center gap-2">
                          <input
                            v-model="module.selection"
                            type="radio"
                            :name="'selection-' + module.module_id"
                            value="required"
                            class="radio radio-primary border"
                          />
                          Обязательно входит
                        </label>
                        <label class="flex items-center gap-2">
                          <input
                            v-model="module.selection"
                            type="radio"
                            :name="'selection-' + module.module_id"
                            value="compatible"
                            class="radio radio-primary border"
                          />
                          Сочетается
                        </label>
                        <label class="flex items-center gap-2">
                          <input
                            v-model="module.selection"
                            type="radio"
                            :name="'selection-' + module.module_id"
                            value="none"
                            class="radio radio-primary border"
                          />
                          Ничего
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Добавление нового модуля -->
                  <div class="border-t pt-4">
                    <div class="flex gap-4">
                      <select
                        v-model="newModuleId"
                        class="select select-info flex-1 border"
                      >
                        <option disabled :value="0">
                          -- Выберите модуль --
                        </option>
                        <option
                          v-for="product in availableModules"
                          :key="product.id"
                          :value="product.id"
                        >
                          {{ product.name_module }}
                        </option>
                      </select>
                      <button
                        @click="addModule"
                        class="btn btn-primary border"
                        :disabled="!newModuleId"
                      >
                        Добавить модуль
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex gap-4">
                  <button class="btn btn-outline border" @click="closeModal">
                    Назад
                  </button>
                  <button
                    :disabled="isSubmitDisabled"
                    class="btn btn-primary w-24 border"
                    @click="updateLicense"
                  >
                    <span v-if="!globalStore.loading">Сохранить</span>
                    <span v-else class="loading loading-spinner"></span>
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
import { ref, computed, watch } from 'vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import { useAuthStore } from '~/modules/auth/store/authStore'
import type {
  BaseLicenses,
  AdditionalModule,
  createLicenseComposition,
  licenseModule,
  LicenseComposition
} from '~/modules/shared/types/adminTypes'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import SkeletonInput from '../skeletons/SkeletonInput.vue'
import { useLicenseComposition } from '../../composables/useLicenseComposition'

const { updateLicenseComposition } = useLicenseComposition()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const baseLicenseData = defineModel<BaseLicenses[]>('baseLicenseData')
const additionalData = defineModel<AdditionalModule[]>('additionalData')

const isOpen = defineModel<boolean>('isOpen')
const isLoadingEdit = defineModel<boolean>('isLoading')
const idProduct = defineModel<number>('idProduct')
const licenseData = defineModel<LicenseComposition>('license')

console.log(licenseData.value)
// FORM
const licenseId = ref(0)
const newModuleId = ref(0)
const modules = ref<licenseModule[]>([])

const isSubmitDisabled = computed(() => {
  return globalStore.loading
})

watch(
  licenseData,
  (newLicense) => {
    if (newLicense) {
      licenseId.value = newLicense.base_license_id
    }
  },
  { immediate: true }
)

async function closeModal() {
  isOpen.value = false
}

async function updateLicense() {
  globalStore.loading = true
  try {
    if (authStore.user?.id && idProduct.value) {
      const licenseUpdate: createLicenseComposition = {
        required: required.value,
        compatible: compatible.value,
        base_license_id: licenseId.value,
        additional_module_id: additionalId.value
      }
      await updateLicenseComposition(idProduct.value, licenseUpdate)

      emit('updateProducts')
      closeModal()
    }
  } catch (error) {
    console.error('Error updating license:', error)
  } finally {
    globalStore.loading = false
  }
}

const emit = defineEmits(['updateProducts'])
</script>

<style scoped></style>

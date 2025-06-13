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
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
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
                      <option disabled :value="0">-- Выберите модуль --</option>
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
  createLicenseComposition,
  licenseModule
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
const licenseId = ref(0)
const newModuleId = ref(0)
const modules = ref<licenseModule[]>([])

const isSubmitDisabled = computed(() => {
  return globalStore.loading || !licenseId.value || modules.value.length === 0
})

// Доступные для добавления модули (исключая уже добавленные)
const availableModules = computed(() => {
  if (!additionalData.value) return []
  return additionalData.value.filter(
    (module) => !modules.value.some((m) => m.module_id === module.id)
  )
})

function getModuleName(moduleId: number) {
  const module = additionalData.value?.find((m) => m.id === moduleId)
  return module?.name_module || 'Неизвестный модуль'
}

function addModule() {
  if (!newModuleId.value) return

  modules.value.push({
    module_id: newModuleId.value,
    selection: 'none' // значение по умолчанию
  })

  newModuleId.value = 0
}

function removeModule(index: number) {
  modules.value.splice(index, 1)
}

function closeModal() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  licenseId.value = 0
  newModuleId.value = 0
  modules.value = []
}

async function createLicense() {
  globalStore.loading = true
  try {
    if (authStore.user?.id && licenseId.value && modules.value.length > 0) {
      const licenseDataTransfer: createLicenseComposition = {
        base_license_id: licenseId.value,
        modules: modules.value.map((module) => ({
          module_id: module.module_id,
          required: module.selection === 'required',
          compatible: module.selection === 'compatible'
        }))
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

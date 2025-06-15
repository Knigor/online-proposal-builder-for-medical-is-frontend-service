<template>
  <div class="space-y-4">
    <!-- License Selector -->
    <div class="form-control">
      <label class="label">
        <span class="label-text text-gray-700">Выберите лицензию</span>
      </label>
      <select
        v-model="base_license_id"
        class="select select-bordered select-info w-full border"
        :disabled="isLoading"
        @change="handleLicenseChange"
      >
        <option disabled :value="0">-- Выберите лицензию --</option>
        <option v-for="item in BaseLicenseData" :key="item.id" :value="item.id">
          {{ item.nameLicense }}
        </option>
      </select>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-info"></span>
    </div>

    <!-- Modules List -->
    <div v-else-if="moduleListById.length > 0" class="space-y-2">
      <label class="label">
        <span class="label-text text-gray-700">Доступные модули</span>
      </label>
      <div class="max-h-96 overflow-y-auto rounded-lg border p-4">
        <div
          v-for="module in moduleListById"
          :key="module.id"
          class="form-control"
        >
          <label class="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              :checked="isModuleSelected(module.id)"
              class="checkbox checkbox-info border"
              @change="toggleModule(module.id)"
            />
            <span class="label-text">
              {{ module.name }}
              <span v-if="module.relation" class="text-info">
                ({{ module.price }} ₽)
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- No Modules Message -->
    <div v-else class="alert alert-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>Нет доступных модулей для выбранной лицензии</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseLicenses, AdditionalModules } from '../types/adminTypes'
import { useLicenseComposition } from '~/modules/admin/composables/useLicenseComposition'
import { ref, watch } from 'vue'

const base_license_id = defineModel<number>('baseLicenseId', { required: true })
const BaseLicenseData = defineModel<BaseLicenses[]>('licenses', {
  required: true
})
// Теперь храним только массив ID
const selectedModules = defineModel<number[]>('selectedModules', {
  default: () => []
})

const moduleListById = ref<AdditionalModules[]>([])
const isLoading = ref(false)

const { getLicenseCompositionById } = useLicenseComposition()

async function handleLicenseChange() {
  try {
    isLoading.value = true
    moduleListById.value = []

    if (base_license_id.value) {
      const response = await getLicenseCompositionById(
        Number(base_license_id.value)
      )
      moduleListById.value = response.additional_modules || []
      // Сбрасываем выбранные модули при смене лицензии
      selectedModules.value = []
    }
  } catch (error) {
    console.error('Error loading modules:', error)
    moduleListById.value = []
  } finally {
    isLoading.value = false
  }
}

function toggleModule(moduleId: number) {
  const index = selectedModules.value.indexOf(moduleId)

  if (index === -1) {
    // Добавляем ID модуля
    selectedModules.value = [...selectedModules.value, moduleId]
  } else {
    // Удаляем ID модуля
    selectedModules.value = selectedModules.value.filter(
      (id) => id !== moduleId
    )
  }
}

function isModuleSelected(moduleId: number): boolean {
  return selectedModules.value.includes(moduleId)
}

// Инициализация при монтировании
watch(
  () => base_license_id.value,
  (newVal) => {
    if (newVal) handleLicenseChange()
  },
  { immediate: true }
)
</script>

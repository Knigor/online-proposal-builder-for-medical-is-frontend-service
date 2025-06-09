<template>
  <label class="block text-sm font-medium text-gray-700">
    Выберите дополнительный модуль
  </label>
  <select
    v-model="additional_module_id"
    class="select select-info mt-1 w-full border"
  >
    <option disabled :value="0">-- Выберите дополнительный модуль --</option>
    <option
      v-for="item in AdditionalModuleData"
      :key="item.id"
      :value="item.id"
    >
      {{ item.name_module }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { AdditionalModule } from '../types/adminTypes'

const additional_module_id = defineModel<number>('additional_module_id')
const AdditionalModuleData =
  defineModel<AdditionalModule[]>('additional-module')
</script>

<style scoped></style>

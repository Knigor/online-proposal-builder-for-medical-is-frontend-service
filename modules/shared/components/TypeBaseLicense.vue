<template>
  <label class="block text-sm font-medium text-gray-700">
    Выберите лицензию
  </label>
  <select
    v-model="base_license_id"
    class="select select-info mt-1 w-full border"
  >
    <option disabled :value="0">-- Выберите лицензию --</option>
    <option v-for="item in BaseLicenseData" :key="item.id" :value="item.id">
      {{ item.nameLicense }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { BaseLicenses } from '../types/adminTypes'

const base_license_id = defineModel<number>('baseLicenseId')
const BaseLicenseData = defineModel<BaseLicenses[]>('licenses')
</script>

<style scoped></style>

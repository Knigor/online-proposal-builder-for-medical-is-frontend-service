<template>
  <div class="flex flex-col gap-4">
    <p class="">Минимальная цена</p>
    <input
      v-model="minValue"
      type="range"
      min="0"
      max="100000"
      class="range range-info"
    />
    <input
      v-model="minValue"
      type="text"
      min="0"
      max="10000"
      placeholder="Введите минимальную сумму"
      class="input input-info border"
    />
  </div>
</template>

<script setup lang="ts">
const minValue = defineModel<number>('minValue')
</script>

<style scoped></style>

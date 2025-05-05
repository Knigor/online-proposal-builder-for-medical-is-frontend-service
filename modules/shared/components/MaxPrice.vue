<template>
  <div class="flex flex-col gap-4">
    <p>Максимальная цена</p>
    <input
      v-model="maxValue"
      type="range"
      :min="0"
      :max="100000"
      class="range range-info"
    />

    <input
      v-model="maxValue"
      type="text"
      min="0"
      max="10000"
      placeholder="Введите минимальную сумму"
      class="input input-info border"
    />
  </div>
</template>

<script setup lang="ts">
const maxValue = defineModel<number>('maxValue')
</script>

<style scoped></style>

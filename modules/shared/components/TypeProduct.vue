<template>
  <select v-model="currentProduct" class="select select-info border">
    <option v-for="item in TypeProduct" :key="item" :value="item">
      {{ item }}
    </option>
  </select>
</template>

<script setup lang="ts">
const TypeProduct = [
  'СиМед-Клиника',
  'СиМед-Лаборатория',
  'СиМед-Электронный',
  'СиМед-Обслуживание',
  'СиМед'
]

const currentProduct = defineModel<string>('currentProduct')
</script>

<style scoped></style>

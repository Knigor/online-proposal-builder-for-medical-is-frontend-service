<template>
  <label class="block text-sm font-medium text-gray-700">
    Выберите продукт
  </label>
  <select v-model="product_id" class="select select-info mt-1 w-full border">
    <option disabled :value="0">-- Выберите продукт --</option>
    <option v-for="item in productData" :key="item.id" :value="item.id">
      {{ item.name_product }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { Product } from '../types/adminTypes'

const product_id = defineModel<number>('productId')
const productData = defineModel<Product[]>('products')
</script>

<style scoped></style>

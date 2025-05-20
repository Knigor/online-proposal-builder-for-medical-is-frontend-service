<template>
  <div class="flex flex-col gap-1">
    <label>Выберите продукт</label>
    <select v-model="currentProduct" class="select select-info border">
      <option v-for="item in productList" :key="item.id" :value="item.id">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { ProductNames } from '~/modules/shared/types/adminTypes'
// const ProductList = [
//   { id: 1, name: 'Медицинская информационная система' },
//   { id: 2, name: 'Лабораторная информационная система' },
//   { id: 3, name: 'Системы электронной очереди СиМед' },
//   { id: 4, name: 'Терминал самообслуживания СиМед' }
// ]

const productList = defineModel<ProductNames[]>('productList')
const currentProduct = defineModel<number>('currentProduct')

if (currentProduct.value === undefined && productList.value) {
  currentProduct.value = productList.value[0].id
}
</script>

<style scoped></style>

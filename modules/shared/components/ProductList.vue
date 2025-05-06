<template>
  <div class="flex flex-col gap-1">
    <label>Выберите продукт</label>
    <select v-model="currentProduct" class="select select-info border">
      <option v-for="item in ProductList" :key="item.id" :value="item.id">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const ProductList = [
  { id: 1, name: 'Медицинская информационная система' },
  { id: 2, name: 'Лабораторная информационная система' },
  { id: 3, name: 'Системы электронной очереди СиМед' },
  { id: 4, name: 'Терминал самообслуживания СиМед' }
]

const currentProduct = defineModel<number>('currentProduct')

if (currentProduct.value === undefined) {
  currentProduct.value = ProductList[0].id
}
</script>

<style scoped></style>

<template>
  <div class="my-4 flex flex-col gap-4">
    <!-- Название продукта -->
    <div class="flex flex-col gap-1">
      <label for="price">Введите цену для продукта</label>
      <input
        id="price"
        v-model="priceProduct"
        type="text"
        placeholder="Введите цену"
        class="input input-info border"
      />
    </div>
    <!-- Описание продукта -->
    <div class="flex flex-col gap-1">
      <label for="percent">Введите скидку для продукта</label>
      <input
        id="percent"
        v-model="discountPercent"
        type="text"
        placeholder="Введите процент скидки"
        class="input input-info border"
      />
    </div>

    <div class="flex flex-col gap-1">
      <label for="description">Кол-во продукта</label>
      <input
        id="description"
        v-model="quantityProduct"
        type="text"
        placeholder="Введите кол-во продуктов"
        class="input input-info border"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const priceProduct = defineModel<number>('priceProduct')
const discountPercent = defineModel<number>('discountPercent')
const quantityProduct = defineModel<number>('quantityProduct')
</script>

<style scoped></style>

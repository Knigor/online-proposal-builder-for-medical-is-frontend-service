<template>
  <div class="mb-4 flex flex-col gap-4">
    <!-- Название продукта -->
    <div class="flex flex-col gap-1">
      <label for="name">Название продукта</label>
      <input
        id="name"
        v-model="nameProduct"
        type="text"
        placeholder="Введите название продукта"
        class="input input-info border"
      />
    </div>
    <!-- Описание продукта -->
    <div class="flex flex-col gap-1">
      <label for="description">Описание продукта</label>
      <textarea
        id="description"
        v-model="descriptionProduct"
        placeholder="Введите описание продукта"
        class="textarea textarea-info max-h-[150px] border"
      >
      </textarea>
    </div>
    <!-- Активность -->
    <div class="flex gap-2">
      <input
        id="isActive"
        v-model="isActive"
        type="checkbox"
        class="checkbox checkbox-info border"
      />
      <label for="isActive">Сделать активным?</label>
    </div>
  </div>
</template>

<script setup lang="ts">
const nameProduct = defineModel<string>('nameProduct')
const descriptionProduct = defineModel<string>('descriptionProduct')
const isActive = defineModel<boolean>('isActive')
</script>

<style scoped></style>

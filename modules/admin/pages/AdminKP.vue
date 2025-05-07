<template>
  <div
    class="mx-auto mt-4 flex max-w-[500px] flex-col items-center justify-center border p-6 shadow-2xl"
  >
    <h1 class="mb-4 text-lg font-bold">Добавить коммерческое предложение</h1>

    <div
      v-for="(productId, index) in products"
      :key="index"
      class="mb-4 w-full max-w-md"
    >
      <ProductList v-model:current-product="products[index]" />
      <button class="btn btn-xs btn-error mt-1" @click="removeProduct(index)">
        Удалить
      </button>
    </div>

    <button class="btn btn-outline btn-sm mb-6" @click="addProduct">
      + Добавить продукт
    </button>

    <div class="mt-4 flex gap-4">
      <button class="btn btn-outline" @click="$router.back()">Назад</button>
      <button
        class="btn btn-accent w-24"
        :disabled="globalStore.loading"
        @click="createProduct"
      >
        <span v-if="!globalStore.loading">Добавить</span>
        <span v-else class="loading loading-bars loading-md"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductList from '~/modules/shared/components/ProductList.vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'

definePageMeta({
  layout: 'custom'
})

const globalStore = useGlobalStore()

const products = ref<number[]>([]) // Массив ID выбранных продуктов

function addProduct() {
  products.value.push(1) // по умолчанию выбран первый продукт
}

function removeProduct(index: number) {
  products.value.splice(index, 1)
}

async function createProduct() {
  console.log('Отправляем продукты:', products.value)
  globalStore.loading = true
  setTimeout(() => {
    globalStore.loading = false
  }, 500)
}
</script>

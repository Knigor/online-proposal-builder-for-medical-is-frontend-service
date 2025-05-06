<template>
  <div
    class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden"
  >
    <div
      class="relative w-full max-w-md rounded-md border border-blue-300 bg-white p-6 shadow-md"
    >
      <h1>Добавить коммерческое предложение</h1>
      <br />

      <!-- Селект с выбором типа -->

      <ProductList :current-product="currentProduct" />

      <div class="mt-6 flex gap-4">
        <button class="btn btn-outline border" @click="$router.back()">
          Назад
        </button>
        <button
          :disabled="globalStore.loading"
          class="btn btn-accent w-24 border"
          @click="createProduct"
        >
          <span v-if="!globalStore.loading">Добавить</span>
          <span v-else class="loading loading-bars loading-md"></span>
        </button>
      </div>
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
const currentProduct = ref<number>()

async function createProduct() {
  globalStore.loading = true
  setTimeout(() => {
    globalStore.loading = false
  }, 500)
}
</script>

<style scoped></style>

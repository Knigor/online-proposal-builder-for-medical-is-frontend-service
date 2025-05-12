<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <h1 class="mb-4 text-lg font-bold">
                Добавить коммерческое предложение
              </h1>

              <div
                v-for="(productId, index) in products"
                :key="index"
                class="mb-4 w-full max-w-md"
              >
                <ProductList v-model:current-product="products[index]" />
                <button
                  class="btn btn-xs btn-error mt-1"
                  @click="removeProduct(index)"
                >
                  Удалить
                </button>
              </div>

              <button class="btn btn-outline btn-sm mb-6" @click="addProduct">
                + Добавить продукт
              </button>

              <div class="mt-4 flex gap-4">
                <button class="btn btn-outline" @click="closeModal">
                  Назад
                </button>
                <button
                  class="btn btn-accent w-24"
                  :disabled="globalStore.loading"
                  @click="createProduct"
                >
                  <span v-if="!globalStore.loading">Добавить</span>
                  <span v-else class="loading loading-bars loading-md"></span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import ProductList from '~/modules/shared/components/ProductList.vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'

const isOpen = defineModel<boolean>('isOpen')

function closeModal() {
  isOpen.value = false
}

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

<style scoped></style>

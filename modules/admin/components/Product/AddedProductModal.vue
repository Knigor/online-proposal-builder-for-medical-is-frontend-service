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
              <h1>Заполните поля для создания продукта</h1>
              <br />

              <!-- Поля для заполнения  -->
              <ProductForm
                :name-product="nameProduct"
                :is-active="isActive"
                :description-product="descriptionProduct"
              />

              <!-- Селект с выбором типа -->

              <TypeProduct :current-product="currentProduct" />

              <div class="mt-6 flex gap-4">
                <button class="btn btn-outline border" @click="closeModal">
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
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import ProductForm from '../ProductForm.vue'
import TypeProduct from '~/modules/shared/components/TypeProduct.vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
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

const globalStore = useGlobalStore()
const nameProduct = ref('')
const descriptionProduct = ref('')
const isActive = ref(false)
const currentProduct = ref('СиМед-Клиника')

async function createProduct() {
  globalStore.loading = true
  setTimeout(() => {
    globalStore.loading = false
  }, 500)
}
</script>

<style scoped></style>

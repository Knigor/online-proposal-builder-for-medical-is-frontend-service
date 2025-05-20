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
              <h1>Заполните поля для прайс-листа продукта</h1>
              <br />

              <!-- Выбор продукта  -->

              <ProductList
                v-model:current-product="currentProduct"
                :product-list="productNameList"
              />

              <!-- Поля для заполнения  -->
              <PriceListForm
                v-model:quantity-product="quantityProduct"
                v-model:price-product="priceProduct"
                v-model:discount-percent="discountPercent"
              />

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
import PriceListForm from '../PriceListForm.vue'
import ProductList from '~/modules/shared/components/ProductList.vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import type {
  ProductNames,
  PriceUpdate
} from '~/modules/shared/types/adminTypes'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import { usePrice } from '../../composables/usePrice'

const { addedPrice } = usePrice()
const isOpen = defineModel<boolean>('isOpen')
const productNameList = defineModel<ProductNames[]>('productNames')
const emit = defineEmits(['updatePriceList'])

const currentProduct = ref<number>()
const quantityProduct = ref<number>()
const priceProduct = ref<number>()
const discountPercent = ref<number>()

function closeModal() {
  isOpen.value = false
}

const globalStore = useGlobalStore()

async function createProduct() {
  globalStore.loading = true

  try {
    const priceUpdate: PriceUpdate = {
      product_id: currentProduct.value!,
      price: priceProduct.value!,
      discount_percent: discountPercent.value!,
      quantity: quantityProduct.value!
    }
    const response = await addedPrice(priceUpdate)
    console.log(response)

    emit('updatePriceList')
    closeModal()
  } catch (error) {
    console.log(error)
  } finally {
    globalStore.loading = false
  }
}
</script>

<style scoped></style>

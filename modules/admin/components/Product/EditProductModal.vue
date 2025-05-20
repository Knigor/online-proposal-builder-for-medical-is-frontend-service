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
              <template v-if="isLoadingEdit">
                <SkeletonInput />
              </template>
              <template v-else>
                <h1>
                  Заполните поля для редактирования продукта {{ product?.id }}
                </h1>
                <br />

                <!-- Поля для заполнения  -->
                <ProductForm
                  v-model:name-product="nameProduct"
                  v-model:is-active="isActive"
                  v-model:description-product="descriptionProduct"
                />

                <!-- Селект с выбором типа -->

                <TypeProduct v-model:current-product="currentProduct" />

                <div class="mt-6 flex gap-4">
                  <button class="btn btn-outline border" @click="closeModal">
                    Назад
                  </button>
                  <button
                    :disabled="globalStore.loading"
                    class="btn btn-accent w-24 border"
                    @click="editProduct"
                  >
                    <span v-if="!globalStore.loading">Сохранить</span>
                    <span v-else class="loading loading-bars loading-md"></span>
                  </button>
                </div>
              </template>
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
import SkeletonInput from '../skeletons/SkeletonInput.vue'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import type { Product, ProductUpdate } from '~/modules/shared/types/adminTypes'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import { useProduct } from '../../composables/useProduct'
import { useAuthStore } from '~/modules/auth/store/authStore'

const { editProductById } = useProduct()
const authStore = useAuthStore()
const isOpen = defineModel<boolean>('isOpen')
const isLoadingEdit = defineModel<boolean>('isLoading')
const idProduct = defineModel<number>('idProduct')
const product = defineModel<Product>('product')

async function closeModal() {
  isOpen.value = false
}

const emit = defineEmits(['updateProducts'])

const globalStore = useGlobalStore()

const nameProduct = ref('')
const descriptionProduct = ref('')

const isActive = ref()
const currentProduct = ref('')

watch(product, (newProduct) => {
  if (newProduct) {
    nameProduct.value = newProduct.nameProduct
    descriptionProduct.value = newProduct.discriptionProduct
    isActive.value = newProduct.isActive
    currentProduct.value = newProduct.typeProduct
  }
})

async function editProduct() {
  globalStore.loading = true
  try {
    if (authStore.user?.id && idProduct.value) {
      const productUpdate: ProductUpdate = {
        userId: authStore.user.id,
        nameProduct: nameProduct.value,
        discriptionProduct: descriptionProduct.value,
        isActive: isActive.value,
        typeProduct: currentProduct.value
      }
      const response = await editProductById(idProduct.value, productUpdate)
      console.log(response)
    }
    emit('updateProducts')
    closeModal()
  } catch (error) {
    console.log(error)
  } finally {
    globalStore.loading = false
  }
}
</script>

<style scoped></style>

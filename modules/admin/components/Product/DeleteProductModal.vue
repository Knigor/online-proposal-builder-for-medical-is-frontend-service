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
              <h1>Вы уверены что хотите удалить продукт {{ idProduct }} ?</h1>

              <div class="mt-6 flex gap-4">
                <button class="btn btn-outline border" @click="closeModal">
                  Назад
                </button>
                <button
                  :disabled="globalStore.loading"
                  class="btn btn-error w-24 border"
                  @click="deleteProduct"
                >
                  <span v-if="!globalStore.loading">Удалить</span>
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
import { useProduct } from '../../composables/useProduct'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'

const isOpen = defineModel<boolean>('isOpen')
const idProduct = defineModel<number | null>('idProduct')
const { deleteproductById } = useProduct()
const emit = defineEmits(['updateProducts'])

function closeModal() {
  isOpen.value = false
}

const globalStore = useGlobalStore()

async function deleteProduct() {
  globalStore.loading = true
  try {
    if (idProduct.value) {
      const response = await deleteproductById(idProduct.value)
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

<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список продуктов</h1>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedProductModal v-model:is-open="isOpenAdded" />
    </div>

    <!-- Карточки -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-3 items-center justify-center gap-4"
    >
      <!-- Карточка -->
      <div
        v-for="i in 16"
        :key="i"
        class="card bg-base-100 mb-4 w-64 shadow-sm"
      >
        <div class="card-body">
          <h2 class="card-title">
            Card Title
            <div v-if="!status" class="badge badge-accent p-2">NEW</div>
            <div v-else class="badge badge-error p-2">NEW</div>
          </h2>
          <p>
            {{ truncate(text, 60) }}
          </p>
          <div class="flex flex-wrap justify-end gap-2">
            <button class="btn btn-sm btn-error" @click="handleOpenDelete(i)">
              Удалить
            </button>
            <button class="btn btn-sm btn-warning" @click="handleOpenEdit(i)">
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>

    <EditProductModal
      v-model:is-open="isOpenEdit"
      :id-product="editProductId"
    />
    <DeleteProductModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
    />
  </div>
</template>

<script setup lang="ts">
import AddedProductModal from '../components/Product/AddedProductModal.vue'
import EditProductModal from '../components/Product/EditProductModal.vue'
import DeleteProductModal from '../components/Product/DeleteProductModal.vue'

definePageMeta({
  layout: 'custom'
})

const isOpenAdded = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)
const text = ref(
  'A card component has a figure, a body part, and inside body there, are title and actions parts'
)
const editProductId = ref<number | null>(null)
const deleteProductId = ref<number | null>(null)

const status = ref(false)

function openModal() {
  isOpenAdded.value = true
}

function truncate(str: string, num: number) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

function handleOpenEdit(id: number) {
  isOpenEdit.value = true
  editProductId.value = id
}

function handleOpenDelete(id: number) {
  isOpenDelete.value = true
  deleteProductId.value = id
}
</script>

<style scoped></style>

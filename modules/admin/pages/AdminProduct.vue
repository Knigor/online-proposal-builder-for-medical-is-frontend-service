<template>
  <div>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedProductModal v-model:is-open="isOpen" />
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
            <div class="badge badge-info p-2">NEW</div>
          </h2>
          <p>
            A card component has a figure, a body part, and inside body there
            are title and actions parts
          </p>
          <div class="flex flex-wrap justify-end gap-2">
            <button class="btn btn-sm btn-error">Удалить</button>
            <button class="btn btn-sm btn-warning">Редактировать</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddedProductModal from '../components/AddedProductModal.vue'
definePageMeta({
  layout: 'custom'
})

const isOpen = ref(false)

function openModal() {
  isOpen.value = true
}
</script>

<style scoped></style>

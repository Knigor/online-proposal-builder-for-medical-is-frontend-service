<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список коммерческих предложений</h1>
    <div class="mx-auto mt-4 flex max-w-[900px] justify-end">
      <button
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedKPModal v-model:is-open="isOpenAdded" />
    </div>

    <!-- Карточки -->
    <div class="mx-auto grid max-w-[900px] grid-cols-3 justify-center gap-4">
      <div
        v-for="offer in offers"
        :key="offer.id"
        class="card bg-base-100 mb-4 min-h-[200px] w-64 overflow-auto shadow-sm"
      >
        <div class="card-body">
          <h2 class="card-title">
            КП №{{ offer.id }}
            <div
              :class="[
                'badge p-2',
                offer.status ? 'badge-success' : 'badge-error'
              ]"
            >
              {{ offer.status_manager || 'Не обработано' }}
            </div>
          </h2>
          <p class="text-sm text-gray-600">
            Создано: {{ formatDate(offer.created_at) }}
          </p>
          <p class="font-semibold">
            Сумма: {{ offer.total_price.toLocaleString() }} ₽
          </p>

          <ul class="mt-2 list-inside list-disc text-sm">
            <li v-for="product in offer.products" :key="product.id">
              {{ product.name }} ({{ product.price.toLocaleString() }} ₽
              <span v-if="product.discount_percent"
                >-{{ product.discount_percent }}%</span
              >)
            </li>
          </ul>

          <div class="mt-4 flex flex-wrap justify-end gap-2">
            <button
              class="btn btn-sm btn-error"
              @click="handleOpenDelete(offer.id)"
            >
              Удалить
            </button>
            <button
              class="btn btn-sm btn-warning"
              @click="handleOpenEdit(offer.id)"
            >
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>

    <EditPriceList v-model:is-open="isOpenEdit" :id-product="editProductId" />
    <DeletePriceList
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
    />
  </div>
</template>

<script setup lang="ts">
import AddedKPModal from '../components/KP/AddedKPModal.vue'
import EditPriceList from '../components/PriceList/EditPriceList.vue'
import DeletePriceList from '../components/PriceList/DeletePriceList.vue'

definePageMeta({
  layout: 'custom'
})

const isOpenAdded = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)

const editProductId = ref<number | null>(null)
const deleteProductId = ref<number | null>(null)

function openModal() {
  isOpenAdded.value = true
}

const offers = ref([
  {
    id: 4,
    status: true,
    status_manager: 'Отправлено',
    created_at: '2025-04-30 06:27:13',
    total_price: 73000,
    products: [
      {
        id: 9,
        name: 'Терминал самообслуживания СиМед',
        type: 'СиМед-Обслуживание',
        price: 25000,
        discount_percent: 0
      },
      {
        id: 10,
        name: 'Мобильное приложение',
        type: 'СиМед',
        price: 60000,
        discount_percent: 20
      }
    ]
  },
  {
    id: 5,
    status: true,
    status_manager: 'Отправлено',
    created_at: '2025-04-30 06:28:50',
    total_price: 7700,
    products: [
      {
        id: 6,
        name: 'Медицинская информационная система',
        type: 'СиМед-Клиника',
        price: 7000,
        discount_percent: 30
      },
      {
        id: 7,
        name: 'Лабораторная информационная система',
        type: 'СиМед-Лаборатория',
        price: 4000,
        discount_percent: 30
      }
    ]
  },
  {
    id: 6,
    status: true,
    status_manager: null,
    created_at: '2025-04-30 06:56:43',
    total_price: 12000,
    products: [
      {
        id: 8,
        name: 'Системы электронной очереди СиМед',
        type: 'СиМед-Электронный',
        price: 12000,
        discount_percent: 0
      }
    ]
  }
])

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

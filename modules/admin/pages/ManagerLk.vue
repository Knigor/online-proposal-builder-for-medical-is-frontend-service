<template>
  <div class="mx-auto max-w-7xl p-8">
    <h1 class="mb-8 text-3xl font-semibold text-gray-800">
      Личный кабинет менеджера
    </h1>

    <!-- Фильтры и поиск -->
    <div class="flex flex-wrap items-center gap-4">
      <!-- Поиск по ID КП -->
      <label class="floating-label">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по ID КП"
          class="input input-sm min-w-[160px] border"
          @input="handleSearchInput"
        />
        <span>Поиск по ID</span>
      </label>

      <!-- Фильтр по статусу -->
      <select
        v-model="statusFilter"
        class="select select-sm border"
        @change="fetchCommercialOffers"
      >
        <option :value="null">Все статусы</option>
        <option :value="true">Принятые</option>
        <option :value="false">Не принятые</option>
      </select>

      <!-- Сортировка -->
      <div class="flex gap-2">
        <select
          v-model="sortField"
          class="select select-sm border"
          @change="handleSortChange"
        >
          <option value="created_at_desc">Сначала новые</option>
          <option value="created_at_asc">Сначала старые</option>
          <option value="total_price_desc">Дорогие сначала</option>
          <option value="total_price_asc">Дешевые сначала</option>
        </select>
      </div>

      <!-- Кнопка сброса -->
      <button
        class="btn btn-sm btn-outline"
        @click="resetFilters"
        :disabled="!hasActiveFilters"
      >
        Сбросить
      </button>
    </div>

    <button
      class="btn btn-accent btn-link p-0 hover:text-green-700"
      @click="createOfferSelect"
    >
      Создать новое КП
    </button>

    <!-- Лоадер -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-info"></span>
    </div>

    <!-- Список КП -->
    <div
      v-else-if="route.name === 'manager-lk'"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="proposal in proposals"
        :key="proposal.id"
        class="rounded-lg bg-white p-6 shadow-sm transition-all duration-200"
      >
        <div
          class="relative my-4 flex cursor-pointer items-center justify-between rounded-2xl border border-transparent p-2 hover:border-purple-600"
          @click="navigateToProposal(proposal.id)"
        >
          <span class="font-semibold text-gray-700">КП #{{ proposal.id }}</span>
          <span
            :class="[
              'rounded-full px-3 py-1 text-sm font-medium',
              getStatusClass(proposal.status)
            ]"
          >
            {{ proposal.status ? 'Принято' : 'Не принято' }}
          </span>
        </div>

        <div class="space-y-1 text-sm text-gray-600">
          <div class="flex justify-between">
            <span>Создано:</span>
            <span>{{ formatDate(proposal.created_at) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Количество товаров:</span>
            <span>{{ proposal.items_count }}</span>
          </div>
          <div class="flex justify-between font-semibold">
            <span>Сумма:</span>
            <span>{{ formatPrice(proposal.total_price) }} ₽</span>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap justify-end gap-4">
          <Plus
            class="h-6 w-6 cursor-pointer text-gray-600 hover:text-green-600"
            @click="addedNewProduct(proposal.id)"
          />
          <Trash2
            class="h-6 w-6 cursor-pointer text-gray-600 hover:text-red-600"
            @click="handleDeleteKP(proposal.id)"
          />
        </div>
      </div>
    </div>

    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { useCommercialOffer } from '../composables/useCommercialOffer'
import type { CommercialOffer } from '~/modules/shared/types/adminTypes'
import { Trash2, Plus } from 'lucide-vue-next'
import { debounce } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'custom'
})

const router = useRouter()
const route = useRoute()

const { getAllCommercialOffers, deleteCommercialOffers } = useCommercialOffer()

const proposals = ref<CommercialOffer[]>([])
const isLoading = ref(false)

// Фильтры и сортировка
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const sortField = ref('created_at_desc')

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    statusFilter.value !== null ||
    sortField.value !== 'created_at_desc'
  )
})

const debouncedSearch = debounce(() => {
  fetchCommercialOffers()
}, 500)

// Обработчик ввода поиска
const handleSearchInput = () => {
  debouncedSearch()
}

// Обработчик изменения сортировки
const handleSortChange = () => {
  fetchCommercialOffers()
}

// Загрузка КП с учетом фильтров
async function fetchCommercialOffers() {
  isLoading.value = true
  try {
    const params = {
      search: searchQuery.value || undefined,
      status: statusFilter.value !== null ? statusFilter.value : undefined,
      sort: sortField.value
    }

    // Обновляем URL
    router.push({ query: params })

    const response = await getAllCommercialOffers(params)
    proposals.value = response
  } catch (error) {
    console.error('Ошибка при загрузке КП:', error)
  } finally {
    isLoading.value = false
  }
}

// Сброс фильтров
function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = null
  sortField.value = 'created_at_desc'
  fetchCommercialOffers()
}

// Инициализация из query параметров URL
onMounted(() => {
  if (route.query.search) searchQuery.value = route.query.search as string
  if (route.query.status !== undefined) {
    statusFilter.value = route.query.status === 'true'
  }
  if (route.query.sort) sortField.value = route.query.sort as string

  fetchCommercialOffers()
})

const handleDeleteKP = async (id: number) => {
  try {
    await deleteCommercialOffers(id)
    await fetchCommercialOffers()
  } catch (error) {
    console.log(error)
  }
}

const navigateToProposal = (id: number) => {
  router.push(`/manager-lk/commercial-offer/${id}`)
}

const createOfferSelect = () => {
  router.push('/offers-select')
}

const getStatusClass = (status: boolean) => {
  const statusMap: Record<string, string> = {
    true: 'bg-blue-50 text-blue-700',
    false: 'bg-gray-50 text-gray-700'
  }
  return statusMap[status.toString()] || 'bg-gray-50 text-gray-700'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('ru-RU')
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

const addedNewProduct = (id: number) => {
  router.push({
    path: '/offers-select',
    query: {
      id
    }
  })
}
</script>

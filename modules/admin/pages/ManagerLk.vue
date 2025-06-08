<template>
  <div class="mx-auto max-w-7xl p-8">
    <h1 class="mb-8 text-3xl font-semibold text-gray-800">
      Личный кабинет менеджера
    </h1>
    <button
      class="btn btn-accent btn-link hover:text-green-700"
      @click="createOfferSelect"
    >
      Создать новое КП
    </button>
    <div
      v-if="route.name === 'manager-lk'"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="proposal in proposals"
        :key="proposal.id"
        class="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
        @click="navigateToProposal(proposal.id)"
      >
        <div class="mb-4 flex items-center justify-between">
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
      </div>
    </div>

    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { useCommercialOffer } from '../composables/useCommercialOffer'
import type { CommercialOffer } from '~/modules/shared/types/adminTypes'

definePageMeta({
  layout: 'custom'
})

onMounted(async () => {
  try {
    const response = await getAllCommercialOffers()
    proposals.value = response
  } catch (error) {
    console.log(error)
  }
})

const router = useRouter()
const route = useRoute()

const { getAllCommercialOffers } = useCommercialOffer()

const proposals = ref<CommercialOffer[]>([])

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
</script>

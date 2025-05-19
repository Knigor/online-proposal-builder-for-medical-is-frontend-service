<template>
  <div class="mx-auto max-w-7xl p-8">
    <h1 class="mb-8 text-3xl font-semibold text-gray-800">
      Личный кабинет менеджера
    </h1>

    <div
      v-if="route.name === 'manager-lk'"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="proposal in proposals"
        :key="proposal.id"
        class="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
        @click="navigateToProposal(proposal.commercial_offer_id)"
      >
        <div class="mb-4 flex items-center justify-between">
          <span class="font-semibold text-gray-700"
            >КП #{{ proposal.commercial_offer_id }}</span
          >
          <span
            :class="[
              'rounded-full px-3 py-1 text-sm font-medium',
              getStatusClass(proposal.status)
            ]"
          >
            {{ proposal.status }}
          </span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>{{ proposal.email_client }}</span>
        </div>
      </div>
    </div>

    <router-view v-else></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

definePageMeta({
  layout: 'custom'
})

const router = useRouter()
const route = useRoute()

// Mock data - replace with actual API call
const proposals = ref([
  {
    id: 6,
    user_id: 10,
    commercial_offer_id: 5,
    status: 'Отправлено',
    email_client: 'test@mail.ru'
  }
])

const navigateToProposal = (id: number) => {
  router.push(`/manager-lk/commercial-offer/${id}`)
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    Отправлено: 'bg-blue-50 text-blue-700',
    'В работе': 'bg-orange-50 text-orange-700',
    Завершено: 'bg-green-50 text-green-700'
  }
  return statusMap[status] || 'bg-gray-50 text-gray-700'
}
</script>

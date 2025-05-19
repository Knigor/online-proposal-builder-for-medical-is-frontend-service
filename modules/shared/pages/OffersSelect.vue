<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
  >
    <div
      class="relative w-full max-w-md rounded-md border border-blue-300 bg-white p-6 shadow-md"
    >
      <progress
        class="progress progress-success absolute top-0 left-0 max-w-md"
        :value="currentProgress"
        max="100"
      ></progress>
      <h1>Пройдите опрос и выберите соответствующие фильтры</h1>
      <br />
      <KeepAlive>
        <component
          :is="current"
          :max-value="maxValue"
          :min-value="minValue"
          :current-product="currentProduct"
          :is-percent="isPercent"
          class="mt-2"
        ></component>
      </KeepAlive>
      <div class="mt-6 flex gap-4">
        <button
          :disabled="currentIndex === 0"
          class="btn btn-outline btn-default border"
          @click="handleBack"
        >
          Назад
        </button>
        <button
          v-if="currentIndex < components.length - 1"
          class="btn btn-info border"
          @click="handleNext"
        >
          Далее
        </button>
        <button
          v-else
          class="btn btn-success border"
          @click="navigateTo('/manager-lk')"
        >
          Получить предложения
        </button>
        <button
          v-if="currentIndex === 0"
          class="btn btn-link btn-info"
          @click="navigateTo('/manager-lk')"
        >
          Пропустить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TypeProduct from '../components/TypeProduct.vue'
import MinPrice from '../components/MinPrice.vue'
import MaxPrice from '../components/MaxPrice.vue'
import DiscountPercent from '../components/DiscountPercent.vue'

const components = [TypeProduct, MinPrice, MaxPrice, DiscountPercent]
const currentIndex = ref(0)

const currentProgress = computed(
  () => ((currentIndex.value + 1) / components.length) * 100
)

const current = computed(() => components[currentIndex.value])

const minValue = ref(100)
const maxValue = ref(100)
const currentProduct = ref('СиМед-Клиника')
const isPercent = ref(false)

function handleNext() {
  if (currentIndex.value < components.length - 1) {
    currentIndex.value++
  }
}

function handleBack() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
</script>

<style scoped></style>

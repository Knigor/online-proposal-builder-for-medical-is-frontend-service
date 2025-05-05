<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="p-3 text-start text-sm text-gray-600">
      @ ВКР Разработка онлайн-конструктора коммерческих предложений на
      информационные системы для автоматизации медицинских организаций
    </footer>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue'
</script>

<style scoped>
@media (max-width: 640px) {
  header,
  footer {
    padding: 2rem;
  }
  h1 {
    font-size: 1.5rem;
  }
}
</style>

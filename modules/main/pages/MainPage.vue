<template>
  <div v-if="isAdmin !== 'ROLE_ADMIN'" class="pt-8 pb-16">
    <!-- HERO Section -->
    <section class="mx-auto max-w-4xl px-4 text-center">
      <h1 class="mb-4 text-4xl font-bold">
        Информационные системы <span class="text-primary">СиМед</span>
      </h1>
      <p class="text-lg text-gray-600">
        Автоматизация процессов медицинских организаций: быстро, надежно,
        удобно.
      </p>
      <div class="mt-6">
        <button
          class="btn btn-info btn-lg"
          @click="navigateTo('offers-select')"
        >
          Запросить коммерческое предложение
        </button>
      </div>
    </section>

    <!-- Product Family -->
    <section class="mx-auto mt-20 max-w-6xl px-4">
      <h2 class="mb-10 text-center text-3xl font-semibold">
        Продукты семейства СиМед
      </h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">СиМед-Клиника</h3>
            <p>
              Медицинская информационная система (МИС) для автоматизации всех
              процессов клиники.
            </p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">СиМед-Лаборатория</h3>
            <p>
              Лабораторная информационная система (ЛИС) для учета и обработки
              лабораторных анализов.
            </p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Электронная очередь</h3>
            <p>
              Управление потоком пациентов и расписанием с помощью терминалов и
              табло.
            </p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Терминал самообслуживания</h3>
            <p>Регистрация и оплата пациентами без участия персонала.</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Мобильное приложение</h3>
            <p>
              Удобный доступ к медицинской информации для пациентов и врачей
              через мобильные устройства.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sales Process -->
    <section class="mx-auto mt-24 max-w-4xl px-6 text-center">
      <h2 class="mb-10 text-3xl font-semibold">Как мы работаем</h2>
      <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step step-info">Связь с клиентом</li>
        <li class="step step-info">Демо и уточнение</li>
        <li class="step step-info">Формирование КП</li>
        <li class="step step-info">Уточнение и финализация</li>
        <li class="step step-info">Заключение договора</li>
        <li class="step step-info">Внедрение</li>
      </ul>
    </section>

    <!-- CTA -->
    <section class="mt-20 text-center">
      <h3 class="mb-4 text-2xl font-medium">
        Хотите узнать, сколько будет стоить решение для вашей клиники?
      </h3>
      <button class="btn btn-accent btn-wide" @click="scrollToUp">
        Пройти мастер по составлению КП
      </button>
    </section>
  </div>
  <div v-else class="pt-8 pb-16">
    <!-- HERO Section -->
    <section class="mx-auto max-w-4xl px-4 text-center">
      <h1 class="mb-4 text-4xl font-bold">
        Информационные системы <span class="text-primary">СиМед</span>
      </h1>
      <p class="text-lg text-gray-600">
        Автоматизация процессов медицинских организаций: быстро, надежно,
        удобно.
      </p>
      <div class="mt-6">
        <button
          class="btn btn-info btn-lg"
          @click="navigateTo('/admin-product')"
        >
          Перейти к созданию продукта
        </button>
      </div>
    </section>

    <!-- Product Family -->
    <section class="mx-auto mt-20 max-w-6xl px-4">
      <h2 class="mb-10 text-center text-3xl font-semibold"></h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">СиМед-Клиника</h3>
            <p>
              Медицинская информационная система (МИС) для автоматизации всех
              процессов клиники.
            </p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">СиМед-Лаборатория</h3>
            <p>
              Лабораторная информационная система (ЛИС) для учета и обработки
              лабораторных анализов.
            </p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Электронная очередь</h3>
            <p>
              Управление потоком пациентов и расписанием с помощью терминалов и
              табло.
            </p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Терминал самообслуживания</h3>
            <p>Регистрация и оплата пациентами без участия персонала.</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Мобильное приложение</h3>
            <p>
              Удобный доступ к медицинской информации для пациентов и врачей
              через мобильные устройства.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sales Process -->
    <section class="mx-auto mt-24 max-w-4xl px-6 text-center">
      <h2 class="mb-10 text-3xl font-semibold">Как мы работаем</h2>
      <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step step-info">Связь с клиентом</li>
        <li class="step step-info">Демо и уточнение</li>
        <li class="step step-info">Формирование КП</li>
        <li class="step step-info">Уточнение и финализация</li>
        <li class="step step-info">Заключение договора</li>
        <li class="step step-info">Внедрение</li>
      </ul>
    </section>

    <!-- CTA -->
    <section class="mt-20 text-center">
      <button class="btn btn-accent btn-wide" @click="scrollToUp">Вверх</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/modules/auth/store/authStore'
definePageMeta({
  layout: 'custom'
})

const authStore = useAuthStore()

const isAdmin = authStore.user?.role.find((item) => item === 'ROLE_ADMIN')

function scrollToUp() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped></style>

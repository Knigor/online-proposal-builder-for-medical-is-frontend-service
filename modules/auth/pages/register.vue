<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4"
  >
    <div
      class="w-full max-w-md rounded-md border border-blue-300 bg-white p-6 shadow-md"
    >
      <h1 class="text-center text-2xl font-semibold text-gray-700">
        Регистрация
      </h1>
      <p class="mt-4 text-center text-base text-gray-600">
        Создайте новый аккаунт
      </p>
      <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label id="name" class="label">
            <span class="label-text text-base">Имя</span>
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Введите ваше имя"
            class="input input-bordered input-info mt-1 w-full border"
          />
          <span v-if="nameErrors" class="text-xs text-red-500">
            {{ nameErrors }}
          </span>
        </div>

        <div>
          <label id="email" class="label">
            <span class="label-text text-base">Почта</span>
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Введите почту"
            class="input input-bordered input-info mt-1 w-full border"
          />
          <span v-if="emailErrors" class="text-xs text-red-500">
            {{ emailErrors }}
          </span>
        </div>

        <div>
          <label id="password" class="label">
            <span class="label-text text-base">Пароль</span>
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            class="input input-bordered input-info mt-1 w-full border"
          />
          <span v-if="passwordErrors" class="text-xs text-red-500">
            {{ passwordErrors }}
          </span>
        </div>

        <span v-if="authError" class="text-xs text-red-500">{{
          authError
        }}</span>

        <div class="relative">
          <button
            :class="{ 'opacity-50': loading }"
            class="btn btn-info btn-block mt-4"
            type="submit"
            :disabled="isFormSubmitDisabled"
          >
            Зарегистрироваться
          </button>

          <progress
            v-if="loading"
            class="progress absolute inset-0 bottom-2 text-blue-600 transition-all duration-300"
          ></progress>
        </div>

        <div>
          <NuxtLink to="/authorization">
            <button class="btn btn-block">Уже есть аккаунт? Войти</button>
          </NuxtLink>
        </div>
      </form>
    </div>

    <footer
      class="fixed bottom-0 left-0 max-w-[600px] p-3 text-sm text-gray-600"
    >
      <p>
        @ ВКР Разработка онлайн-конструктора коммерческих предложений на
        информационные системы для автоматизации медицинских организаций
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { object, string, ValidationError } from 'yup'
import { useAuth } from '../composables/useAuth'
import { useAuthStore } from '../store/authStore'

const authStore = useAuthStore()
const { onRegister } = useAuth()

const name = ref<string>('')
const nameErrors = ref<string>('')

const email = ref<string>('')
const emailErrors = ref<string>('')

const password = ref<string>('')
const passwordErrors = ref<string>('')

const authError = ref('')

const isFormSubmitDisabled = computed(() => {
  return !name.value.trim() || !email.value.trim() || !password.value.trim()
})

const checkValid = async () => {
  const registerSchema = object({
    name: string().required('Имя обязательно для заполнения'),
    email: string()
      .email('Введите корректный email')
      .required('Email обязателен для заполнения'),
    password: string()
      .min(6, 'Пароль должен быть не менее 6 символов')
      .required('Пароль обязателен для заполнения')
  })

  try {
    await registerSchema.validate({
      name: name.value,
      email: email.value,
      password: password.value
    })
    return true
  } catch (err) {
    if (err instanceof ValidationError) {
      if (err.path === 'name') nameErrors.value = err.message
      if (err.path === 'email') emailErrors.value = err.message
      if (err.path === 'password') passwordErrors.value = err.message
    }
    return false
  }
}

const loading = ref(false)

const handleSubmit = async () => {
  const isValid = await checkValid()
  if (!isValid) return
  authError.value = ''
  loading.value = true
  try {
    const response = await onRegister(email.value, name.value, password.value)
    if (response.success) {
      const isAdmin = authStore.user?.role.find((item) => item === 'ROLE_ADMIN')
      console.log(isAdmin)
      if (isAdmin === 'ROLE_ADMIN') {
        navigateTo('/')
      } else {
        navigateTo('/offers-select')
      }
    } else {
      authError.value = 'Введен не правильный логин или пароль'
    }
  } catch (error) {
    console.log('Ошибка отправки формы', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>

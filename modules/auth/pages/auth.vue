<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4"
  >
    <div
      class="w-full max-w-md rounded-md border border-blue-300 bg-white p-6 shadow-md"
    >
      <h1 class="text-center text-2xl font-semibold text-gray-700">
        Здравствуйте
      </h1>
      <p class="mt-4 text-center text-base text-gray-600">
        Добро пожаловать, введите ваш Email
      </p>
      <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
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
            :class="{ 'border-red-500': emailError }"
          />
          <span v-if="emailError" class="text-xs text-red-500">
            {{ emailError }}
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
            :class="{ 'border-red-500': passwordError }"
          />
          <span v-if="passwordError" class="text-xs text-red-500">
            {{ passwordError }}
          </span>
        </div>

        <div class="relative">
          <span v-if="authError" class="text-xs text-red-500">{{
            authError
          }}</span>
          <button
            :class="{ 'opacity-50': loading }"
            class="btn btn-info btn-block mt-4"
            type="submit"
            :disabled="isFormSubmitDisabled"
          >
            Войти
          </button>

          <progress
            v-if="loading"
            class="progress absolute inset-0 bottom-2 text-blue-600 transition-all duration-300"
          ></progress>
        </div>

        <!-- <div>
          <NuxtLink to="/register">
            <button class="btn btn-block">Зарегистрироваться</button>
          </NuxtLink>
        </div> -->
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

const { onLogin } = useAuth()
const authStore = useAuthStore()

const loading = ref(false)
const email = ref('')
const password = ref('')

const emailError = ref('')
const passwordError = ref('')
const authError = ref('')

const isFormSubmitDisabled = computed(() => {
  return !email.value.trim() || !password.value.trim()
})

const resetErrors = () => {
  emailError.value = ''
  passwordError.value = ''
  authError.value = ''
}

const checkValid = async () => {
  const loginSchema = object({
    email: string()
      .email('Введите корректный email')
      .required('Email обязателен для заполнения'),
    password: string()
      .min(6, 'Пароль должен быть не менее 6 символов')
      .required('Пароль обязателен для заполнения')
  })

  try {
    await loginSchema.validate({ email: email.value, password: password.value })
    return true
  } catch (err) {
    if (err instanceof ValidationError) {
      if (err.path === 'email') emailError.value = err.message
      if (err.path === 'password') passwordError.value = err.message
    }
    return false
  }
}

const handleSubmit = async () => {
  const isValid = await checkValid()
  if (!isValid) return
  authError.value = ''
  resetErrors()

  loading.value = true
  try {
    const response = await onLogin(email.value, password.value)
    console.log('Вызывается авторизация')
    if (response.success) {
      const isAdmin = authStore.user?.role.find((item) => item === 'ROLE_ADMIN')
      console.log(isAdmin)
      if (isAdmin === 'ROLE_ADMIN') {
        navigateTo('/')
      } else {
        navigateTo('/manager-lk')
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

<style scoped>
.border-red-500 {
  border-color: #ef4444;
}
</style>

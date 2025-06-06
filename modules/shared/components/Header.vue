<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <a class="btn btn-info text-xl" @click="navigateTo('/')"
        >Конструктор предложений</a
      >
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal flex items-center gap-4">
        <li>
          <p>{{ authStore.user?.name }}</p>
        </li>
        <!-- Дропдавн -->
        <div class="">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="btn border">Меню</MenuButton>
            </div>

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems
                class="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                <div
                  v-if="isAdmin !== 'ROLE_ADMIN'"
                  class="flex flex-col gap-1 px-1 py-1"
                >
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                      ]"
                      @click="navigateTo('/offers-select')"
                    >
                      Генерация КП
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        route.path === '/manager-lk'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      ]"
                      @click="navigateTo('/manager-lk')"
                    >
                      Личный кабинет
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        route.path === '/admin-kp'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      ]"
                      @click="navigateTo('/admin-kp')"
                    >
                      Создать КП
                    </button>
                  </MenuItem>
                </div>
                <div v-else class="flex flex-col gap-1 px-1 py-1">
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        route.path === '/admin-product'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      ]"
                      @click="navigateTo('/admin-product')"
                    >
                      Продукты
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        route.path === '/admin-additional-module'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      ]"
                      @click="navigateTo('/admin-additional-module')"
                    >
                      Дополнительные модули
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        route.path === '/admin-base-licenses'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      ]"
                      @click="navigateTo('/admin-base-licenses')"
                    >
                      Базовые лицензии
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        route.path === '/admin-license-composition'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      ]"
                      @click="navigateTo('/admin-license-composition')"
                    >
                      Лицензии и модули
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        route.path === '/admin-discount-level'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900'
                      ]"
                      @click="navigateTo('/admin-discount-level')"
                    >
                      Уровни скидок
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>

        <div class="tooltip tooltip-bottom" data-tip="Выход">
          <button class="btn btn-circle border" @click="handleLogOut">
            <LogOut />
          </button>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '~/modules/auth/store/authStore'
import { useAuth } from '~/modules/auth/composables/useAuth'

const { logOut } = useAuth()
const authStore = useAuthStore()
const route = useRoute()

const isAdmin = authStore.user?.role.find((item) => item === 'ROLE_ADMIN')

async function handleLogOut() {
  try {
    await logOut()
    navigateTo('/authorization')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>

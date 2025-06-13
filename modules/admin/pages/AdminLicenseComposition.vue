<template>
  <div>
    <h1 class="p-4 text-left text-2xl">Список связных модулей и лицензий</h1>
    <div class="mx-auto my-4 flex max-w-[900px] flex-wrap justify-end gap-4">
      <!-- Фильтры и поиск -->
      <div class="flex flex-wrap items-center gap-4">
        <!-- Поиск по названию лицензии -->
        <label class="floating-label">
          <input
            v-model="baseLicenseNameQuery"
            type="text"
            placeholder="Поиск по лицензии"
            class="input input-sm min-w-[160px] border"
            @input="handleSearchInput"
          />
          <span>Название лицензии</span>
        </label>

        <!-- Фильтр по обязательности -->
        <select
          v-model="requiredFilter"
          class="select select-sm border"
          @change="fetchLicenseCompositions"
        >
          <option :value="null">Все модули</option>
          <option :value="true">Обязательные</option>
          <option :value="false">Не обязательные</option>
        </select>

        <!-- Фильтр по совместимости -->
        <select
          v-model="compatibleFilter"
          class="select select-sm border"
          @change="fetchLicenseCompositions"
        >
          <option :value="null">Все типы</option>
          <option :value="true">Совместимые</option>
          <option :value="false">Не совместимые</option>
        </select>

        <!-- Сортировка -->
        <div class="flex gap-2">
          <select
            v-model="sortField"
            class="select select-sm border"
            @change="handleSortChange"
          >
            <option :value="null">Без сортировки</option>
            <option value="base_license_name">По лицензии</option>
            <option value="additional_module_name">По модулю</option>
          </select>

          <select
            v-model="sortDirection"
            class="select select-sm border"
            @change="fetchLicenseCompositions"
            :disabled="!sortField"
          >
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
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
        class="btn btn-accent btn-link hover:text-green-700"
        @click="openModal"
      >
        Добавить
      </button>
      <AddedLicenseCompositionModal
        v-model:is-open="isOpenAdded"
        :base-license-data="baseLicenseData"
        :additional-data="additionalData"
        @update-products="fetchLicenseCompositions"
      />
    </div>

    <!-- Карточки не пустые -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-1 items-start justify-center gap-4"
    >
      <!-- License Compositions -->
      <template v-if="!isLoading">
        <div
          v-for="item in licenseData"
          :key="item.base_license_id"
          class="card bg-base-100 mb-4 min-w-64 justify-between shadow-sm"
        >
          <div class="card-body flex flex-col justify-between">
            <div>
              <h2 class="card-title text-blue-600">
                {{ item.base_license_name }}
              </h2>

              <template v-if="item.additional_modules.length > 0">
                <table
                  class="table-compact my-2 table min-h-[200px] w-full overflow-auto overflow-x-auto"
                >
                  <thead>
                    <tr class="border-1">
                      <th class="border">Модуль</th>
                      <th>Отношение</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="module in item.additional_modules"
                      :key="module.id"
                      class="hover"
                    >
                      <td class="border font-bold">{{ module.name }}</td>
                      <td class="border text-orange-600 italic">
                        {{ getRelationText(module.relation) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-else>
                <span class="text-gray-500">Нет связанных модулей</span>
              </template>
            </div>

            <div class="mt-4 flex flex-col gap-2">
              <div class="flex justify-between">
                <span class="font-semibold">Кол-во модулей:</span>
                <span>{{ item.additional_modules.length }}</span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap justify-end gap-2">
              <button
                class="btn btn-sm btn-error"
                @click="handleOpenDelete(item.base_license_id)"
              >
                Удалить
              </button>
              <button
                class="btn btn-sm btn-warning"
                @click="handleOpenEdit(item.base_license_id)"
              >
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Skeletons -->
      <template v-else>
        <div
          v-for="n in 6"
          :key="n"
          class="card bg-base-100 mb-4 min-h-64 w-64 shadow-sm"
        >
          <SekeletonCards />
        </div>
      </template>
    </div>

    <!-- Карточки с бека пустые -->
    <div
      v-if="licenseData.length === 0 && !isLoading"
      class="mx-auto flex max-w-[900px] items-center justify-center gap-4"
    >
      <p class="flex flex-col gap-4 text-2xl font-semibold">
        На данный момент записей нет, хотите
        <br />
        <button class="btn btn-sm btn-outline btn-success" @click="openModal">
          добавить?
        </button>
      </p>
    </div>

    <EditLicenseCompositionModal
      v-model:is-open="isOpenEdit"
      v-model:license="license"
      v-model:is-loading="isLoadingEdit"
      :base-license-data="baseLicenseData"
      :additional-data="additionalData"
      :id-product="editProductId!"
      @update-products="fetchLicenseCompositions"
    />
    <DeleteLicenseCompositionModal
      v-model:is-open="isOpenDelete"
      :id-product="deleteProductId"
      @update-products="fetchLicenseCompositions"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import AddedLicenseCompositionModal from '../components/LicenseComposition/AddedLicenseCompositionModal.vue'
import EditLicenseCompositionModal from '../components/LicenseComposition/EditLicenseCompositionModal.vue'
import DeleteLicenseCompositionModal from '../components/LicenseComposition/DeleteLicenseCompositionModal.vue'
import type {
  Product,
  LicenseComposition,
  AdditionalModule,
  BaseLicenses
} from '~/modules/shared/types/adminTypes'
import SekeletonCards from '../components/skeletons/SekeletonCards.vue'
import { useLicenseComposition } from '../composables/useLicenseComposition'
import { useAdditionalModule } from '../composables/useAdditionalModule'
import { useBaseLicenses } from '../composables/useBaseLicenses'
import { useProduct } from '../composables/useProduct'

definePageMeta({
  layout: 'custom'
})

const route = useRoute()
const router = useRouter()
const { getAllProducts } = useProduct()
const { getAllBaseLicenses } = useBaseLicenses()
const { getAllAdditionalModules } = useAdditionalModule()
const { getAllLicenseComposition, getLicenseCompositionById } =
  useLicenseComposition()

// Реактивные данные
const licenseData = ref<LicenseComposition[]>([])
const license = ref<LicenseComposition>()
const additionalData = ref<AdditionalModule[]>([])
const baseLicenseData = ref<BaseLicenses[]>([])
const products = ref<Product[]>([])
const baseLicenseNameQuery = ref('')
const requiredFilter = ref<boolean | null>(null)
const compatibleFilter = ref<boolean | null>(null)
const sortField = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const isOpenAdded = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)
const isLoading = ref(false)
const isLoadingEdit = ref(false)
const editProductId = ref<number | null>(null)
const deleteProductId = ref<number | null>(null)

// Преобразование relation в читаемый текст
const getRelationText = (relation: string) => {
  const relationsMap: Record<string, string> = {
    required: 'Входит',
    compatible: 'Сочетается',
    incompatible: 'Не сочетается'
  }
  return relationsMap[relation] || relation
}

// Проверка активных фильтров
const hasActiveFilters = computed(() => {
  return (
    baseLicenseNameQuery.value ||
    requiredFilter.value !== null ||
    compatibleFilter.value !== null ||
    sortField.value !== null
  )
})

// Дебаунс для поиска
const debouncedSearch = debounce(() => {
  fetchLicenseCompositions()
}, 500)

// Обработчик ввода поиска
const handleSearchInput = () => {
  debouncedSearch()
}

// Обработчик изменения сортировки
const handleSortChange = () => {
  if (!sortField.value) {
    sortDirection.value = 'asc'
  }
  fetchLicenseCompositions()
}

// Получение данных с учетом фильтров
async function fetchLicenseCompositions() {
  isLoading.value = true
  try {
    const params = {
      base_license_name: baseLicenseNameQuery.value || undefined,
      required:
        requiredFilter.value !== null ? requiredFilter.value : undefined,
      compatible:
        compatibleFilter.value !== null ? compatibleFilter.value : undefined,
      sort: sortField.value || undefined,
      direction: sortField.value ? sortDirection.value : undefined
    }

    // Обновляем URL
    router.push({ query: params })

    const [
      compositionsResponse,
      productsResponse,
      baseLicensesResponse,
      additionalResponse
    ] = await Promise.all([
      getAllLicenseComposition(params),
      getAllProducts(),
      getAllBaseLicenses(),
      getAllAdditionalModules()
    ])

    licenseData.value = compositionsResponse
    products.value = productsResponse
    baseLicenseData.value = baseLicensesResponse
    additionalData.value = additionalResponse
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  } finally {
    isLoading.value = false
  }
}

// Сброс фильтров
function resetFilters() {
  baseLicenseNameQuery.value = ''
  requiredFilter.value = null
  compatibleFilter.value = null
  sortField.value = null
  sortDirection.value = 'asc'
  fetchLicenseCompositions()
}

// Инициализация из query параметров URL
onMounted(() => {
  if (route.query.base_license_name)
    baseLicenseNameQuery.value = route.query.base_license_name as string
  if (route.query.required)
    requiredFilter.value = route.query.required === 'true'
  if (route.query.compatible)
    compatibleFilter.value = route.query.compatible === 'true'
  if (route.query.sort) sortField.value = route.query.sort as string
  if (route.query.direction)
    sortDirection.value = route.query.direction as 'asc' | 'desc'

  fetchLicenseCompositions()
})

function openModal() {
  isOpenAdded.value = true
}

async function handleOpenEdit(id: number) {
  isOpenEdit.value = true
  editProductId.value = id
  isLoadingEdit.value = true
  try {
    const response = await getLicenseCompositionById(id)
    license.value = response
  } catch (error) {
    console.error('Ошибка при загрузке композиции:', error)
  } finally {
    isLoadingEdit.value = false
  }
}

function handleOpenDelete(id: number) {
  isOpenDelete.value = true
  deleteProductId.value = id
}
</script>

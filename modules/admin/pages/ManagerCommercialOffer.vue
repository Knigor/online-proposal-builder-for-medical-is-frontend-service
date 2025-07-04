<template>
  <div>
    <div class="flex justify-between p-4">
      <button
        class="btn btn-link text-blue-700 hover:text-blue-900"
        @click="$router.back()"
      >
        Назад
      </button>
      <button class="btn btn-primary" @click="downloadPDF">
        Сохранить как PDF
      </button>
    </div>

    <div
      v-if="commercialOffer"
      ref="pdfContent"
      :class="[
        'relative mx-auto mt-4 max-w-[1400px] rounded-lg bg-white p-6 shadow-sm',
        isExportingPDF ? 'pdf-export' : ''
      ]"
    >
      <div class="text-center">
        <h1 class="text-2xl font-bold">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</h1>
        <p class="mt-2 text-gray-500">
          № {{ commercialOffer.id }} от
          {{ formatDate(commercialOffer.created_at, true) }}
        </p>
      </div>
      <div class="relative bottom-16">
        <img class="h-32 w-32" src="/public/si-med.jpg" />
      </div>

      <div class="mb-4 flex flex-col gap-4 text-sm">
        <div class="flex items-center gap-4">
          <label class="block text-sm font-medium text-gray-700"
            ><strong>Заказчик:</strong></label
          >
          <select
            v-model="currentCustomer"
            class="select select-xs mt-1 border"
          >
            >
            <option disabled :value="null">-- Выберите заказчика --</option>
            <option v-for="item in customers" :key="item.id" :value="item">
              {{ item.nameCustomer }}
            </option>
          </select>
        </div>
        <p>
          <strong>Контактное лицо:</strong>
          {{ currentCustomer?.contactPerson || '—' }}
        </p>
        <p><strong>Телефон:</strong> {{ currentCustomer?.phone || '—' }}</p>
        <p><strong>Email:</strong> {{ currentCustomer?.email || '—' }}</p>
      </div>

      <div
        class="rounded-box mb-4 overflow-x-auto border border-gray-200 bg-white"
      >
        <table
          class="w-full border-collapse overflow-auto border border-gray-300 bg-white"
        >
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-2">#</th>
              <th class="border border-gray-300 p-2">Продукт</th>
              <th class="border border-gray-300 p-2">Лицензия</th>
              <th class="border border-gray-300 p-2">Цена</th>
              <th class="border border-gray-300 p-2">Скидка</th>
              <th class="border border-gray-300 p-2">Кол-во</th>
              <th class="border border-gray-300 p-2">Итого</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, idx) in commercialOffer.items"
              :key="item.id"
            >
              <!-- Основная строка с лицензией -->
              <tr class="border border-gray-300">
                <th
                  rowspan="item.additional_modules.length + 1"
                  class="border border-gray-300 p-2"
                >
                  {{ idx + 1 }}
                </th>
                <td
                  rowspan="item.additional_modules.length + 1"
                  class="border border-gray-300 p-2"
                >
                  {{ item.product.name }}
                </td>
                <td class="border border-gray-300 p-2">
                  {{ item.base_license?.name ?? '—' }}
                </td>
                <td class="border border-gray-300 p-2">
                  {{ formatPrice(item.base_license.price ?? 0) }} ₽
                </td>
                <td class="border border-gray-300 p-2">
                  {{ item.discount?.toFixed(2) ?? 0 }}%
                </td>
                <td
                  rowspan="item.additional_modules.length + 1"
                  class="border border-gray-300 p-2"
                >
                  {{ item.quantity }}
                </td>
                <td
                  rowspan="item.additional_modules.length + 1"
                  class="border border-gray-300 p-2"
                >
                  {{ formatPrice(item.total) }} ₽
                </td>
              </tr>

              <!-- Заголовок модулей -->
              <tr class="bg-gray-50">
                <td colspan="2" class="border border-gray-300 p-2">
                  <!-- <strong>Доп. модули:</strong> -->
                </td>
                <td class="border border-gray-300 p-2">
                  <strong>Доп. модули</strong>
                </td>
                <td class="border border-gray-300 p-2">
                  <strong>Цена</strong>
                </td>
                <td colspan="3" class="border border-gray-300 p-2"></td>
              </tr>

              <!-- Строки модулей -->
              <tr
                v-for="(module, modIdx) in item.item_modules"
                :key="module.id"
                class="border border-gray-300 odd:bg-white even:bg-gray-50"
              >
                <td colspan="2" class="border border-gray-300 p-2"></td>
                <td class="border border-gray-300 p-2">
                  {{ module.module.name }}
                  <!-- <span class="ml-1 text-xs text-gray-500">
                    ({{ module.required ? 'обязательный' : 'опциональный' }})
                  </span> -->
                </td>
                <td class="border border-gray-300 p-2">
                  {{ formatPrice(module.module.price) }} ₽
                </td>
                <td colspan="3" class="border border-gray-300 p-2"></td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="6" class="border border-gray-300 p-2 text-right">
                Финальная цена:
              </th>
              <th class="border border-gray-300 p-2 text-green-600">
                {{ formatPrice(totalSum) }} ₽
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="text-sm text-gray-700">
        <p>Коммерческое предложение действительно до {{ offerValidUntil }}</p>
        <p class="mt-2">С уважением,<br />Отдел продаж</p>
      </div>
    </div>

    <div v-else class="p-6 text-center">
      Загрузка коммерческого предложения...
    </div>
  </div>
</template>
<script setup lang="ts">
import { jsPDF } from 'jspdf'
import type {
  CommercialOffersById,
  Customer
} from '~/modules/shared/types/adminTypes'
import { useCommercialOffer } from '../composables/useCommercialOffer'
import { useGlobalStore } from '~/modules/shared/store/globalStore'
import { useCustomer } from '../composables/useCustomer'

definePageMeta({ layout: 'custom' })

const globalStore = useGlobalStore()
const route = useRoute()
const commercialOfferId = Number(route.params.id)

const { getCommercialOffersById } = useCommercialOffer()
const { getAllCustomers } = useCustomer()
const commercialOffer = ref<CommercialOffersById | null>(null)
const customers = ref<Customer[]>([])

const currentCustomer = ref<Customer | null>(null)

const isExportingPDF = ref(false)

onMounted(async () => {
  try {
    const response = await getCommercialOffersById(commercialOfferId)
    const customersResponse = await getAllCustomers()

    customers.value = customersResponse
    commercialOffer.value = response
  } catch (err) {
    console.error(err)
  }
})

const formatDate = (date: string | null | undefined, onlyDate = false) => {
  if (!date) return '—'
  const d = new Date(date)
  return onlyDate
    ? d.toLocaleDateString('ru-RU')
    : d.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU').format(price)

const totalSum = computed(() => {
  return commercialOffer.value
    ? commercialOffer.value.items.reduce((acc, i) => acc + i.total, 0)
    : 0
})

const offerValidUntil = computed(() => {
  const created = commercialOffer.value?.created_at
  if (!created) return ''
  const d = new Date(created)
  d.setMonth(d.getMonth() + 1)
  return d.toLocaleDateString('ru-RU')
})

const downloadPDF = () => {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
  doc.addFont('/fonts/Inter-Regular.ttf', 'Inter', 'normal')
  doc.setFont('Inter')

  let y = 15

  // Логотип (добавляем первым, чтобы не перекрывать текст)
  doc.addImage(
    '/si-med.jpg', // Убедитесь, что путь правильный
    'JPEG',
    15, // x-координата (левый край)
    15, // y-координата (верхний край)
    30, // ширина (уменьшил с 180 до 30 мм)
    25 // высота (сохраняем пропорции)
  )

  // Заголовок (сдвигаем вправо, чтобы не накладывался на лого)
  doc.setFontSize(16)
  doc.text('ООО «Симплекс»', 47, y) // Сдвинул x-координату с 20 до 50
  y += 10

  doc.setFontSize(20)
  doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', 105, y, { align: 'center' })
  y += 10

  doc.setFontSize(12)
  doc.text(
    `№ ${commercialOffer.value?.id} от ${formatDate(commercialOffer.value?.created_at, true)}`,
    105,
    y,
    { align: 'center' }
  )
  y += 15

  // Информация о заказчике
  doc.setFontSize(10)
  doc.text(
    `Заказчик: ${currentCustomer.value?.nameCustomer || '________________________________________________'}`,
    20,
    y
  )
  y += 12
  doc.text(
    `Контактное лицо: ${currentCustomer.value?.contactPerson || '________________________________________________'}`,
    20,
    y
  )
  y += 12
  doc.text(
    `Телефон: ${currentCustomer.value?.phone || '________________________________________________'}`,
    20,
    y
  )
  y += 12
  doc.text(
    `Email: ${currentCustomer.value?.email || '________________________________________________'}`,
    20,
    y
  )
  y += 12

  // Вводный текст
  const introText =
    'Коммерческое предложение на поставку программного обеспечения:'
  doc.text(introText, 20, y)
  y += 10

  // Таблица
  const tableHeaders = [
    '№',
    'Продукт',
    'Лицензия',
    'Модуль',
    'Цена',
    'Скидка',
    'Кол-во',
    'Итого'
  ]
  const tableColumnWidths = [10, 35, 30, 35, 20, 15, 15, 20]
  const tableStartX = 10
  let tableY = y + 5
  const rowHeight = 8

  // Нарисовать шапку таблицы с границами
  let x = tableStartX
  doc.setFontSize(10)
  tableHeaders.forEach((header, i) => {
    doc.rect(x, tableY, tableColumnWidths[i], rowHeight)
    doc.text(header, x + 2, tableY + 6)
    x += tableColumnWidths[i]
  })
  tableY += rowHeight

  // Нарисовать строки таблицы с учетом переноса текста
  doc.setFontSize(9)
  commercialOffer.value?.items.forEach((item, idx) => {
    x = tableStartX

    // Перенос текста для каждой ячейки
    const productLines = doc.splitTextToSize(
      item.product.name,
      tableColumnWidths[1] - 2
    )
    const licenseLines = doc.splitTextToSize(
      item.base_license?.name ?? '—',
      tableColumnWidths[2] - 2
    )
    const moduleNames =
      item.item_modules.map((module) => module.module.name).join(', ') ?? '—'
    const modulePrice =
      item.item_modules.map((module) => module.module.price).join(', ') ?? '—'
    const moduleLines = doc.splitTextToSize(
      moduleNames,
      tableColumnWidths[3] - 2
    )
    const priceLines = [`${formatPrice(item.price)} ₽`]
    const discountLines = [`${item.discount?.toFixed(2) ?? 0}%`]
    const qtyLines = [item.quantity.toString()]
    const totalLines = [`${formatPrice(item.total)} ₽`]

    // Определяем максимальное количество строк в ряду
    const maxLines = Math.max(
      productLines.length,
      licenseLines.length,
      moduleLines.length,
      priceLines.length,
      discountLines.length,
      qtyLines.length,
      totalLines.length,
      1 // для первой колонки (номер)
    )
    const cellHeight = maxLines * 5 + 3

    // Массивы по порядку колонок
    const row = [
      [(idx + 1).toString()],
      productLines,
      licenseLines,
      moduleLines,
      priceLines,
      discountLines,
      qtyLines,
      totalLines
    ]

    // Рисуем ячейки и текст
    let cellX = tableStartX
    row.forEach((cellLines, i) => {
      doc.rect(cellX, tableY, tableColumnWidths[i], cellHeight)
      // Вертикальное выравнивание текста в ячейке
      cellLines.forEach((line, lineIdx) => {
        doc.text(line, cellX + 2, tableY + 6 + lineIdx * 5)
      })
      cellX += tableColumnWidths[i]
    })
    tableY += cellHeight

    // Проверка на новую страницу
    if (tableY > 270) {
      doc.addPage()
      tableY = 20
    }
  })

  y = tableY + 10

  // Итоговая стоимость
  doc.setFontSize(12)
  doc.text(`Общая стоимость: ${formatPrice(totalSum.value)} ₽`, 20, y)
  y += 10

  // Срок действия и подпись
  doc.setFontSize(10)
  doc.text(`*Предложение действительно до ${offerValidUntil.value}.`, 20, y)
  y += 10
  doc.text('С уважением,', 20, y)
  y += 8
  doc.text('Отдел продаж', 20, y)
  y += 10
  doc.setFontSize(8)
  doc.text('123456, Россия, г. Липецк, Советская, 1', 20, y)
  y += 5
  doc.text('Тел/факс: +7 800-555-35-35 Тел/факс: +7 800-655-35-35', 20, y)
  y += 5
  doc.text('simplex48.ru', 20, y)

  doc.save(`commercial-offer-${commercialOffer.value?.id}.pdf`)
}
</script>

<style scoped>
.pdf-export,
.pdf-export * {
  background: #fff !important;
  border-color: #e5e7eb !important;
  color: #222 !important;
  box-shadow: none !important;
}
</style>

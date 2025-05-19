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
      ref="pdfContent"
      :class="[
        'mx-auto mt-4 max-w-[900px] rounded-lg bg-white p-6 shadow-sm',
        isExportingPDF ? 'pdf-export' : ''
      ]"
    >
      <!-- Шапка -->
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            src="/public/icons/lain.png"
            alt="logo"
            class="h-12 w-12 object-contain"
          />
          <div>
            <div class="text-xs text-gray-500">
              Общество с ограниченной ответственностью
            </div>
            <div class="text-2xl font-bold text-blue-900">«Моя компания»</div>
          </div>
        </div>
        <div class="text-right text-xs text-gray-700">
          Директору ООО "Ромашка"<br />
          Сидорову Петру Валерьяновичу
        </div>
      </div>

      <!-- Номер и дата КП, назначение -->
      <div class="mt-4 mb-2 text-center">
        <div class="text-lg font-bold">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</div>
        <div class="font-semibold">
          № {{ commercialOfferId }} от
          {{ formatDate(products[0]?.created_at, true) }}
        </div>
        <div class="cursor-pointer text-sm text-blue-700 underline">
          на поставку торгового оборудования
        </div>
      </div>

      <!-- Вводный текст -->
      <div class="mt-4 mb-4 text-sm text-gray-700">
        Общество с ограниченной ответственностью «Моя компания» направляет Вам
        на рассмотрение коммерческое предложение на оборудование, приведенное в
        таблице:
      </div>

      <!-- Основная таблица товаров -->
      <div
        class="rounded-box mb-4 overflow-x-auto border border-gray-200 bg-white"
      >
        <table class="table border border-gray-200 bg-white">
          <thead>
            <tr class="border border-gray-200">
              <th>№</th>
              <th>Наименование</th>
              <th>Тип</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Скидка</th>
              <th>Количество</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, index) in products"
              :key="product.name_product"
              class="odd:bg-white even:bg-gray-200"
            >
              <th>{{ index + 1 }}</th>
              <td>{{ product.name_product }}</td>
              <td>{{ product.type_product }}</td>
              <td>{{ product.discription_product }}</td>
              <td>{{ formatPrice(product.price) }} ₽</td>
              <td>{{ product.discount_percent }}%</td>
              <td>{{ product.quantity }}</td>
              <td>{{ formatPrice(product.total_price) }} ₽</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="7" class="text-right">Итого:</th>
              <th>{{ formatPrice(calculateTotal()) }} ₽</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Итоговая сумма прописью, условия, подпись, контакты -->
      <div class="mt-2 mb-2 font-bold">
        Общая стоимость: {{ formatPrice(calculateTotal()) }} ₽
        <span class="text-sm font-normal italic">({{ totalInWords }})</span>
      </div>
      <div class="mb-2 text-xs text-gray-700">
        *Предложение действительно до {{ offerValidUntil }}. Доставка входит в
        стоимость.
      </div>
      <div class="mt-8 mb-2 flex items-center justify-between">
        <div class="text-sm">С уважением,<br />Генеральный директор</div>
        <div class="flex flex-col items-center">
          <span class="font-cursive text-2xl text-gray-700">Иванов</span>
          <span class="text-sm">Иванов И.И.</span>
        </div>
      </div>
      <div class="mt-4 border-t pt-2 text-xs text-gray-500">
        123456, Россия, г. Екатеринбург, пр. Ленина, 1<br />
        Тел/факс: +7 (343) 123-45-67 Тел/факс: +7 (343) 111-22-33<br />
        WWW.MYCOMPANY.RU INFO@MYCOMPANY.RU
      </div>
      <!-- Дополнительная таблица: Состав предложения по клиентам -->
      <div class="mt-10">
        <div class="mb-2 text-lg font-semibold text-gray-800">
          Состав предложения по клиентам
        </div>
        <div
          class="rounded-box overflow-x-auto border border-gray-200 bg-white"
        >
          <table class="table border border-gray-200 bg-white">
            <thead>
              <tr class="border border-gray-200">
                <th>Email клиента</th>
                <th>Имя клиента</th>
                <th>Продукт</th>
                <th>Тип</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Скидка</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in clientProposals"
                :key="idx"
                class="odd:bg-white even:bg-gray-200"
              >
                <td>{{ item.email_client }}</td>
                <td>{{ item.full_name }}</td>
                <td>{{ item.name_product }}</td>
                <td>{{ item.type_product }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatPrice(item.price) }} ₽</td>
                <td>{{ item.discount_percent }}%</td>
                <td>{{ item.manager_status }}</td>
                <td>{{ formatDate(item.created_at, true) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

definePageMeta({
  layout: 'custom'
})

const route = useRoute()
const commercialOfferId = route.params.id

interface Product {
  created_at: string
  status: boolean
  total_price: number
  name_product: string
  discription_product: string
  type_product: string
  price: number
  discount_percent: number
  quantity: number
  email_client: string | null
  manager_status: string | null
  full_name: string | null
  email: string | null
}

const products = ref<Product[]>([])

const formatDate = (date: string | undefined, onlyDate = false) => {
  if (!date) return 'Не указана'
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const calculateTotal = () => {
  return products.value.reduce((sum, product) => sum + product.total_price, 0)
}

// Прописью (очень простая реализация для примера)
const totalInWords = computed(() => {
  const total = calculateTotal()
  if (total === 0) return ''
  // Можно подключить библиотеку propishisum или реализовать свою функцию
  // Здесь просто пример:
  return `${total} рублей`
})

const offerValidUntil = computed(() => {
  // +1 месяц к дате первого продукта
  if (!products.value[0]?.created_at) return ''
  const d = new Date(products.value[0].created_at)
  d.setMonth(d.getMonth() + 1)
  return d.toLocaleDateString('ru-RU')
})

const pdfContent = ref<HTMLElement | null>(null)
const isExportingPDF = ref(false)

const clientProposals = ref<Product[]>([])
defineExpose({ clientProposals })

const downloadPDF = () => {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
  doc.addFont('/fonts/Inter-Regular.ttf', 'Inter', 'normal')
  doc.setFont('Inter')

  let y = 15

  // Заголовок
  doc.setFontSize(16)
  doc.text('ООО «Моя компания»', 20, y)
  y += 10
  doc.setFontSize(20)
  doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', 105, y, { align: 'center' })
  y += 10
  doc.setFontSize(12)
  doc.text(
    `№ ${commercialOfferId} от ${formatDate(products.value[0]?.created_at, true)}`,
    105,
    y,
    { align: 'center' }
  )
  y += 10
  doc.text('на поставку торгового оборудования', 105, y, { align: 'center' })
  y += 15
  doc.setFontSize(10)
  const introText =
    'Общество с ограниченной ответственностью «Моя компания» направляет Вам на рассмотрение коммерческое предложение на оборудование, приведенное в таблице:'
  const introLines = doc.splitTextToSize(introText, 180)
  doc.text(introLines, 20, y)
  y += introLines.length * 5

  // Таблица
  const tableHeaders = [
    '№',
    'Наименование',
    'Тип',
    'Описание',
    'Цена',
    'Скидка',
    'Кол-во',
    'Итого'
  ]
  const tableColumnWidths = [10, 35, 25, 45, 20, 15, 15, 20]
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
  products.value.forEach((product, idx) => {
    x = tableStartX

    // Перенос текста для каждой ячейки
    const nameLines = doc.splitTextToSize(
      product.name_product,
      tableColumnWidths[1] - 2
    )
    const typeLines = doc.splitTextToSize(
      product.type_product,
      tableColumnWidths[2] - 2
    )
    const descLines = doc.splitTextToSize(
      product.discription_product,
      tableColumnWidths[3] - 2
    )
    const priceLines = [`${formatPrice(product.price)} ₽`]
    const discountLines = [`${product.discount_percent}%`]
    const qtyLines = [product.quantity.toString()]
    const totalLines = [`${formatPrice(product.total_price)} ₽`]

    // Определяем максимальное количество строк в ряду
    const maxLines = Math.max(
      nameLines.length,
      typeLines.length,
      descLines.length,
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
      nameLines,
      typeLines,
      descLines,
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

  // Остальная информация
  doc.setFontSize(12)
  doc.text(`Общая стоимость: ${formatPrice(calculateTotal())} ₽`, 20, y)
  y += 8
  doc.setFontSize(10)
  doc.text(`(${totalInWords.value})`, 20, y)
  y += 10
  doc.text(
    `*Предложение действительно до ${offerValidUntil.value}. Доставка входит в стоимость.`,
    20,
    y
  )
  y += 10
  doc.text('С уважением,', 20, y)
  y += 8
  doc.text('Генеральный директор', 20, y)
  y += 8
  doc.text('Иванов И.И.', 20, y)
  y += 10
  doc.setFontSize(8)
  doc.text('123456, Россия, г. Екатеринбург, пр. Ленина, 1', 20, y)
  y += 5
  doc.text('Тел/факс: +7 (343) 123-45-67 Тел/факс: +7 (343) 111-22-33', 20, y)
  y += 5
  doc.text('WWW.MYCOMPANY.RU INFO@MYCOMPANY.RU', 20, y)

  doc.save(`commercial-offer-${commercialOfferId}.pdf`)
}

onMounted(async () => {
  // Здесь будет запрос к API для получения данных о КП
  // Временные данные для примера
  products.value = [
    {
      created_at: '2025-04-30 06:28:50',
      status: true,
      total_price: 7700,
      name_product: 'Медицинская информационная система',
      discription_product:
        'Какое-то описание, чем занимается и т.д Общество с ограниченной ответственностью «Моя компания» направляет Вам на рассмотрение коммерчес Общество с ограниченной ответственностью «Моя компания» направляет Вам на рассмотрение коммерчес Общество с ограниченной ответственностью «Моя компания» направляет Вам на рассмотрение коммерчес',
      type_product: 'СиМед-Клиника',
      price: 3400,
      discount_percent: 30,
      quantity: 1,
      email_client: 'aboba@mail.ru',
      manager_status: 'Отправлено',
      full_name: 'Игорь Кретов',
      email: 'admin@mail.ru'
    },
    {
      created_at: '2025-04-30 06:28:50',
      status: true,
      total_price: 7700,
      name_product: 'Медицинская информационная система',
      discription_product:
        '  Вам на рассмотрение  направляет Вам на рассмотрение коммерчес',
      type_product: 'СиМед-Клиника',
      price: 3400,
      discount_percent: 30,
      quantity: 1,
      email_client: 'aboba@mail.ru',
      manager_status: 'Отправлено',
      full_name: 'Игорь Кретов',
      email: 'admin@mail.ru'
    },
    {
      created_at: '2025-04-30 06:28:50',
      status: true,
      total_price: 7700,
      name_product: 'Медицинская информационная система',
      discription_product:
        '  Вам на рассмотрение  направляет Вам на рассмотрение коммерчес',
      type_product: 'СиМед-Клиника',
      price: 3400,
      discount_percent: 30,
      quantity: 1,
      email_client: 'aboba@mail.ru',
      manager_status: 'Отправлено',
      full_name: 'Игорь Кретов',
      email: 'admin@mail.ru'
    }
  ]
})
</script>

<style scoped>
.pdf-export,
.pdf-export * {
  background: #fff !important;
  border-color: #e5e7eb !important;
  color: #222 !important;
  box-shadow: none !important;
  /* Добавьте это, чтобы переопределить все возможные цвета */
  background-color: #fff !important;
  color: #000 !important;
  fill: #000 !important;
  stroke: #000 !important;
}
</style>

<template>
  <q-table
    title="QR код по 1C"
    :rows="data"
    :columns="columns"
    :loading="loading"
    :wrap-cells="true"
    separator="horizontal"
    :style="{ 'max-height': height, 'margin-right': '10px', 'max-width': '94vw' }"
    table-header-class="app_normal text-black"
    rows-per-page-label="Записей на странице: "
    :pagination="pagination"
    :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
      return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
    }"
  />
</template>
<script>
const columns = [
  { name: 'organization', required: true, label: 'Организация', align: 'left', field: 'exam_datetime', sortable: true },
  { name: 'type', label: 'Тип документа', align: 'left', field: 'organization_name', sortable: true },
  { name: 'datetime', label: 'Дата, время', align: 'left', field: 'terminal', sortable: true },
  { name: 'doc_number', label: '№ Документа', align: 'left', field: 'pers_number', sortable: true },
  { name: 'worker_name', label: 'ФИО', align: 'left', field: 'worker_name', sortable: true },
  { name: 'worker_num', label: 'Таб. №', align: 'left', field: 'worker_num', sortable: true },
  { name: 'doc_pdf', label: 'Просмотреть PDF', align: 'left', field: 'pers_number', sortable: false },
]

export default {

  data() {
    return {
      columns: columns,
      data: [
        {name: '', type: '', datetime: '', doc_number: '', worker: {worker_num: '', name: ''}, doc_pdf: ''}
      ]
    }
  }
}
</script>
<template>
  <div>
    <q-table
      class="terminals-table"
      title="Терминалы"
      :rows="terminals"
      :columns="columns"
      row-key="serial_number"
      :loading="loading"
      :wrap-cells="true"
      separator="horizontal"
      :style="{'max-height' : height, 'width': '1200px'}"
      table-header-class="app_normal text-black"
      rows-per-page-label="Записей на странице: "
      :pagination="pagination"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
        return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
      }"
    >
      <template #top>
        <div class="col-2 q-table__title">
          Терминалы
        </div>
        <q-space />
      </template>
      <template #body-cell-auto_admittance="props">
        <q-td :props="props" />
      </template>
    </q-table>
  </div>
</template>
  
<script>
import moment from 'moment';

const columns = [
  {
    name: 'serial_number',
    required: true,
    label: '№ Терминала',
    align: 'left',
    field: 'serial_number',
    sortable: true
  },
  {
    name: 'organization_name',
    label: 'Организация', 
    align: 'left', 
    field: 'organization_name', 
    sortable: true
  },
  {
    name: 'operation_start_date',
    label: 'Дата установки', 
    align: 'left', 
    field: 'operation_start_date', 
    format: val => moment(val).format('ll'),
    sortable: true
  },
  {
    name: 'operation_end_date',
    label: 'Дата снятия',
    align: 'left',
    field: 'operation_end_date',
    format: val => {
      if (val) {
        return moment(val).format('ll')
      }
      else {
        return "Не снят"
      }
    },
    sortable: true
  },
  { 
    name: 'all_exams_count',
    label: 'Количество осмотров', 
    align: 'left', 
    field: 'all_exams_count', 
    sortable: true 
  },
]

export default {
  props: {
    terminals: {
      type: Array,
      default() {
        return []
      }
    },
    height: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      columns: columns,
      pagination: {
        sortBy: 'serial_number',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
    }
  },
  computed: {
    loading() {
      return !this.terminals || (this.terminals.length == 0)
    },
  },
  mounted() {
    console.log(this.terminals)
  }
}

</script>

<style lang="sass" >
.terminals-table

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    margin: 0
    font-weight: bolder

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

.terminals-table
    color: black


</style>
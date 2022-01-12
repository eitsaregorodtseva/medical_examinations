<template>
  <div class="">
    <q-table
      dense
      class="exams-table"
      :rows="exams"
      :columns="columns"
      row-key="exam_datetime"
      :loading="loading"
      :wrap-cells="true"
      separator="horizontal"
      :style="{'max-height' : height}"
      table-header-class="app_normal"
      rows-per-page-label="Записей на странице: "
      :pagination="pagination"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
        return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
      }"
    >
      <template #body-cell-admittance="props">
        <q-td :props="props">
          <q-badge
            v-if="props.row.admittance === true"
            color="positive"
            text-color="black"
            :label="props.value"
          />
          <q-badge
            v-if="props.row.admittance === false"
            color="negative"
            text-color="white"
            :label="props.value"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog
      v-model="showExamDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      :full-width="true"
      :full-height="true"
    >
      <q-card class="d-flex flex-column bg-white">
        <div class="align-self-end sticky-top bg-white">
          <q-btn
            v-close-popup
            class="justify-self-end"
            flat
            icon="close"
          >
            <q-tooltip class="bg-white text-primary">
              Закрыть
            </q-tooltip>
          </q-btn>
        </div>
        <exam-data />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import ExamData from '@/views/ExamData.vue';
import { nameWithInitials } from '@/helpers/names'

const columns = [
  { name: 'exam_datetime', required: true, label: 'Дата и время', align: 'left', field: 'exam_datetime', format: val => moment(val).format('lll'), sortable: true },
  { name: 'type', label: 'Тип осмотра', align: 'left', field: 'type', sortable: true },
  { name: 'pressure', label: 'Давление', align: 'left', field: row => row.pressure_upper + '/' + row.pressure_lower, sortable: true },
  { name: 'heart_rate', label: 'Пульс', align: 'left', field: 'heart_rate', sortable: true },
  { name: 'temperature', label: 'Температура', align: 'left', field: 'temperature', format: val => val.toPrecision(3),sortable: true },
  { name: 'alcohol', label: 'Алкоголь', align: 'left', field: 'alcohol', sortable: true },
  {
    name: 'admittance',
    label: 'Допуск',
    align: 'left',
    field: 'admittance',
    format: val => {
      if (val === true) {
        return 'Допущен'
      } else if (val === false) {
        return 'Не допущен'
      } else {
        return ""
      }

    },
    sortable: true
  },
  {
    name:'verdicts',
    label: 'Причина недопуска',
    align: 'left',
    field: row => parseVerdictsList(JSON.parse(row.verdicts), row.verdict_comment),
    sortable: true
  },
  {
    name:'medworker',
    label: 'Медработник',
    align: 'left',
    field: row => nameWithInitials(row.med_second_name, row.med_first_name, row.med_father_name),
    sortable: true
  }
]

const parseVerdictsList = (verdicts_list, verdict_comment) => {
  if (!verdicts_list) {
    return "";
  }

  if (verdicts_list.includes('Допущен')) {
    return '';
  }
  if (verdicts_list.includes('Другое')) {
    // Replace with comment
    const ind = verdicts_list.indexOf('Другое');
    verdicts_list[ind] = verdict_comment;
  }
  return verdicts_list.join(', ');

}

export default {
  components: { ExamData },
  props: {
    exams : Array,
    height: String
  },
  data () {return {
    columns: columns,
    showExamDialog: false,
    pagination: {
        sortBy: 'exam_datetime',
        descending: true,
        page: 1,
        rowsPerPage: 15
      },
  } },
  computed : {
    loading () {
      return !this.exams || (this.exams.length == 0)
    }
  },
  methods : {
    onRowClicked(evt, row, index) {
      sessionStorage.setItem('exam_id', row.exam_id)
      this.showExamDialog = true
    }
  },
}

</script>

<style lang="sass" >
.exams-table

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


</style>

<template>
  <q-table
    class="exams-table"
    title="Осмотры"
    :rows="exams"
    :columns="columns"
    row-key="exam_datetime"
    :loading="loading"
    :wrap-cells="true"
    separator="horizontal"
    :style="{'max-height' : height, 'margin-right': '10px', 'max-width': '94vw'}"
    table-header-class="app_normal text-black"
    rows-per-page-label="Записей на странице: "
    :pagination="pagination"
    :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
      return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
    }"
    @row-click="onRowClicked"
  >
    <template #body-cell-auto_admittance="props">
      <q-td :props="props">
        <q-badge
          v-if="props.row.auto_admittance === true"
          outline
          color="positive"
          :label="props.value"
        />
        <q-badge
          v-if="props.row.auto_admittance === false"
          outline
          color="negative"
          :label="props.value"
        />
      </q-td>
    </template>
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
      <q-toolbar
        class="bg-white"
        style="position: sticky; z-index: 1; top: 0px;"
      >
        <q-space />
        <q-btn
          v-close-popup
          icon="close"
          flat
        >
          <q-tooltip class="bg-white text-primary">
            Закрыть
          </q-tooltip>
        </q-btn>
      </q-toolbar>
      <exam-data @verdict-made="showExamDialog = false" />
    </q-card>
  </q-dialog>
</template>

<script>
import moment from 'moment';
import ExamData from '@/components/ExamData/ExamData.vue';
import { nameWithInitials, fullName } from '@/constants/names'

const columns = [
  { name: 'exam_datetime', required: true, label: 'Дата и время', align: 'left', field: 'exam_datetime', format: val => moment(val).format('lll'), sortable: true },
  { name: 'organization_name', label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  { name: 'terminal', label: '№ Терминала', align: 'left', field: 'terminal', sortable: true },
  { name: 'pers_number', label: 'Таб. №', align: 'left', field: 'pers_number', sortable: true },
  {
    name: 'name',
    label: 'ФИО',
    align: 'left',
    field: row => fullName(row.second_name,  row.first_name, row.father_name),
    sortable: true
  },
  { name: 'exam_id', label: '№ осмотра', align: 'left', field: 'exam_id', sortable: true },
  { name: 'type', label: 'Тип осмотра', align: 'left', field: 'type', sortable: true },
  {
    name: 'auto_admittance',
    label: 'Автодопуск',
    align: 'left',
    field: 'auto_admittance',
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
  },
  { name: 'verdict_datetime',
    label: 'Время вынесения вердикта',
    align: 'left',
    field: 'verdict_datetime',
    format:  val => val==null ? "" : (moment(val).format('lll')),
    sortable: true
  },
  { name: 'duration', 
    label: 'Продолжительность вердикта', 
    align: 'left', 
    field: 'duration', 
    format:  val => val + " мин.", 
    sortable: true 
  },
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
  components: {
    ExamData,
  },
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
        rowsPerPage: 10
      },
  } },
  computed : {
    loading () {
      return !this.exams || (this.exams.length == 0)
    },
  },
  methods : {
    onRowClicked(evt, row) {
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

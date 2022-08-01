<template>
  <!-- <div class="q-pa-md q-gutter-sm"> -->
    <q-table
      class="exams-table"
      title="Осмотры"
      :rows="exams"
      :columns="columns"
      row-key="exam_datetime"
      :loading="loading"
      no-data-label="Похоже, пока новых осмотров нет"
      :wrap-cells="true"
      separator="horizontal"
      :style="{'max-height' : height}"
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
            outline
            v-if="props.row.auto_admittance === true"
            color="positive"
            :label="props.value"
          />
          <q-badge
            outline
            v-if="props.row.auto_admittance === false"
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
      <template #body-cell-name="props">
        <q-td :props="props">
          <router-link
            :to="'/personnel/' + props.row.pers_id"
            @click.stop=""
          >
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width column flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_satisfied_alt" />
          <span>
            Похоже, пока новых осмотров нет
          </span>
        </div>
      </template>
    </q-table>

  <!-- </div> -->
</template>

<script>
import moment from 'moment';
import { nameWithInitials, fullName } from '@/helpers/names'

const columns = [
  { name: 'exam_datetime', required: true, label: 'Дата и время', align: 'left', field: 'exam_datetime', format: val => moment(val).format('lll'), sortable: true },
  { name: 'organization_name', label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  { name: 'pers_number', label: 'Таб. №', align: 'left', field: 'pers_number', sortable: true },
  {
    name: 'name',
    label: 'ФИО',
    align: 'left',
    field: row => fullName(row.second_name,  row.first_name, row.father_name),
    sortable: true
  },
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
  props: {
    exams : Array,
    height: String
  },
  emits: [
    'examChosen'
  ],
  data () {return {
    columns: columns,
    pagination: {
        sortBy: 'exam_datetime',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
  } },
  computed : {
    loading () {
      return !this.exams //|| (this.exams.length == 0)
    }
  },
  methods : {
    onRowClicked(evt, row, index) {
      sessionStorage.setItem('exam_id', row.exam_id)
      this.$emit('examChosen')
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

.exams-table
    color: black


</style>

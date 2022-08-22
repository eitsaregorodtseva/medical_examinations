<template>
  <!-- <div class="q-pa-md q-gutter-sm"> -->
    <q-table
      class="exams-table"
      title="Осмотры"
      :rows="isFilterApplied ? filtered_data : exams"
      :columns="columns"
      row-key="exam_datetime"
      :loading="loading"
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
      <template v-slot:top>
        <div class="col-2 q-table__title">Осмотры</div>
        <q-space />
        <div class="text-caption q-mr-xs">Фильтры</div>
        <q-btn
          color="primary"
          icon="filter_list"
          size="md"
          flat
          @click="openFilters = true"
        >
          <q-badge v-show="isFilterApplied" color="accent" floating></q-badge>
          <q-tooltip class="bg-white text-primary">
            Применить фильтры
          </q-tooltip>
        </q-btn>
        <!--<q-btn
          color="primary"
          icon="filter_list_off"
          flat
          :disable="!isFilterApplied"
          @click="DropFilters"
          >
          <q-tooltip class="bg-white text-primary">
            Сбросить все фильтры
          </q-tooltip>
        </q-btn>-->
      </template>
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
    </q-table>

    <q-dialog
      v-model="openFilters"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-toolbar class="bg-white" style="position: sticky; z-index: 1; top: 0px;">
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
        <exams-history-filter :initFilters='filters' @OnFilterApplied="ApplyFilter($event)"></exams-history-filter>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showExamDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      :full-width="true"
      :full-height="true"
    >
      <q-card class="d-flex flex-column bg-white">
        <q-toolbar class="bg-white" style="position: sticky; z-index: 1; top: 0px;">
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
        <exam-data @verdict-made="showExamDialog = false"/>
      </q-card>
    </q-dialog>
  <!-- </div> -->
</template>

<script>
import moment from 'moment';
import ExamData from './ExamData/ExamData.vue';
import { nameWithInitials, fullName } from '@/helpers/names'
import ExamsHistoryFilter from './Filtering/ExamsHistoryFilter.vue';
import { getExamsHistoryAll } from '@/api/exams.api.js'
import { Notify } from 'quasar'

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
  components: {
    ExamData,
    ExamsHistoryFilter },
  props: {
    exams : Array,
    height: String
  },
  data () {return {
    columns: columns,
    showExamDialog: false,
    openFilters: false,
    filtered_data: [],
    filters: null,
    isFilterApplied: false,
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
    async ApplyFilter(filtersEventData){
      this.filters = filtersEventData.appliedFilters
      var requestArgs = filtersEventData.requestArgs

      if (this.filters != null){
        this.isFilterApplied = true
        var examsFromURL = []
        if (this.filters.personnelRadio == "custom"){
          for (var i = 0; i < this.filters.personnelSelection.length; i++){
            // set personnel_id
            requestArgs[3] = this.filters.personnelSelection[i].pers_id
            var response = await getExamsHistoryAll.apply(this, requestArgs)
            examsFromURL = examsFromURL.concat(response.data)
          }
        } else{
          var response = await getExamsHistoryAll.apply(this, requestArgs)
          examsFromURL = response.data
        }

        this.filtered_data = examsFromURL

        if (examsFromURL.length <= 0){
          Notify.create({
            color: 'warning',
            textColor: 'white',
            icon: 'warning',
            message: 'Результаты по заданным фильтрам не найдены'
          })
        } else {
          Notify.create({
              color: 'green-5',
              textColor: 'white',
              message: 'Фильтры успешно применены'
            })
        }
      } else{
        this.isFilterApplied = false
      }
    },

    DropFilters(){
      this.isFilterApplied = false
      this.filters = null
    },

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

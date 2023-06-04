<template>
  <div
    v-if="loading_state"
    style="display: flex; justify: center; margin-top: 20%;"
  >
    <q-spinner-oval
      color="dark"
      size="3em"
      style="margin: auto"
    />
  </div>
  <div v-else>
    <q-table
      v-model:pagination="pagination"
      class="exams_table"
      title="Загруженность"
      :rows="body"
      :columns="columns"
      :wrap-cells="true"
      separator="cell"
      style="height: 65vh; position: sticky;"
      table-header-class="app_normal text-black"
      rows-per-page-label="Записей на странице: "
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
        return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
      }"
      @request="onUpdateSettings"
    >
      <template #top>
        <div class="col-2 q-table__title">
          Загруженность
        </div>
      
        <filter-button
          style="position: absolute; right: 0"
          color="dark"
          organization-toggler-state="medworkers"
          @click="$emit('open-calendar')"
        />
      </template>
      <template #header="props">
        <q-tr class="app_normal text-black">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :rowspan="col.name === 'hours' ?1:2" 
            :colspan="col.name === 'hours'?24:1"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
        <q-tr
          class="app_normal text-black"
        >
          <q-th
            v-for="hour in hours"
            :key="hour"
            style="border-left: 1px solid rgba(0, 0, 0, 0.12)"
          >
            {{ hour }}
          </q-th>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td
            key="calendar_date"
            :props="props"
          >
            {{ props.row.calendar_date }}
          </q-td>
          <q-td
            key="date_of_week"
            :props="props"
          >
            {{ props.row.date_of_week }}
          </q-td>
          <q-td
            key="date_type"
            :props="props"
          >
            {{ props.row.date_type }}
          </q-td>
          <q-td
            key="medic"
            :props="props"
          >
            <q-tr
              v-for="medic in props.row.medic"
              :key="medic"
            >
              <q-td>
                {{ medic.fio }}
              </q-td>
            </q-tr>
          </q-td>
          <q-td
            v-for="hour in hours"
            key="medic"
            :props="props"
          >
            <q-tr
              v-for="medic in props.row.medic"
              :key="medic"
            >
              <q-td>
                {{ medic.workload[hour].verdict_count ?? 0 }}
              </q-td>
            </q-tr>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import { ref } from 'vue'
import FilterButton from './FilterButton.vue'

const columns = [
  { name: 'calendar_date', required: true, label: 'Дата', align: 'center', field: 'calendar_date', sortable: true },
  { name: 'date_of_week', label: 'День недели', align: 'center', field: 'date_of_week', sortable: true },
  { name: 'date_type', label: 'Тип дня', align: 'center', field: 'date_type', sortable: true },
  { name: 'medic', label: 'Значения', align: 'center', field: 'medic', sortable: true },
  { name: 'hours', label: 'Часы', align: 'center', field: 'hours', sortable: false },
]

const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

export default {
    components: { FilterButton },
    props: {
        data: {
            type: Object,
            default() {
                return {
                    total_count: 0,
                    arr: []
                };
            }
        },
        loading: {
          type: Boolean,
          default: false,
        }
    },
    emits: ["update-table", "open-calendar"],
    data() {
        return {
            tableRef: ref(),
            columns: columns,
            hours: hours,
            body: [],
            loading_state: true,
            user_id: this.$store.state.user.id,
            pagination: {
                sortBy: "calendar_date",
                descending: true,
                page: 1,
                rowsPerPage: 10,
                rowsNumber: 10,
            },
        };
    },
    mounted() {
        this.body = this.data[0].arr;
        this.pagination.rowsNumber = this.data[0].total_count;
        this.loading_state = this.loading
    },
    updated() {
        this.body = this.data[0].arr;
        this.pagination.rowsNumber = this.data[0].total_count;
        this.loading_state = this.loading
    },
    methods: {
        onUpdateSettings(props) {
            this.loading_state = true;
            const { page, rowsPerPage } = props.pagination;
            this.$emit("update-table", undefined, page, rowsPerPage);
            this.pagination.page = page;
            this.pagination.rowsPerPage = rowsPerPage;
        }
    }
}
</script>

<style scoped>
.q-table tbody td{
  height: 80px;
  padding: 0;
}
.q-table tbody td tr td{
  padding: 0 20px;
}
</style>
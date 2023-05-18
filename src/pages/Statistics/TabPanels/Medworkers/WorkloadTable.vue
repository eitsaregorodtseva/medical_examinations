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
      title="Загруженность"
      :rows="body"
      :columns="columns"
      :loading="loading_state"
      :wrap-cells="true"
      separator="horizontal"
      style="height: 65vh; position: sticky;"
      table-header-class="app_normal text-black"
      rows-per-page-label="Записей на странице: "
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
        return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
      }"
      @update:pagination="onUpdateSettings"
    />
  </div>
</template>
<script>
import { ref } from 'vue'

// const columns = [
//   { name: 'organization_name', required: true, label: 'Организация', align: 'left', field: 'calendar_date', sortable: true },
//   { name: 'fio', label: 'ФИО', align: 'left', field: 'date_of_week', sortable: true },
//   { name: 'role', label: 'Тип доступа', align: 'left', field: 'date_type', sortable: true },
//   { name: 'login', label: 'Логин', align: 'left', field: 'medic', sortable: true },
//   { name: 'password_hash', label: 'Пароль', align: 'left', field: 'fio', sortable: true },
//   { name: 'registration_date', label: 'Дата открытия', align: 'left', field: 'workload', sortable: true },
// ]
const columns = [
  { name: 'organization_name', required: true, label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  { name: 'fio', label: 'ФИО', align: 'left', field: 'fio', sortable: true },
  { name: 'role', label: 'Тип доступа', align: 'left', field: 'role', sortable: true },
  { name: 'login', label: 'Логин', align: 'left', field: 'login', sortable: true },
  { name: 'password_hash', label: 'Пароль', align: 'left', field: 'password_hash', sortable: true },
  { name: 'registration_date', label: 'Дата открытия', align: 'left', field: 'registration_date', sortable: true },
]

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          total_count: 0,
          arr: []
        }
      }
    }
  },
  emits: ['update-table'],
  data() {
    return {
      tableRef: ref(),
      columns: columns,
      body: [],
      loading_state: true,

      user_id: null,

      pagination: {
        
        sortBy: 'organization_name',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: 10,
        },
    }
  },
  mounted() {
    console.log(this.tableRef)
    
    this.populateDataFromStorage();
    this.loading_state = false; //remove
    console.log(this.data[0].total_count)
    this.body = this.data[0].arr;
    console.log(this.body)
    // this.tableRef.requestServerInteraction({pagination: this.pagination});
    // this.pagination.rowsNumber = this.data[0].total_count;
  },
  updated() {
    console.log(this.data[0].total_count)
    // this.body = this.data[0].arr;
    // console.log(this.body)
    // this.pagination.
  },
  methods: {
    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
    },
    onUpdateSettings(props) {
      const { page, rowsPerPage } = props;
      this.$emit('update-table', page, rowsPerPage);
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;

      this.body = this.data[0].arr;
    }
  }
}
</script>
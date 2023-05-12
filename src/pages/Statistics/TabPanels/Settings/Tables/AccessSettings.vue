<template>
  <div
    v-if="loading_state"
    style="display: flex; justify: center; margin-top: 20%"
  >
    <q-spinner-oval
      color="dark"
      size="3em"
      style="margin: auto"
    />
  </div>
  <div v-else>
    <q-table
      title="Доступ"
      :rows="data"
      :columns="columns"
      :loading="loading_state"
      :wrap-cells="true"
      separator="horizontal"
      style="max-height: 65vh"
      table-header-class="app_normal text-black"
      rows-per-page-label="Записей на странице: "
      :pagination="pagination"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
        return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
      }"
    />
  </div>
</template>
<script>
import { getAccessSettings } from '@/api/settings';
const columns = [
  { name: 'organization_name', required: true, label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  { name: 'fio', label: 'ФИО', align: 'left', field: 'fio', sortable: true },
  { name: 'role', label: 'Тип доступа', align: 'left', field: 'role', sortable: true },
  { name: 'login', label: 'Логин', align: 'left', field: 'login', sortable: true },
  { name: 'password_hash', label: 'Пароль', align: 'left', field: 'password_hash', sortable: true },
  { name: 'registration_date', label: 'Дата открытия', align: 'left', field: 'registration_date', sortable: true },
]

export default {

  data() {
    return {
      columns: columns,
      data: [],
      loading_state: true,

      user_id: null,

      pagination: {
        sortBy: 'organization_name',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
    }
  },
  mounted() {
    this.populateDataFromStorage();
    this.getAccessSettings();
  },
  methods: {
    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
    },

    async getAccessSettings() {
      try {
        var response;
        response = await getAccessSettings(
          this.user_id,
        );
        this.data = response.data;
        this.loading_state = false;
      } catch (err) {
        console.log(err);
      }
    }

  }
}
</script>
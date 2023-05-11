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
      title="Терминалы"
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
import { getTerminalsSettings } from '@/api/settings';
const columns = [
  { name: 'terminal', required: true, label: '№ Терминала', align: 'left', field: 'terminal', sortable: true },
  { name: 'status', label: 'Состояние', align: 'left', field: 'status', sortable: true },
]

export default {

  data() {
    return {
      columns: columns,
      data: [],
      loading_state: true,

      user_id: null,

      pagination: {
        sortBy: 'terminal',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
    }
  },
  mounted() {
    this.populateDataFromStorage();
    this.getTerminalsSettings();
  },
  methods: {
    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
    },

    async getTerminalsSettings() {
      try {
        var response;
        response = await getTerminalsSettings(
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
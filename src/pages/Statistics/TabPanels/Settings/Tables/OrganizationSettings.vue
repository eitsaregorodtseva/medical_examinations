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
      title="Организации"
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
import { getOrganizationSettings } from '@/api/settings';

const columns = [
  { name: 'organization_name', required: true, label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  { name: 'inn', label: 'ИНН', align: 'left', field: 'inn', sortable: true },
  { name: 'fio', label: 'ФИО', align: 'left', field: 'fio', sortable: true },
  { name: 'status', label: 'Должность', align: 'left', field: 'status', sortable: true },
  { name: 'phone_number', label: 'Телефон', align: 'left', field: 'phone_number', sortable: true },
  { 
    name: 'sms_alerts', 
    label: 'Оповещение об алкоголе', 
    align: 'left', 
    field: 'sms_alerts',
    format: field => field === 'yes' ? 'Да' : 'Нет',
    sortable: true, 
  },
]

export default {

  data() {
    return {
      columns: columns,
      data: [],
      loading_state: true,

      user_id: this.$store.state.user.id,

      pagination: {
        sortBy: 'organization_name',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
    }
  },
  mounted() {
    this.getOrganizationSettings();
  },
  methods: {
    async getOrganizationSettings() {
      try {
        var response;
        response = await getOrganizationSettings(
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
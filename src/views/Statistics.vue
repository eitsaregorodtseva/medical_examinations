<template>
  <q-page padding>
    <div class="row q-gutter-md col-6">
      <div class="h6 col">Выберите период</div>
      <!-- <q-date class="col" v-model="model" range minimal /> -->
      <input
        v-model="dates.from"
        class="col"
        type="date"
        required
      >
      <input
        v-model="dates.to"
        class="col"
        type="date"
        required
      >
      <button @click="updateOrganizationsTable" class="col btn_normal">Показать</button>
    </div>
    <organizations-statistics-table
      v-show="showTable"
      :organizations="organizationsList"
      :dates="dates"
      :user_id="user_id"
      height="80vh"
    />
  </q-page>
</template>

<script>
import OrganizationsStatisticsTable from '@/components/OrganizationsStatisticsTable.vue'
import { getAllOrganizationsStats, getOneOrganizationStats } from '@/api/organizations.api.js'
import moment from 'moment'

export default {
  components : {
        OrganizationsStatisticsTable
    },
  data () {return {
    // model: {from: '2020/07/07', to: '2020/07/17' }
    dates: {from: moment().subtract(1, 'months').format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD')},
    user_id: null,
    user_organization_id: null,
    organizationsList : [],
    showTable: false,
  }},
  mounted() {
        this.populateDataFromStorage()
    },
    methods : {
        populateDataFromStorage() {
            this.user_id = sessionStorage.getItem('user_id')
            this.user_organization_id = sessionStorage.getItem('user_organization_id')
        },

        async updateOrganizationsTable() {
          this.showTable = true
          try {
            var response
            if (this.user_organization_id === 'null') {
              response = await getAllOrganizationsStats(this.user_id, this.dates.from, this.dates.to)
            } else {
              response = await getOneOrganizationStats(this.user_organization_id, this.user_id, this.dates.from, this.dates.to)
            }
            this.organizationsList = response.data
          } catch (err) {
            console.log(err)
          }
        }


    }
}
</script>

<style>

</style>

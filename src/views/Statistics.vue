<template>
  <q-page>
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
      <button @click="showOrganizationsTable" class="col btn_normal">Показать</button>
    </div>
    <organizations-statistics-table
      :organizations="organizationsList"
      :dates="dates"
      :user_id="user_id"
      height="80vh"
    />
  </q-page>
</template>

<script>
import OrganizationsStatisticsTable from '@/components/OrganizationsStatisticsTable.vue'
import { getAllOrganizationsStats } from '@/api/organizations.api.js'
export default {
  components : {
        OrganizationsStatisticsTable
    },
  data () {return {
    // model: {from: '2020/07/07', to: '2020/07/17' }
    dates: {from: '2022-01-01', to: '2022-01-02'},
    user_id: null,
    user_organization_id: null,
    organizationsList : [],
  }},
  mounted() {
        this.populateDataFromStorage()
        this.showOrganizationsTable()
    },
    methods : {
        populateDataFromStorage() {
            this.user_id = sessionStorage.getItem('user_id')
            this.user_organization_id = sessionStorage.getItem('user_organization_id')
        },
        async fetchExams() {
            try {
                var response
                if (this.user_organization_id !== 'null') {
                    response = await getExamsHistoryForOrganization(this.user_id, this.user_organization_id)
                } else {
                    response = await getExamsHistoryAll(this.user_id)
                }
                this.organizationsList = response.data
            } catch (err) {

            }
        },

        async showOrganizationsTable() {
          try {
            var response
            response = await getAllOrganizationsStats(this.user_id, this.dates.from, this.dates.to)
            this.organizationsList = response.data
          }
          catch (err){
            console.log(err)
          }
        }
        

    }
}
</script>

<style>

</style>
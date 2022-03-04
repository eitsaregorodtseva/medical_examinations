<template>
<div class="q-pa-md q-gutter-sm">
    <q-table
      class="organizations-table"
      :rows="organizations"   
      :columns="columns"
      row-key="organization_id"
      :loading="loading"
      :wrap-cells="true"
      separator="horizontal"
      :style="{'max-height' : height}"
      rows-per-page-label="Записей на странице: "
      :pagination="pagination"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
        return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
      }"
    >
    
      <template v-slot:header="props">
          <q-tr class="app_normal" :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
            <q-th auto-width class="text-no-wrap"  align="center">По терминалам</q-th>
          </q-tr>
      </template>
      
      <template v-slot:body="props">
          <q-tr @click="onRowClicked(props)">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td auto-width  align="center">
              <q-btn size="sm" color="primary" round dense outline :icon="props.expand ? 'expand_less' : 'expand_more'" />
            </q-td>  
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
                <terminals-stats-table
                  :terminals="props.row.terminalList"
                />
            </q-td>
          </q-tr>
      </template>

    </q-table>
</div>
</template>

<script>
import TerminalsStatsTable from '@/components/TerminalsStatsTable.vue'
import { getAllTermsStats } from '@/api/terminals.api.js'
const columns = [
  { name: 'organization_name', label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  { name: 'exams_count', label: 'Кол-во осмотров', align: 'left', field: 'exams_count', sortable: true },
  { name: 'open_terms', label: 'По терминалам', align: 'left', field: 'open_terms', sortable: true },
]

export default {
  components : {
        TerminalsStatsTable
  },
  props: {
    organizations : Array,
    dates : Object,
    height: String,
    user_id: String
  },
  data () {return {
    expanded: [],
    columns: columns,
    terminalList: [],
    pagination: {
        page: 1,
        rowsPerPage: 10
      },
  } },
  computed : {
    loading () {
      return !this.organizations || (this.organizations.length == 0)
    }
  },
  methods : {
      async fetchTerminals(props) {
        try {
            var response
            response = await getAllTermsStats(this.user_id, props.row.organization_id, this.dates.from, this.dates.to)
            props.row.terminalList = response.data
          }
          catch (err){
            console.log(err)
          }
      },

      async onRowClicked(props) {
        props.expand = !props.expand
        if (props.expand){
          await this.fetchTerminals(props)
        }
      }
  },
}

</script>

<style lang="sass" >
.organizations-table

  .q-table__top,
  .q-table__bottom,
  thead:first-child tr:first-child th
    margin: 0
    font-weight: bolder

  thead:first-child tr th
    position: sticky
    z-index: 1
  thead:first-child tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px


</style>

<template>
  <q-page padding>
    <exams-history-table
      :exams="examsList"
      height="90vh"
    />
  </q-page>
</template>

<script>
import ExamsHistoryTable from './components/ExamsHistoryTable.vue'
import { getExamsHistoryAll, getExamsHistoryForOrganization } from '@/api/exams.api.js'
import moment from 'moment'
export default {
    components : {
        ExamsHistoryTable
    },
    data () { return {
        user_id: null,
        user_organization_id: null,
        examsList : [],
    }},
    computed: {
        requestArgs() {
            var args = [
                this.user_id, // 'user_id' -- 0
                null, // 'has_verdict' -- 1
                null, // 'organization_id' -- 2
                null, // 'personnel_id' -- 3
                moment(new Date()).format('YYYY-MM-DD') + "T00:00:00", // 'date_from' -- 4
                moment(new Date()).format('YYYY-MM-DD') + "T23:59:59.99999", // 'date_to' -- 5
                null, // 'type' -- 6
                null, // 'admittance' -- 7
            ];
            return args;
        }
    },
    mounted() {    
        this.populateDataFromStorage()
        this.fetchExams()
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
                    response = await getExamsHistoryAll.apply(this, this.requestArgs)
                }
                this.examsList = response.data
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>

<style>

</style>

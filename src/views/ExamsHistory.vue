<template>
  <exams-history-table
    :exams="examsList"
    height="90vh"
  />
</template>

<script>
import ExamsHistoryTable from '@/components/ExamsHistoryTable.vue'
import { getExamsHistoryAll, getExamsHistoryForOrganization } from '@/api/exams.api.js'
export default {
    components : {
        ExamsHistoryTable
    },
    data () { return {
        user_id: null,
        user_organization_id: null,
        examsList : [],
    }},
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
                    response = await getExamsHistoryAll(this.user_id)
                }
                this.examsList = response.data
            } catch (err) {

            }
        }
    }
}
</script>

<style>

</style>

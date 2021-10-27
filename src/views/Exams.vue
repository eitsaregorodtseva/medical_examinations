<template>
  <exams-table 
  :exams="examsList"> </exams-table>
</template>

<script>
const USER_ID=4
import ExamsTable from '@/components/ExamsTable.vue'
import { getExams } from '@/api/exams.api.js'
export default {
    components : {
        ExamsTable
    },
    data () { return {
        examsList : [],
    }},
    methods : {
        async fetchExams() {
            try {
                const response = await getExams(USER_ID)
                console.log(response.data);
                this.examsList = response.data
            } catch (err) {
                
            }
        }
    },
    mounted() {
        this.fetchExams()
    }
}
</script>

<style>

</style>
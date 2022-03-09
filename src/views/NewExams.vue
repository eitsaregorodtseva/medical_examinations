<template>
  <q-page>
    <exams-queue-table
      :exams="examsList"
      height="90vh"
    />
  </q-page>
</template>

<script>
import ExamsQueueTable from '@/components/ExamsQueueTable.vue'
import { getExamsHistoryByVerdict } from '@/api/exams.api.js'
import notificationSound from '@/assets/sounds/done-for-you-612.mp3';
export default {
    components : {
        ExamsQueueTable
    },
    data () { return {
        user_id: null,
        user_organization_id: null,
        examsList : [],
        queueCheckTimer : '',
        isJustLoaded : true
    }},
    watch : {
      examsList(current, last) {
        if (current.length === 0) {
          document.title = 'medexam'
        } else {
          var is_new = false
          for (let i = 0; i < current.length; i++) {
            var is_found = false
            for (let j = 0; j < last.length; j++) {
              if (current[i].exam_id === last[j].exam_id){
                is_found = true
                break
              }
            }
            if (!is_found){
              is_new = true
              break
            }
          }
          if (is_new && !this.isJustLoaded){
            this.playSound(notificationSound)
          }
          if (this.isJustLoaded){
            this.isJustLoaded = false
          }
          document.title = '* medexam | ' + current.length + ' в очереди'
        }
      }
    },
    mounted() {
      this.isJustLoaded = true;
      this.populateDataFromStorage()
      this.fetchExams()
      this.queueCheckTimer = setInterval(this.fetchExams, 5000);
    },
    beforeUnmount () {
      document.title = 'medexam';
      this.cancelAutoUpdate();
    },
    methods : {
        populateDataFromStorage() {
            this.user_id = sessionStorage.getItem('user_id')
            this.user_organization_id = sessionStorage.getItem('user_organization_id')
        },
        async fetchExams() {
            try {
                var response
                response = await getExamsHistoryByVerdict(this.user_id, false)
                this.examsList = response.data
            } catch (err) {
                console.error(err)
            }
        },
        cancelAutoUpdate() {
          clearInterval(this.queueCheckTimer);
        },
        playSound(url) {
          const audio = new Audio(url);
          audio.play();
        }
    }
}
</script>

<style>

</style>

<template>
  <q-page padding>
    <div
      v-if="showTable"
    >
      <exams-queue-table
        :exams="examsList"
        height="90vh"
        @exam-chosen="startResultsChecking"
      />
      <q-dialog
        v-model="examDetailsVisible"
        transition-show="slide-up"
        transition-hide="slide-down"
        :full-width="true"
        :full-height="true"
      >
        <q-card class="d-flex flex-column bg-white">
          <div class="align-self-end sticky-top bg-white">
            <q-btn
              v-close-popup
              class="justify-self-end"
              flat
              icon="close"
            >
              <q-tooltip class="bg-white text-primary">
                Закрыть
              </q-tooltip>
            </q-btn>
          </div>
          <exam-data
            :start-time="start_time"
            @verdict-made="examDetailsVisible=false"
          />
        </q-card>
      </q-dialog>
    </div>
    <div
      v-else
      class="fit column items-center q-gutter-md"
    >
      <div class="col-auto text-h6">
        Для начала осмотров нажмите кнопку
      </div>
      <div class="col">
        <q-btn
          color="deep-orange"
          rounded
          push
          size="xl"
          class="text-bold"
          align="around"
          icon="touch_app"
          label="начать осмотры"
          @click="startExamsMonitoring"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import ExamsQueueTable from './components/ExamsQueueTable.vue'
import ExamData from '@/components/ExamData/ExamData.vue';

import { getExamsHistoryByVerdict } from '@/api/exams.api.js'
// const notificationSoundURL = './sounds/done-for-you-612.mp3';
const notificationSoundURL = './sounds/bell_notification.wav';
const timerWorkerPath = './workers/webWorkerTimer.js'

export default {
    components : {
      ExamsQueueTable,
      ExamData,
    },
    data () { return {
      user_id: this.$store.state.user.id,
      user_organization_id: this.$store.state.user.organization_id,
      examsList : [],
      queueCheckTimer : '',
      showTable: false,
      examDetailsVisible: false,
      tabBlinkTimer: null,
      tabNeedsAttention : false,
      notificationSound: null,
      start_time: null,
    }},
    watch : {
      examsList(current, last) {
        if (current.length === 0) {
          this.cancelTabBlinking()
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
          if (is_new){
            console.log("New exams found")
            this.startTabBlinking();
            this.notificationSound.play()
          }
        }
      },
      examDetailsVisible(current, last) {
        // When dialog is closed
        if (current == false && last == true) {
          this.fetchExams()
        }
      },
      tabNeedsAttention(current, last) {
        if (current === true) {
          this.tabAttentionState()
        } else {
          this.tabDefaultState()
        }
      },
    },
    mounted() {
      this.notificationSound = new Audio(notificationSoundURL);
    },
    beforeUnmount () {
      this.cancelAutoUpdate();
      this.cancelTabBlinking();
      this.tabDefaultState();
    },
    methods : {
        startResultsChecking(start_time) {
          console.log(start_time)
          this.examDetailsVisible = true;
          this.start_time = start_time;
        },
        startExamsMonitoring() {
          this.showTable = true
          this.fetchExams()
          this.queueCheckTimer = new Worker(timerWorkerPath);
          this.queueCheckTimer.postMessage('5000')
          this.queueCheckTimer.onmessage = this.fetchExams
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
          if (this.queueCheckTimer) {
            this.queueCheckTimer.terminate();
          }
        },
        startTabBlinking() {
          if (!this.tabBlinkTimer) {
            this.tabBlinkTimer = new Worker(timerWorkerPath)
            this.tabBlinkTimer.postMessage('1000')
            this.tabBlinkTimer.onmessage = this.blinkTab
          }
          this.tabNeedsAttention = true
        },
        cancelTabBlinking() {
          if (this.tabBlinkTimer) {
            this.tabBlinkTimer.terminate()
            this.tabBlinkTimer = null;
          }
          this.tabNeedsAttention = false;
        },
        blinkTab() {
          this.tabNeedsAttention = !this.tabNeedsAttention;
        },
        tabDefaultState() {
          const favicon = document.querySelector("link[rel~='icon']");
          favicon.href = "favicon.ico?v=1.0";
          document.title = 'меддопуск.рф';
        },
        tabAttentionState() {
          const favicon = document.querySelector("link[rel~='icon']");
          favicon.href = "favicon_exclamation.ico";
          document.title = 'НОВЫЕ ОСМОТРЫ: ' + this.examsList.length;
        }
    }
}
</script>

<style>

</style>

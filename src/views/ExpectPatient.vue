<template>
  <app-centered-box>
    <div class="fit column items-center justify-center">
      <button
        id="btn"
        class="btn_normal"
        @click="get_next_patient"
      >
        Следующий пациент
      </button>
    </div>
    <div
      class="text-center"
      style="position: relative; top: -15px"
    >
      Пациентов в очереди: {{ patientsInQueue }}
    </div>
  </app-centered-box>
</template>

<script>
import { getNextPatient, getQueueSize } from '@/api/exams.api'
import AppCenteredBox from '../components/AppCenteredBox.vue';
import notificationSound from '@/assets/sounds/done-for-you-612.mp3';

export default {
  components: { AppCenteredBox },
    data() { return {
      user_id: sessionStorage.getItem('user_id'),
      patientsInQueue : 0,
      queueCheckTimer : '',
    }},
    watch : {
      patientsInQueue(current, last) {
        if (current === 0) {
          document.title = 'medexam'
        } else {
          this.playSound(notificationSound)
          document.title = '* medexam | ' + current + ' в очереди'
        }
      }
    },
    created () {
      this.getPatientsInQueue();
      this.queueCheckTimer = setInterval(this.getPatientsInQueue, 10000);
    },
    beforeUnmount () {
      document.title = 'medexam';
      this.cancelAutoUpdate();
    },
    methods: {
        async get_next_patient() {
            try {
                const response = await getNextPatient(this.user_id);
                sessionStorage.setItem('exam_id', response.data);
                this.$router.push('/exam_data');
            } catch (error) {
                if (error.response.status === 404) {
                    this.$notify({
                    type : 'success',
                    title : 'В очереди нет пациентов',
                    });
                }
            }
        },
        async getPatientsInQueue() {
          try {
            const response = await getQueueSize(this.user_id);
            this.patientsInQueue = response.data;
          } catch(error) {
            console.log(error);
          }
        },
        cancelAutoUpdate() {
          clearInterval(this.queueCheckTimer);
        },
        playSound(url) {
          const audio = new Audio(url);
          audio.play(notificationSound);
        }
    }
}
</script>

<style scoped>
button {
    border-radius: 10px;
    font-size: 30px;
}

#btn {
    width: 250px;
    height: 100px;
}
</style>

<template>
  <q-page class="q-pa-md fit">
    <q-inner-loading :showing="!dataLoaded">
      <q-spinner
        color="primary"
        size="3em"
      />
    </q-inner-loading>
    <div
      v-if="dataLoaded"
    >
      <div class="row fit items-stretch">
        <div class="col-lg-5">
          <h5>Осмотр: № {{ exam_id }} </h5>
          <div id='personnel_data' class="row items-start">
            <app-image
              :image-id="exam_data.photo"
              class="col-xs-4 col-md-6 col-xl-3"
              style="min-width: 150px;"
            />
            <div
              class="col-auto"
            >
              <q-card>
                <q-card-section class="d-flex flex-column">
                  <div class="text-h6">
                    {{ personnelFullName }}
                  </div>
                  <div>
                    Организация: ООО "Тесты"
                  </div>
                  <div>
                    Пол: {{ exam_data.gender }}
                  </div>
                  <div>
                    Возраст: {{ exam_data.age }}
                  </div>
                </q-card-section>
                <q-card-section>
                  Ответственный: Бобков Иван Вячеславович
                  <br>
                  Тел: +7 (915) 013-30-11
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="mt-4 col q-gutter-sm">
            <q-card>
              <q-card-section class="text-h6 text-center">
                Данные приборов
              </q-card-section>
              <q-card-section class="q-pt-none">
                <sensor-data-table :exam-data="exam_data" />
              </q-card-section>
            </q-card>
            <q-card>
              <q-card-section class="text-h6 text-center">Жалобы</q-card-section>
              <q-card-section class="q-pt-none"> {{ parsedComplaints || 'Нет' }} </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="column col-lg q-py-sm justify-around ">
          <q-card id='given_verdict'
            v-if="exam_data.admittance !== null"
            class="mt-2 p-2 d-flex flex-column"
          >
            <h6 class="align-self-center">Вердикт</h6>
            <q-separator />
            <div class="mt-2">
              <span> Автоматический: </span>
              <span>
                <q-badge
                  v-if="exam_data.auto_admittance === true"
                  outline
                  color="positive"
                >
                  Допущен
                </q-badge>
              </span>
              <span>
                <q-badge
                  v-if="exam_data.auto_admittance === false"
                  outline
                  color="negative"
                >
                  Не допущен
                </q-badge>
              </span>
            </div>
            <div class="mt-3">
              Медработник <strong> {{ medNameWithInitials }} </strong> :
              <q-badge
                v-if="exam_data.admittance"
                color="positive"
                text-color="white"
              >
                Допущен
              </q-badge>
              <q-badge
                v-if="!exam_data.admittance"
                color="negative"
                text-color="white"
              >
                Не допущен
              </q-badge>
            </div>
            <div
              v-if="!exam_data.admittance"
              class="mt-3"
            >
              {{ parsedVerdictsList }}
            </div>
          </q-card>
          <div id='new_verdict'
            v-if="exam_data.admittance === null"
            class="container mt-4"
          >
            <q-card
              class="mb-3 p-2"
            >
              <span class="p-2"> Автоматический вердикт: </span>
              <span>
                <q-badge
                  v-if="exam_data.auto_admittance === true"
                  color="positive"
                >
                  Допущен
                </q-badge>
              </span>
              <span>
                <q-badge
                  v-if="exam_data.auto_admittance === false"
                  color="negative"
                >
                  Не допущен
                </q-badge>
              </span>
            </q-card>
            <div class="d-flex justify-content-around">
              <button
                id="reject"
                type="button"
                class="btn_error"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                @click="getlist"
              >
                Не допустить
              </button>
              <button
                id="resolve"
                class="btn_normal"
                @click="admit"
              >
                Допустить
              </button>
            </div>
          </div>
          <video-players
            :source1="serverURL + '/' + (exam_data.video1 || '1') + '.mp4'"
            :source2="serverURL + '/' + (exam_data.video2 || '2') + '.mp4'"
            />
        </div>
      </div>
      <div id="exampleModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <form
            class="form-horizontal"
            @submit.prevent="req_form"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5
                  id="exampleModalLabel"
                  class="modal-title"
                >
                  Причины недопуска
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div class="modal-body">
                <div
                  v-for="item in verd_list"
                  :key="item.id"
                  class="input-group"
                >
                  <div class="input-group-text">
                    <input
                      v-model="checked"
                      class="form-check-input mt-0"
                      type="checkbox"
                      :value="item.id"
                    >
                  </div>
                  <label
                    class="form-check-label form-control"
                    for="flexCheckDefault"
                  >
                    {{ item.text }}
                  </label>
                </div>
                <div class="input-group">
                  <div class="input-group-text">
                    <input
                      v-model="checked_13"
                      class="form-check-input mt-0"
                      type="checkbox"
                      :value="13"
                    >
                  </div>
                  <input
                    v-model="comment_13"
                    type="text"
                    class="form-control"
                    placeholder="Другое"
                  >
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Отмена
                </button>
                <button
                  v-if="checked.length > 0 || checked_13"
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  @click="req_form"
                >
                  Отправить
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  disabled
                  @click="req_form"
                >
                  Отправить
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <q-tabs
        v-model="active_history_tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        content-class="q-pt-md"
      >
        <q-tab
          name="history"
          label="История"
        />
        <q-tab
          name="med-papers"
          label="Справки (скоро)"
          disable
        />
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="active_history_tab"
        animated
      >
        <q-tab-panel name="history">
          <exam-data-history-table
            v-if="dataLoaded"
            :exams="exam_hist"
            height="90vh"
          />
        </q-tab-panel>
        <q-tab-panel name="med-papers">

        </q-tab-panel>
      </q-tab-panels>
    </div>

  </q-page>
</template>

<script>
import SensorDataTable from '@/components/ExamData/SensorDataTable.vue'
import ExamDataHistoryTable from '@/components/ExamData/ExamDataHistoryTable.vue'
import AppImage from '@/components/AppImage'
import { getVerdictList,
    getExamData,
    getExamsHistoryForPersonnel,
    postVerdict,
    patchMedworkerInExam, } from '@/api/exams.api'
import { fullName } from '@/helpers/names'
import VideoPlayers from '@/components/ExamData/VideoPlayers.vue'
import {serverURL} from '@/api/services'

export default {

    components: {
        ExamDataHistoryTable,
        SensorDataTable,
        VideoPlayers,
        AppImage,
    },
    data() {
            return {
                serverURL: serverURL,
                verd_list: [],
                exam_data: {},
                exam_hist: {},
                checked: [],
                comment_13: '',
                checked_13: false,
                user_id: sessionStorage.getItem('user_id'),
                exam_id: sessionStorage.getItem('exam_id'),
                active_history_tab: "history"
        }
    },
    computed : {
        dataLoaded () {
          return this.exam_data && 0 !== Object.keys(this.exam_data).length
        },
        parsedComplaints () {
            if (this.dataLoaded && this.exam_data.complaints) {
                return this.exam_data.complaints.replaceAll('"', '').replace('[', '').replace(']', '');
            } else {
                return ''
            }
        },
        personnelFullName () {
            if (!this.dataLoaded) {
              return ''
            } else {
              return fullName(this.exam_data.second_name, this.exam_data.first_name, this.exam_data.father_name)
            }
        },
        medNameWithInitials () {
          if (!this.exam_data || !this.exam_data.med_first_name || !this.exam_data.med_second_name) {
            return ''
          }
          let result = this.exam_data.med_second_name
                  + ' ' + this.exam_data.med_first_name.charAt(0) + '.';
          if (this.exam_data.med_father_name) {
              result += this.exam_data.med_father_name.charAt(0) + '.';
          }
          return result;
        },
        parsedVerdictsList () {
          if (!this.dataLoaded || !this.exam_data.verdicts) {
            return "";
          }
          let verdicts_list = JSON.parse(this.exam_data.verdicts);
          console.log(verdicts_list);

          if (verdicts_list.includes('Допущен')) {
            return '';
          }
          if (verdicts_list.includes('Другое')) {
            // Replace with comment
            const ind = verdicts_list.indexOf('Другое');
            verdicts_list[ind] = this.exam_data.verdict_comment;
          }
          return verdicts_list.join(', ');

        }
    },
    mounted() {
        this.getdata()
    },
    methods: {
        async getlist() {
            try {
                const response = await getVerdictList();
                this.verd_list = response.data;
                this.verd_list.shift();
                this.verd_list.pop();
            } catch (error) {
            }
        },
        async getdata() {
            try {
              const exam_data = await getExamData(this.exam_id, this.user_id);
              const exam_hist = await getExamsHistoryForPersonnel(this.user_id, exam_data.data.pers_id);
              this.is_requested = true;
              this.exam_data = exam_data.data;
              this.exam_hist = exam_hist.data;
            } catch (error) {
              console.log(error);
            }
        },
        req_form() {
            let verdicts = [];
            for (let i of this.checked)
                verdicts.push(i);
            if (this.checked_13 || this.comment_13 !== '')
                verdicts.push(13);
            try {
                postVerdict(this.exam_id, verdicts, this.user_id, this.comment_13);
                patchMedworkerInExam(this.exam_id, this.user_id, this.user_id);
                this.$router.push('/new_exams');
            } catch (error) {
            }
        },
        admit() {
            try {
                let verdicts = [ 1 ];
                postVerdict(this.exam_id, verdicts, this.user_id);
                patchMedworkerInExam(this.exam_id, this.user_id, this.user_id);
                this.$router.push('/new_exams');
            } catch (error) {
            }
        }
    }
};
</script>

<style scoped>

button {
    border-radius: 50px;
}

#reject {
    width: 200px;
    height: 40px;
    font-weight: 900;
    font-size: 15px;
}

#resolve {
    width: 200px;
    height: 40px;
    font-weight: 900;
    font-size: 15px;
}

</style>

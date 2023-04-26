<template>
  <q-page padding>
    <q-inner-loading :showing="!dataLoaded">
      <q-spinner
        color="primary"
        size="3em"
      />
    </q-inner-loading>
    <div
      v-if="dataLoaded"
    >
      <div class="text-h5 q-mb-lg">
        Осмотр: № {{ exam_id }}
      </div>
      <div class="row justify-around items-start q-col-gutter-md">
        <div class="col-md col-xl-4 column q-col-gutter-sm">
          <q-card
            class="col-auto"
          >
            <q-card-section
              :horizontal="$q.screen.gt.sm"
              class="fit"
            >
              <q-card-section class="col-md">
                <app-image
                  :image-id="exam_data.photo"
                />
              </q-card-section>

              <q-separator vertical />

              <q-card-section class="col-md">
                <div class="text-h6">
                  {{ personnelFullName }}
                </div>
                <div>
                  Организация: {{ organization_data.name }}
                  <br>
                  Пол: {{ exam_data.gender }}
                  <br>
                  Возраст: {{ exam_data.age }}
                  <q-separator class="q-my-md" />
                  Ответственный: {{ managerFullName }}
                  <br>
                  Тел: {{ organization_data.manager_phone_number }}
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>

          <div class="col">
            <sensor-data-table :exam-data="exam_data" />
            <q-card class="q-mt-sm">
              <q-card-section class="text-h6 text-center q-pa-sm">
                Жалобы
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-md text-center">
                {{ parsedComplaints || 'Нет жалоб' }}
              </q-card-section>
            </q-card>
          </div>
          <div
            v-if="$q.screen.lt.lg"
            class="col-auto"
          >
            <q-card>
              <q-card-section class="text-h6 text-center q-pa-sm">
                Справки
              </q-card-section>
              <q-separator class="q-pt-none" />
              <q-card-section class="q-pt-sm">
                <medpapers-grid
                  class="fit"
                  dense
                  :personnel-id="exam_data.pers_id"
                  :user-id="user_id"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="col-md col-xl-6 column q-col-gutter-md justify-start">
          <div class="col-auto">
            <exam-verdict
              :exam-id="exam_id"
              :exam-data="exam_data"
              :user-id="user_id"
              :user-role="user_role"
              :start-time="startTime"
              @verdict-made="$emit('verdictMade')"
            />
          </div>
          <div class="col">
            <q-btn
              label="Сообщить о некачественно проведенном осмотре"
              :href="reportPoorQualityExam"
              target="_blank"
              outline
              no-caps
            />
          </div>
          <video-players
            class="col"
            :source1="serverURL + '/' + (exam_data.video1 || '1') + '.mp4'"
            :source2="serverURL + '/' + (exam_data.video2 || '2') + '.mp4'"
          />
          <div
            v-if="$q.screen.gt.lg || $q.screen.lg"
            class="col-auto"
          >
            <q-card>
              <q-card-section class="text-h6 text-center q-pa-sm">
                Справки
              </q-card-section>
              <q-separator class="q-pt-none" />
              <q-card-section class="q-pt-sm">
                <medpapers-grid
                  class="fit"
                  dense
                  :personnel-id="exam_data.pers_id"
                  :user-id="user_id"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="text-h6 q-pa-md">
        Предыдущие осмотры
      </div>
      <exam-data-history-table
        v-if="dataLoaded"
        :exams="exam_hist"
        height="90vh"
      />
    </div>
  </q-page>
</template>

<script>
import SensorDataTable from './SensorDataTable.vue'
import ExamDataHistoryTable from './ExamDataHistoryTable.vue'
import ExamVerdict from './ExamVerdict.vue'
import AppImage from '@/components/AppImage'
import MedpapersGrid from '@/components/Medpapers/MedpapersGrid'
import {
    getExamData,
    getExamsHistoryForPersonnel,
} from '@/api/exams.api'
import { fullName } from '@/helpers/names'
import VideoPlayers from '@/components/ExamData/VideoPlayers.vue'
import {serverURL} from '@/api/services'
import {getPersonnelRecord} from '@/api/personnel.api'
import {getOneOrganization} from '@/api/organizations.api'

export default {
    components: {
        ExamDataHistoryTable,
        SensorDataTable,
        VideoPlayers,
        AppImage,
        MedpapersGrid,
        ExamVerdict,
    },
    props: {
      startTime: {
        type: Date,
        default: new Date(),
      }
    },
    emits: ['verdictMade'],
    data() {
            return {
                serverURL: serverURL,
                exam_data: {},
                organization_data: {},
                exam_hist: {},
                user_id: sessionStorage.getItem('user_id'),
                user_role: sessionStorage.getItem('user_role'),
                exam_id: sessionStorage.getItem('exam_id'),
                active_history_tab: "history"
        }
    },
    computed : {
        dataLoaded () {
          return this.exam_data && this.organization_data && 0 !== Object.keys(this.exam_data).length
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
        managerFullName () {
            if (!this.dataLoaded) {
              return ''
            } else {
              return fullName(this.organization_data.manager_second_name, this.organization_data.manager_first_name, this.organization_data.manager_father_name)
            }
        },
        reportPoorQualityExam() {
          return `https://docs.google.com/forms/d/e/1FAIpQLSc4n0KyCwgb9wAvILOeRGAWXuMbENT2tw-a8XRste9S6gsRew/viewform?usp=pp_url&entry.760264006=${this.exam_id}&entry.1989991990=${this.user_id}`
        }
    },
    mounted() {
        this.getdata()
    },
    methods: {
        async getdata() {
            try {
              const exam_data = await getExamData(this.exam_id, this.user_id);
              const personnel_data = await getPersonnelRecord(this.user_id, exam_data.data.pers_id);
              const organization_data = await getOneOrganization(this.user_id, personnel_data.data.organization_id);
              const exam_hist = await getExamsHistoryForPersonnel(this.user_id, exam_data.data.pers_id);
              this.is_requested = true;
              this.exam_data = exam_data.data;
              this.organization_data = organization_data.data;
              this.exam_hist = exam_hist.data;
            } catch (error) {
              console.log(error);
            }
        },

    }
};
</script>

<template>
  <q-card
    v-if="examData.admittance !== null"
    id="given_verdict"
    class="column"
  >
    <q-card-section class="text-h6 text-center q-pa-sm">
      Вердикт
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pt-sm">
      <span> Автоматический: </span>
      <span>
        <q-badge
          v-if="examData.auto_admittance === true"
          outline
          color="positive"
        >
          Допущен
        </q-badge>
      </span>
      <span>
        <q-badge
          v-if="examData.auto_admittance === false"
          outline
          color="negative"
        >
          Не допущен
        </q-badge>
      </span>
    </q-card-section>
    <q-card-section class="q-pt-none">
      Медработник <strong> {{ medNameWithInitials }} </strong> :
      <q-badge
        v-if="examData.admittance"
        color="positive"
        text-color="white"
      >
        Допущен
      </q-badge>
      <q-badge
        v-if="!examData.admittance"
        color="negative"
        text-color="white"
      >
        Не допущен
      </q-badge>
      <q-card
        v-if="!examData.admittance"
        flat
        bordered
        class="q-mt-sm bg-grey-1 q-px-sm"
      >
        {{ parsedVerdictsList }}
      </q-card>
    </q-card-section>
  </q-card>
  <q-card
    v-if="examData.admittance === null"
    id="new_verdict"
    class="container mt-4"
  >
    <q-card-section>
      <div class="text-h6 text-center">
        Вердикт
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <span class="p-2"> Автоматический вердикт: </span>
      <span>
        <q-badge
          v-if="examData.auto_admittance === true"
          color="positive"
        >
          Допущен
        </q-badge>
      </span>
      <span>
        <q-badge
          v-if="examData.auto_admittance === false"
          color="negative"
        >
          Не допущен
        </q-badge>
      </span>
    </q-card-section>
    <q-card-section
      v-if="userRole != Role.MedWorker"
      class="q-pt-none"
    >
      Медработник еще не выставил вердикт
    </q-card-section>
    <q-card-actions
      v-if="userRole == Role.MedWorker"
      align="around"
    >
      <q-btn
        id="reject"
        rounded
        text-color="white"
        class="btn_error"
        @click="showReasonsDialog = true"
      >
        Не допустить
      </q-btn>
      <q-btn
        id="resolve"
        rounded
        text-color="white"
        class="btn_normal"
        @click="admit"
      >
        Допустить
      </q-btn>
    </q-card-actions>
  </q-card>

  <q-dialog v-model="showReasonsDialog">
    <q-card>
      <q-toolbar class="bg-white">
        <q-toolbar-title>Причины недопуска</q-toolbar-title>
        <q-btn
          v-close-popup
          icon="close"
          flat
        >
          <q-tooltip class="bg-white text-primary">
            Закрыть
          </q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-card-section>
        <form
          @submit.prevent="onReasonsSubmit"
        >
          <q-list dense>
            <q-item
              v-for="item in availableRejectReasons"
              :key="item.id"
              tag="label"
            >
              <q-item-section avatar>
                <q-checkbox
                  v-model="checkedReasons"
                  :val="item.id"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.text }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-checkbox
                  v-model="otherReasonIsChecked"
                  val="13"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-input
                    ref="otherReasonInput"
                    v-model="otherReasonComment"
                    dense
                    placeholder="Другое"
                    bottom-slots
                    :error="otherReasonInputError"
                    @focus="otherReasonIsChecked = true"
                  >
                    <template #error>
                      Поле не может быть пустым
                    </template>
                  </q-input>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="row justify-end">
            <q-btn
              label="Отправить"
              type="submit"
              rounded
              class="btn_normal"
              :disable="(checkedReasons.length === 0 && !otherReasonIsChecked) || otherReasonInputError"
            />
          </div>
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  getVerdictList,
  postVerdict,
  patchMedworkerInExam
} from '@/api/exams.api'
import { Role } from '@/helpers/role'


export default {
  props: ['examId', 'examData', 'userId', 'userRole', 'startTime'],
  emits: ['verdictMade'],
  data () {return {
    availableRejectReasons: [],
    checkedReasons: [],
    otherReasonComment: '',
    otherReasonIsChecked: false,
    showReasonsDialog : false,
    Role
  }},
  computed: {
    medNameWithInitials () {
      if (!this.examData || !this.examData.med_first_name || !this.examData.med_second_name) {
        return ''
      }
      let result = this.examData.med_second_name
              + ' ' + this.examData.med_first_name.charAt(0) + '.';
      if (this.examData.med_father_name) {
          result += this.examData.med_father_name.charAt(0) + '.';
      }
      return result;
    },
    parsedVerdictsList () {
      if (!this.examData.verdicts) {
        return "";
      }
      let verdicts_list = JSON.parse(this.examData.verdicts);

      if (verdicts_list.includes('Допущен')) {
        return '';
      }
      if (verdicts_list.includes('Другое')) {
        // Replace with comment
        const ind = verdicts_list.indexOf('Другое');
        verdicts_list[ind] = this.examData.verdict_comment;
      }
      return verdicts_list.join(', ');
    },
    otherReasonInputError () {
      let inputOk = this.otherReasonComment.trim().length > 0 || !this.otherReasonIsChecked
      return !inputOk;
    }
  },
  mounted() {
    console.log(this.startTime)

    if (this.userRole == Role.MedWorker) {
      this.getavailableRejectReasons()
    }
  },
  methods: {
    async getavailableRejectReasons() {
      try {
          const response = await getVerdictList();
          this.availableRejectReasons = response.data;
          this.availableRejectReasons.shift();
          this.availableRejectReasons.pop();
      } catch (error) {
        console.log(error)
      }
    },
    async onReasonsSubmit() {
        let verdicts = [];
        for (let i of this.checkedReasons)
            verdicts.push(i);
        if (this.otherReasonIsChecked || this.otherReasonComment !== '')
            verdicts.push(13);
        const verdict_time = new Date();
        const duration = Math.round((verdict_time-this.startTime)/60000);
        try {
            await postVerdict(this.examId, verdicts, this.userId, this.otherReasonComment, duration);
            await patchMedworkerInExam(this.examId, this.userId, this.userId);
            this.$emit('verdictMade')
        } catch (error) {
          console.log(error)
        }
    },
    async admit() {
      const verdict_time = new Date();
      const duration = Math.round((verdict_time-this.startTime)/60000);
        try {
            let verdicts = [ 1 ];
            await postVerdict(this.examId, verdicts, this.userId, duration);
            await patchMedworkerInExam(this.examId, this.userId, this.userId);
            // this.$router.push('/new_exams');
            this.$emit('verdictMade')
        } catch (error) {
          console.log(error)
        }
    },
  }
}
</script>

<template>
  <div 
    class="q-pa-lg q-ml-xl"
    style="max-width: 600px"
  >
    <div 
      class="q-mb-lg"
      style="font-weight: 700; font-size: 16px;"
    >
      Согласие на СМС-информирование
    </div>
    <q-form @submit="submitForm">
      <q-input 
        v-model="person.second_name" 
        label="Фамилия *" 
        lazy-rules 
        :rules="[
          (val) => (val && val.length > 0) || 'Пожалуйста, заполните это поле' ]" 
      />
      <q-input 
        v-model="person.first_name" 
        label="Имя *" 
        lazy-rules 
        :rules="[
          (val) => (val && val.length > 0) || 'Пожалуйста, заполните это поле' ]" 
      />
      <q-input 
        v-model="person.father_name" 
        label="Отчество (при наличии)" 
        lazy-rules 
      />
      <q-select 
        v-model="person.organization_id" 
        :options="organizations" 
        label="Организация *"
        lazy-rules 
        :rules="[(val) => val || 'Пожалуйста, выберите организацию из списка']" 
        style="margin-top: 24px" 
      />
      <q-input 
        v-model="person.tel" 
        type="tel" 
        label="Номер телефона *" 
        lazy-rules
        mask="+7 (###) ###-##-##" 
        fill-mask 
        :rules="[
          (val) => (/^(\+7)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/).test(val) || 'Пожалуйста, заполните это поле']" 
      />
      <q-checkbox 
        v-model="agreement" 
        :disable="code_sent"
        label="Я соглашаюсь на обработку персональных данных и получение смс-уведомлений по этому номеру" 
      />
      <q-btn 
        v-if="!code_sent"
        class="q-mt-lg"
        :disable="agreement ? false : true" 
        color="dark" 
        type="submit"
      >
        Отправить код подтверждения
      </q-btn>

      <div v-if="code_sent">
        <div 
          v-if="!dialog_state && !code_approving"
          class="q-gutter-lg q-mt-lg"
        >
          <q-btn 
            :disable="JSON.stringify(person) === JSON.stringify(person_last_state)"
            class="q-mt-lg"
            color="dark"
            type="submit"
          >
            Сохранить изменения
          </q-btn>
          <q-btn 
            class="q-mt-lg"
            @click="cancelChanges"
          >
            Отменить
          </q-btn>
        </div>
        <div v-if="code_sent">
          <submit-number-dialog 
            v-if="dialog_state"
            :tel="person.tel"
            :approving="code_approving"
            :timer="timer"
            @close="closePopupDialog"
            @submit="submitForm"
            @approve-code="approveCode"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>
<script>
import { ref } from "vue";
import { Notify } from 'quasar';
import { getAllOrganizations } from "@/api/organizations.api.js";
import SubmitNumberDialog from "../Sms/SubmitNumberDialog.vue";
import {
  postPhoneNumber,
  getCheckCodeStatus,
  postUser,
} from "@/api/sms.api.js";

export default {
  components: {
    SubmitNumberDialog
  },
  data() {
    return {
      dialog_state: ref(false),
      person: {
        second_name: "",
        first_name: "",
        father_name: "",
        organization_id: "",
        tel: "",
      },
      person_last_state: {
        second_name: "",
        first_name: "",
        father_name: "",
        organization_id: "",
        tel: "",
      },
      timer: {
        minutes: "00",
        seconds: "20",
        interval: 0,
      },
      tel_cleared: '',
      code_approving: ref(false),
      agreement: ref(false),
      code_sent: ref(false),
      organizations: [],
    };
  },
  mounted() {
    this.getOrganizations();
  },
  beforeUnmount() {
    clearInterval(this.timer.interval)
  },
  methods: {
    startTimer(duration) {
      var timer = duration
      this.timer.interval = setInterval(() => {
        this.timer.seconds = parseInt(timer % 60, 10)
        this.timer.seconds = this.timer.seconds < 10 ? "0" + this.timer.seconds : this.timer.seconds
        if (--timer < 0) {
          timer = 0
          clearInterval(this.timer.interval)
        }
      }, 1000)
    },

    runTimer() {
      clearInterval(this.timer.interval)
      this.timer = { ...this.timer, seconds: "20" };
      this.startTimer(parseInt(this.timer.seconds));
    },

    closePopupDialog() {
      this.dialog_state = false;
      this.person_last_state = Object.assign({}, this.person);
    },

    cancelChanges() {
      this.dialog_state = true;
      this.person = Object.assign({}, this.person_last_state);
      this.runTimer();
    },

    async submitForm() {
      this.runTimer();
      this.code_sent = true;
      if (this.person.tel !== this.person_last_state.tel) {
        this.tel_cleared = this.person.tel.replace(/[+() -]/g, '');
        // try {
        //   var response = await postPhoneNumber(this.tel_cleared);
        //   console.log(response);
        //   Notify.create({
        //     color: 'green-5',
        //     textColor: 'white',
        //     message: 'Код отправлен на Ваш телефон!'
        //   });
        // } catch (err) {
        //   console.log(err);
        //   Notify.create({
        //     color: 'red-5',
        //     textColor: 'white',
        //     message: 'Ошибка отправки кода!'
        //   });
        // }
      }
      this.dialog_state = true;
    },
    
    async approveCode(code) {
      this.code_approving = true;
      try {
        var response = await getCheckCodeStatus(this.tel_cleared, code);
        console.log(response);
        if (response.status === 201) {
          this.sendAllData();
        }
      } catch (err) {
        console.log(err);
        Notify.create({
            color: 'red-5',
            textColor: 'white',
            message: 'Ошибка! Проверьте правильность введенного Вами кода.'
          });
          this.code_approving = false;
          this.runTimer();
      }
      // console.log(this.tel_cleared, code);
    },

    async sendAllData() {
      try {
        var response = await postUser(this.person.second_name, this.person.first_name, this.person.father_name, this.person.organization_id.value, this.tel_cleared);
        console.log(response);
        Notify.create({
          color: 'green-5',
          textColor: 'white',
          message: 'Ваши данные были успешно сохранены!'
        })
        this.dialog_state = false;
      } catch (err) {
        console.log(err);
        Notify.create({
          color: 'red-5',
          textColor: 'white',
          message: 'Ошибка! Проверьте правильность введенного Вами кода.'
        });
        this.code_approving = false;
        this.runTimer();
      }
      // console.log(this.person.second_name, this.person.first_name, this.person.father_name, this.person.organization_id.value, this.tel_cleared);
    },

    async getOrganizations() {
      try {
        var response = await getAllOrganizations();
        this.organizations = response.data.map((obj) => {
          return { value: obj.id, label: obj.name };
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
.q-btn {
  text-transform: none;
}
</style>
<template>
  <div class="q-pa-lg q-ml-xl" style="max-width: 600px">
    <div class="q-mb-lg" style="font-weight: 700; font-size: 16px;">
      Согласие на СМС-информирование
    </div>
    <q-form @submit="submitForm">
      <q-input 
        v-model="person.second_name" 
        :disable="change_state" 
        label="Фамилия *" 
        lazy-rules 
        :rules="[
          (val) => (val && val.length > 0) || 'Пожалуйста, заполните это поле' ]" 
      />
      <q-input 
        v-model="person.first_name" 
        :disable="change_state" 
        label="Имя *" 
        lazy-rules 
        :rules="[
          (val) => (val && val.length > 0) || 'Пожалуйста, заполните это поле' ]" 
      />
      <q-input 
        v-model="person.father_name" 
        :disable="change_state" 
        label="Отчество (при наличии)" 
        lazy-rules 
      />
      <q-select 
        v-model="person.organization_id" 
        :disable="change_state" 
        :options="organizations" 
        label="Организация *"
        lazy-rules 
        :rules="[(val) => val || 'Пожалуйста, выберите организацию из списка']" 
        style="margin-top: 24px" 
      />
      <q-input 
        v-model="person.tel" 
        :disable="change_state" 
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
      <!-- <div class="row q-gutter-sm">
        <q-input outlined style="width: 50px" mask="#"></q-input>
        <q-input outlined style="width: 50px" mask="#"></q-input>
        <q-input outlined style="width: 50px" mask="#"></q-input>
        <q-input outlined style="width: 50px" mask="#"></q-input>
      </div> -->
      <q-btn v-if="!code_sent" class="q-mt-lg" :disable="agreement ? false : true" color="dark" type="submit">
        Отправить код подтверждения
      </q-btn>

      <div v-if="code_sent">
        <div v-if="!change_state" class="q-gutter-md">
          <q-btn class="q-mt-lg" color="dark" type="submit">
            Сохранить изменения
          </q-btn>
          <q-btn class="q-mt-lg" @click="cancelChanges">
            Отменить
          </q-btn>
        </div>
        <q-btn v-if="change_state" class="q-mt-lg" color="dark" @click="openForm">
          Изменить данные
        </q-btn>
        <div v-if="code_sent && change_state">
          <q-input v-model="code" mask="####"></q-input>
          <q-btn @click="approveCode">Отправить код</q-btn>
          <div class="row q-mt-md q-gutter-sm">
            <q-btn :disable="timer.seconds !== '00'" class="q-mt-md" color="dark" @click="resendCode">
              Отправить код еще раз
            </q-btn>
            <div class="q-pt-md" style="font-weight: 600">
              {{ timer.minutes }}:{{ timer.seconds }}
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script>
import { ref } from "vue";
import { Notify } from 'quasar';
import { getAllOrganizations } from "@/api/organizations.api.js";
import {
  postPhoneNumber,
  getCheckCodeStatus,
  postUser,
} from "@/api/sms.api.js";

export default {
  data() {
    return {
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
      code: ref(''),
      agreement: ref(false),
      code_sent: ref(false),
      change_state: ref(false),
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
    async submitForm() {
      clearInterval(this.timer.interval)
      this.code_sent = true;
      this.change_state = true;
      this.timer = { ...this.timer, seconds: "20" };
      this.startTimer(parseInt(this.timer.seconds));
      if (this.person.tel !== this.person_last_state.tel) {
        this.tel_cleared = this.person.tel.replace(/[+() -]/g, '');
        console.log(this.tel_cleared)
        try {
          var response = await postPhoneNumber(this.tel_cleared);
          console.log(response);
          console.log(response.status);
          Notify.create({
            color: 'green-5',
            textColor: 'white',
            message: 'Код отправлен!'
          });
        } catch (err) {
          console.log(err.response.status);
          Notify.create({
            color: 'red-5',
            textColor: 'white',
            message: 'Ошибка!'
          });
        }
      }
    },

    async approveCode() {
      try {
        var response = await getCheckCodeStatus(this.tel_cleared, this.code);
        console.log(response);
        console.log(response.status);
        if (response.status === 201) {
          this.sendAllData();
        }
      } catch (err) {
        console.log(err);
      }
      console.log(this.tel_cleared, this.code);
    },

    async sendAllData() {
      try {
        var response = await postUser(this.person.second_name, this.person.first_name, this.person.father_name, this.person.organization_id.value, this.tel_cleared);
        console.log(response);
        Notify.create({
          color: 'green-5',
          textColor: 'white',
          message: 'Код успешно принят!'
        })
      } catch (err) {
        console.log(err);
        Notify.create({
          color: 'red-5',
          textColor: 'white',
          message: 'Ошибка!'
        });
      }
      console.log(this.person.second_name, this.person.first_name, this.person.father_name, this.person.organization_id.value, this.tel_cleared);
    },

    cancelChanges() {
      this.change_state = true;
      this.person = Object.assign({}, this.person_last_state);
    },

    openForm() {
      this.change_state = false;
      this.person_last_state = Object.assign({}, this.person);
    },

    saveChanges() {
      this.change_state = true;
    },

    resendCode() {
      this.submitForm();
    },

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

    async getOrganizations() {
      try {
        var response = await getAllOrganizations();
        this.organizations = response.data.map((obj, index) => {
          return { value: obj.id, label: obj.name };
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style>
.q-btn {
  text-transform: none;
}
</style>

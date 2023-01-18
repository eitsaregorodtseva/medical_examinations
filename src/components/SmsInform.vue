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
        <!-- <q-btn 
          v-if="change_state"
          class="q-mt-lg"
          color="dark" 
          @click="openForm"
        >
          Изменить данные
        </q-btn> -->
        <div v-if="code_sent">
          <!-- <submit-number-dialog 
            :dialog_state="dialog_state"
            :tel="person.tel"
            :timer="timer"
            :code_approving="code_approving"
            :close-popup-dialog="closePopupDialog"
          /> -->
          <q-dialog 
            v-model="dialog_state" 
            persistent
          >
            <q-card class="q-px-md">
              <q-card-section class="row" />

              <q-card-section class="column">
                <div class="column items-center text-center">
                  <div 
                    class="text-h6 q-mb-md" 
                    style="font-weight: 600"
                  >
                    Подтверждение номера телефона
                  </div>
                  <div v-if="!code_approving">
                    <div>Введите 4-значный код, который мы отправили</div><div> на номер {{ person.tel }}</div>
                  
                    <div 
                      v-if="timer.seconds !== '00'"
                      class="q-my-md"
                      style="font-weight: 600"
                    >
                      Повторная отправка доступна через {{ timer.minutes }}:{{ timer.seconds }}
                    </div>
                
                    <div class="row q-gutter-sm q-mt-md justify-center">
                      <q-input 
                        ref="first_field"
                        v-model="first_number"
                        input-class="text-center"
                        dense
                        outlined 
                        :autofocus="true"
                        style="width: 40px" 
                        mask="#" 
                        @update:model-value="focusNextInput" 
                      />
                      <q-input 
                        ref="second_field"
                        v-model="second_number"
                        input-class="text-center"
                        dense 
                        outlined 
                        style="width: 40px" 
                        mask="#" 
                        @update:model-value="focusNextInput"
                      />
                      <q-input 
                        ref="third_field"
                        v-model="third_number"
                        input-class="text-center"
                        dense
                        outlined
                        style="width: 40px" 
                        mask="#"
                        @update:model-value="focusNextInput"
                      />
                      <q-input 
                        ref="forth_field"
                        v-model="forth_number"
                        input-class="text-center"
                        dense
                        outlined
                        style="width: 40px" 
                        mask="#"
                        @update:model-value="focusNextInput"
                      />
                    </div>
                  
                    <div class="q-mt-md col-6"> 
                      <q-btn
                        v-if="timer.seconds === '00'"
                        style="float: right"
                        flat
                        icon="refresh"
                        @click="submitForm"
                      >
                        Отправить снова
                      </q-btn>
                    </div>
          
                    <q-btn 
                      class="q-mt-md" 
                      flat 
                      @click="closePopupDialog"
                    >
                      Изменить данные
                    </q-btn>
                  </div>
                  <div v-else>
                    <q-spinner
                      class="q-mb-md"
                      color="dark"
                      size="3em"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script>
import { ref } from "vue";
import { Notify } from 'quasar';
import { getAllOrganizations } from "@/api/organizations.api.js";
import SubmitNumberDialog from "./SubmitNumberDialog.vue";
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
      dialog_state: ref(true),

      first_number: ref(""),
      second_number: ref(""),
      third_number: ref(""), 
      forth_number: ref(""),

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
      code: '',
      // code: ref(''),
      // agreement: ref(true),
      // code_sent: ref(true),
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
    // moveLeft() {
    //   console.log(this.$refs)
    //   this.$refs.third_field.$el.focus()
    // },

    focusNextInput() {
      if ((/^[0-9]$/).test(this.first_number)) {
        this.$refs.second_field.$el.focus()
      }
      if ((/^[0-9]$/).test(this.first_number) && (/^[0-9]$/).test(this.second_number)) {
        this.$refs.third_field.$el.focus()
      }
      if ((/^[0-9]$/).test(this.first_number) && (/^[0-9]$/).test(this.second_number) && (/^[0-9]$/).test(this.third_number)) {
        this.$refs.forth_field.$el.focus()
      }
      if ((/^[0-9]$/).test(this.first_number) && (/^[0-9]$/).test(this.second_number) && (/^[0-9]$/).test(this.third_number) && (/^[0-9]$/).test(this.forth_number)) {
        this.code = this.first_number + this.second_number + this.third_number + this.forth_number;
        this.approveCode();
      }
    },

    async submitForm() {
      clearInterval(this.timer.interval)
      this.code_sent = true;
      this.first_number = '';
      this.second_number = '';
      this.third_number = '';
      this.forth_number = '';
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
            message: 'Код отправлен на Ваш телефон!'
          });
        } catch (err) {
          console.log(err.response.status);
          Notify.create({
            color: 'red-5',
            textColor: 'white',
            message: 'Ошибка отправки кода!'
          });
        }
      }
      this.dialog_state = true;
    },

    closePopupDialog() {
      this.dialog_state = false;
      this.person_last_state = Object.assign({}, this.person);
    },

    async approveCode() {
      this.code_approving = true;
      try {
        var response = await getCheckCodeStatus(this.tel_cleared, this.code);
        console.log(response);
        console.log(response.status);
        if (response.status === 201) {
          this.sendAllData();
        }
        // else {
        //   Notify.create({
        //     color: 'red-5',
        //     textColor: 'white',
        //     message: 'Ошибка! Проверьте правильность введенного Вами кода.'
        //   });
        //   this.first_number = '';
        //   this.second_number = '';
        //   this.third_number = '';
        //   this.forth_number = '';
        //   this.code_approving = false;
        //   clearInterval(this.timer.interval)
        //   this.timer = { ...this.timer, seconds: "20" };
        //   this.startTimer(parseInt(this.timer.seconds));
          
        //   this.$refs.first_field.$el.focus()
          
        // }
      } catch (err) {
        console.log(err);
        Notify.create({
            color: 'red-5',
            textColor: 'white',
            message: 'Ошибка! Проверьте правильность введенного Вами кода.'
          });
          this.first_number = '';
          this.second_number = '';
          this.third_number = '';
          this.forth_number = '';
          this.code_approving = false;
          clearInterval(this.timer.interval)
          this.timer = { ...this.timer, seconds: "20" };
          this.startTimer(parseInt(this.timer.seconds));
          
          // this.$refs.first_field.$el.focus()
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
      }
      console.log(this.person.second_name, this.person.first_name, this.person.father_name, this.person.organization_id.value, this.tel_cleared);
    },

    cancelChanges() {
      this.dialog_state = true;
      this.person = Object.assign({}, this.person_last_state);
      this.first_number = '';
      this.second_number = '';
      this.third_number = '';
      this.forth_number = '';
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
.q-btn >>> .q-icon {
  margin-right: 10px;
}
.q-btn:disabled {
  background: transparent;
}
</style>

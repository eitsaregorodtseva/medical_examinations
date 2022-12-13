<template>
  <div class="q-pa-lg" style="max-width: 500px">
    <q-form @submit="submitForm">
      <q-input
        v-model="person.last_name"
        :disable="change_state"
        label="Фамилия *"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Пожалуйста, заполните это поле',
        ]"
      />
      <q-input
        v-model="person.first_name"
        :disable="change_state"
        label="Имя *"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Пожалуйста, заполните это поле',
        ]"
      />
      <q-input
        v-model="person.patronymic"
        :disable="change_state"
        label="Отчество *"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Пожалуйста, заполните это поле',
        ]"
      />
      <q-select
        v-model="person.organization"
        :disable="change_state"
        :options="organizations"
        label="Организация *"
        lazy-rules
        :rules="[(val) => val || 'Пожалуйста, выберите организацию из списка']"
      />
      <q-input
        v-model="person.phone_number"
        :disable="change_state"
        type="tel"
        label="Номер телефона *"
        lazy-rules
        mask="+7(###)###-##-##"
        fill-mask
        :rules="[
          (val) => (val.length === 16) || 'Пожалуйста, заполните это поле',
        ]"
      />
      <q-checkbox
        v-model="agreement"
        :disable="change_state"
        label="Я соглашаюсь на обработку персональных данных и получение смс-уведомлений по этому номеру»"
      />
      <q-btn 
        v-if="!code_sent" 
        :disable="agreement ? false : true" 
        color="dark"
        type="submit"
      >
        Отправить код подтверждения
      </q-btn>
      <div v-if="code_sent">
        <q-btn v-if="!change_state" @click="saveChanges">Сохранить изменения</q-btn>
        <q-btn v-if="change_state" @click="openForm">Изменить данные</q-btn>
        <q-input></q-input>
        <q-btn>Отправить код еще раз</q-btn>
      </div>
    </q-form>
  </div>
</template>
<script>
import { ref } from "vue";
import { getAllOrganizations } from "@/api/organizations.api.js";

export default {
  data() {
    return {
      person: {
        last_name: "",
        first_name: "",
        patronymic: "",
        organization: "",
        phone_number: "",
      },
      agreement: ref(false),
      code_sent: ref(false),
      change_state: ref(false),
      organizations: [],
    };
  },
  mounted() {
    this.populateDataFromStorage();
    this.getOrganizations();
  },
  methods: {
    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
    },

    submitForm() {
      this.code_sent = true;
      this.change_state = true;
      console.log(this.person)
    },

    openForm() {
        this.change_state = false;
    },

    saveChanges() {
        this.change_state = true;
    },

    async getOrganizations() {
      try {
        var response = await getAllOrganizations(this.user_id);
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

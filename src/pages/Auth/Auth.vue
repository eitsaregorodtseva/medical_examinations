<template>
  <app-centered-box :is-error="isError">
    <q-form
      class="q-pa-md fit column items-center"
      @submit.prevent="auth"
    >
      <div
        class="text-h4 text-bold col-2"
        :class="isError ? 'txt_error' : 'txt_normal'"
      >
        Авторизация
      </div>
      <div
        v-if="isError"
        id="mes_er"
        class="input_error col-auto"
      >
        Неверный логин или пароль
      </div>
      <div class="col-grow self-stretch column justify-center q-gutter-lg">
        <q-input
          v-model.trim="login"
          outlined
          bg-color="white"
          label="Логин"
        />
        <q-input
          v-model="password"
          outlined
          bg-color="white"
          :type="showPassword ? 'text' : 'password'"
          label="Пароль"
        >
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </div>
      <div class="col-auto self-center">
        <q-btn
          unelevated
          rounded
          text-color="white"
          :class="isError ? 'btn_error' : 'btn_normal'"
          type="submit"
        >
          Войти
        </q-btn>
      </div>
    </q-form>
  </app-centered-box>
</template>

<script>
import { auth } from '@/api/users.api'
import { Role } from '@/constants/role'
import AppCenteredBox from '@/components/AppCenteredBox/AppCenteredBox'

export default {
    name: 'Auth',
    components: {
      AppCenteredBox
    },
    data: () => ({
        login: '',
        password: '',
        returnUrl: '',
        isError: false,
        showPassword: false
    }),
    created () {
        this.returnUrl = this.$route.query.returnUrl
    },
    methods: {
        async auth() {
            const authData = {
                login: this.login,
                password: this.password
            };

            try {
                const response = await auth(authData);
                this.isError = false;
                sessionStorage.setItem('user_id', response.data.id);
                sessionStorage.setItem('user_role', response.data.role);
                sessionStorage.setItem('user_organization_id', response.data.organization_id);
                sessionStorage.setItem('user_el_signature', response.data.el_signature);
                if (response.data.role === Role.MedWorker && response.data.id !== '3') {
                  this.$router.push('/dig_sig')
                } else {
                  sessionStorage.setItem('full_auth', true);
                  this.$router.push(this.returnUrl || '/')
                }

            } catch (error) {
                console.log(error);
                this.isError = true;
                this.login = '';
                this.password = '';
            }
        }
    }
}
</script>

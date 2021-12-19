<template>
  <div
    id="auth_rect"
    class="container position-absolute top-50 start-50 translate-middle"
    :class="isError ? 'app_error' : 'app_normal'"
  >
    <form
      class="form-horizontal"
      @submit.prevent="auth"
    >
      <div class="form-group">
        <div class="row mt-3 d-flex justify-content-center">
          <div
            id="text_au"
            :class="isError ? 'txt_error' : 'txt_normal'"
          >
            Авторизация
          </div>
        </div>
        <div class="row mt-3 d-flex justify-content-center">
          <div
            v-if="isError"
            id="mes_er"
            class="input_error"
          >
            Неверный логин или пароль
          </div>
        </div>
        <div class="row mt-3 d-flex justify-content-center">
          <input
            v-model.trim="login"
            class="input"
            :class="isError ? 'input_error' : 'input_normal'"
            placeholder="Логин"
          >
        </div>
        <div class="row mt-3 d-flex justify-content-center">
          <input
            v-model="password"
            class="input"
            :class="isError ? 'input_error' : 'input_normal'"
            type="password"
            placeholder="Пароль"
          >
        </div>
        <div class="row mt-3 d-flex justify-content-center">
          <button
            id="btn"
            :class="isError ? 'btn_error' : 'btn_normal'"
            type="submit"
          >
            Войти
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { auth } from '@/api/users.api'
import { Role } from '@/helpers/role'

export default {
    name: 'Auth',
    data: () => ({
        login: '',
        password: '',
        returnUrl: '',
        isError: false
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
                if (response.data.role === Role.MedWorker) {
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

<style scoped>

button {
    border-radius: 50px;
}

#auth_rect {
    width: 550px;
    height: 400px;
    display: block;
}

.input {
    border: none;
    width: 80%;
    height: 80%;
}

.row {
    height: 60px;
}

#btn {
    width: 170px;
    height: 40px;
}

#text_au {
    text-align: center;
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    letter-spacing: -0.017em;
    padding-top: 3%;
}

#mes_er {
    text-align: center;
    width: 100%;
    font-weight: bold;
}


</style>

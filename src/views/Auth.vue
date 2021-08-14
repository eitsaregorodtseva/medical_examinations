<template>
    <div id='auth_rect' class='container position-absolute top-50 start-50 translate-middle' :class="isError ? 'app_error' : 'app_normal'"> 
        <form class='form-horizontal' @submit.prevent='auth'>
            <div class='form-group'>
                <div class='row mt-3 d-flex justify-content-center'>
                    <div id='text_au' :class="isError ? 'txt_error' : 'txt_normal'">Авторизация</div>
                </div>
                <div class='row mt-3 d-flex justify-content-center'>
                    <div id='mes_er' v-if=isError class='input_error'>Неверный логин или пароль</div>
                </div>
                <div class='row mt-3 d-flex justify-content-center'>
                    <input class='input' :class="isError ? 'input_error' : 'input_normal'" v-model.trim='login' placeholder="Логин"  @input="isError=false"/>
                </div>
                <div class='row mt-3 d-flex justify-content-center'>
                    <input class='input' :class="isError ? 'input_error' : 'input_normal'" type="password" v-model='password' placeholder="Пароль" @input="isError=false"/>
                </div>
                <div class='row mt-3 d-flex justify-content-center'>
                    <button id='btn' :class="isError ? 'btn_error' : 'btn_normal'" type='submit'>Войти</button>
                </div>
            </div>
        </form>    
    </div>
</template>

<script>
export default {
    name: 'login',
    data: () => ({
        login: '',
        password: '',
        isError: false
    }),
    methods: {
        auth() {
            const user = {
                login: 'login',
                password: 'password'
            };
            const authData = {
                login: this.login,
                password: this.password
            };

            if (user.login === authData.login && user.password === authData.password) {
                this.isError = false
                this.$router.push('/dig_sig');
            }
            else {
                this.isError = true
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
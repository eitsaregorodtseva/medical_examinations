<template>
    <div id='auth_rect' :class="isError ? 'app_error' : 'app_normal'"> 
        <form @submit.prevent='auth'>
            <div id='text_au' class='txt_normal'>Авторизация</div>
            <div id='mes_er' v-if=isError class='input_error'>Неверный логин или пароль</div>
            <input id='log' class='input' :class="isError ? 'input_error' : 'input_normal'" v-model.trim='login' placeholder="Логин"  @input="isError=false"/>
            <input id='pas' class='input' :class="isError ? 'input_error' : 'input_normal'" type="password" v-model='password' placeholder="Пароль" @input="isError=false"/>
            <button id='btn' :class="isError ? 'btn_error' : 'btn_normal'" type='submit'>Войти</button>
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

#auth_rect {
    position: absolute;
    width: 550px;
    height: 400px;
    display: block;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -225px;
}

#log {
    top: 35%;
}

#pas {  
    top: 55%;
}

#btn {
    position: absolute;
    width: 25%;
    height: 10%;
    top: 80%;
    left: 37.5%;
}

#text_au {
    position: absolute;
    text-align: center;
    top: 10%;
    width: 100%;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: -0.017em;
}

#mes_er {
    position: absolute;
    text-align: center;
    width: 100%;
    top: 27%;
    font-weight: 600;
}


</style>
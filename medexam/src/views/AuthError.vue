<template>
    <form @submit.prevent='auth'>
        <div id='text_au' class='txt_error'>Авторизация</div>
        <div id='mes_er' class='input_error'>Неверный логин или пароль</div>
        <input id='log' class='input input_error' v-model='login' placeholder="Логин" />
        <input id='pas' class='input input_error' type="password" v-model='password' placeholder="Пароль" />
        <button id='btn' class='bttn_error' type='submit'>Войти</button>
    </form>
</template>

<script>
export default {
    name: 'login',
    data: () => ({
        login: '',
        password: ''
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

            if (user.login === authData.login && user.password === authData.password)
                this.$router.push('/dig_sig');
            else
                this.$router.push('/auth_error');
        }
    }
}
</script>

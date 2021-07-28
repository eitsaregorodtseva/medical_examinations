const app = Vue.createApp({
    data() {
        return {
            login: '',
            password: '',
        }
    },

    methods: {
        auth() {
            let data = {
                login: this.login,
                password: this.password,
            }
        },
        verf() {
            
        },
    }
});

const vm = app.mount('#app');
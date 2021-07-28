const app = Vue.createApp({
    data() {
        return {
            login: '',
            password: '',
        }
    },

    methods: {
        auth: function() {
            let data = {
                login: this.login,
                password: this.password,
            }
        },
    }
});

const vm = app.mount('#app');
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

        overBttn: function() {
            let btn = document.getElementById('btn');
            btn.style.background = 'linear-gradient(to left, #3C61E9, #1942DB)';
        },

        outBttn: function() {
            let btn = document.getElementById('btn');
            btn.style.background = 'linear-gradient(to left, #5F7EF1, #3C61E9)';
        }
    }
});

const vm = app.mount('#app');
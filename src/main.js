import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Popper from "vue3-popper";
import axios from 'axios'
import moment from 'moment'
import Notifications from '@kyvg/vue3-notification'

//import 'materialize-css/dist/js/materialize.min'

const app = createApp(App).use(store).use(router).use(Notifications).component('Popper', Popper)
app.config.globalProperties.$axios=axios
moment.locale('ru')
app.config.globalProperties.$moment=moment
app.mount('#app')

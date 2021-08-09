import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Popper from "vue3-popper";
//import 'materialize-css/dist/js/materialize.min'

createApp(App).use(store).use(router).component('Popper', Popper).mount('#app')

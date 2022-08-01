import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Popper from "vue3-popper";
import axios from 'axios'
import moment from 'moment'
import Notifications from '@kyvg/vue3-notification'
import ECharts from 'vue-echarts'
import { use } from "echarts/core"

//import 'materialize-css/dist/js/materialize.min'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

import './styles/style.sass'

import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    LineChart,
    PieChart
} from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
} from 'echarts/components'

use([
    CanvasRenderer,
    LineChart,
    PieChart,
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent
])

const app = createApp(App).use(Quasar, quasarUserOptions).use(store).use(router).use(Notifications).component('Popper', Popper).component('v-chart', ECharts)
app.config.globalProperties.$axios=axios
moment.locale('ru')
app.config.globalProperties.$moment=moment
app.mount('#app')

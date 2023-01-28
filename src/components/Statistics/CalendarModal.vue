<template>
  <q-dialog 
    v-model="dialog"
    persistent
  >
    <q-card class="q-py-md q-px-lg">
      <q-card-section class="row">
        <div class="text-h6">
          Выбор даты
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="$emit('handle-toggle')"
        />
      </q-card-section>
      <q-card-section>
        <q-btn-toggle
          v-model="period"
          toggle-color="dark"
          :options="[
            { label: 'День', value: 'day' },
            { label: 'Период', value: 'period' },
          ]"
          @click="$emit('change-period', period)"
        />
      </q-card-section>
      <q-card-section>
        <q-date
          v-model="current_date"
          :locale="locale"
          color="dark"
          :range="range"
          :options="date => date >= calendar.from && date <= calendar.to"
        />
        <!-- <q-calendar-month /> -->
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="dark"
          @click="$emit('update-table', current_date)"
        >
          Показать
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import moment from "moment";
import { ref } from 'vue';
// import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.esm.js'

export default {
  components: {
    // QCalendarMonth
  },
  props: { 
    dialogState: {
      type: Boolean,
      default: true
    },
    date: {
      type: [String, Object],
      default: ref(moment().format("YYYY/MM/DD")) || {from: ref(moment().subtract(7, "days").format("YYYY/MM/DD")), to: ref(moment().format("YYYY/MM/DD"))}
    },
    periodState: {
      type: String,
      default: "day"
    },
    rangeState: {
      type: Boolean,
      default: false  
    },
    current_data: String,
    first_data: String
  },
  emits: ['change-period', 'update-table', 'handle-toggle'],
  data() {
    return {
      period: "",
      range: ref(),
      current_date: "",
      dialog: true,
      calendar: {
        from: moment().format("YYYY/MM/DD"),
        to: moment().format("YYYY/MM/DD")
      },
      locale: {
        days: 'Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье'.split('_'),
        daysShort: 'Пн_Вт_Ср_Чт_Пт_Сб_Вс'.split('_'),
        months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split('_'),
        monthsShort: 'Янв_Фев_Мар_Апр_Май_Июнь_Июль_Авг_Сен_Окт_Ноя_Дек'.split('_'),
    }
  }
},
mounted() {
    this.period = this.periodState;
    this.current_date = this.date;
    this.range = this.periodState === "day" ? false : true;
    this.calendar = { from: moment(new Date(this.first_data)).format("YYYY/MM/DD"), to: moment(new Date(this.current_data)).format("YYYY/MM/DD") };
    console.log(this.calendar)
    console.log(this.first_data)
    console.log(this.current_data)
  },
  updated() {
    // this.period = this.periodState;
    this.current_date = this.date;
    // this.range = this.rangeState === "day" ? true : false;
    // this.range = this.rangeState;
    this.range = this.periodState === "day" ? false : true;
    this.calendar = { from: moment(new Date(this.first_data)).format("YYYY/MM/DD"), to: moment(new Date(this.current_data)).format("YYYY/MM/DD") };
    console.log(this.calendar)
    console.log(this.current_date)
    console.log(this.range)
    console.log(this.period)
  }
}
</script>
<style  src="@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.min.css">
</style>

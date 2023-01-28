<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="value => $emit('update:modelValue', value)"
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
          @click="$emit('update:modelValue', false)"
        />
      </q-card-section>
      <q-card-section>
        <q-btn-toggle
          v-model="period_toggle_state"
          toggle-color="dark"
          no-caps
          :options="[
            { label: 'День', value: 'day' },
            { label: 'Период', value: 'period' },
          ]"
          @click="handleChangePeriod"
        />
      </q-card-section>
      <q-card-section>
        <q-date
          v-model="current_date"
          color="dark"
          :locale="locale"
          :range="range_state"
          :options="date => date >= active_period.from && date <= active_period.to"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="dark"
          no-caps
          @click="$emit('updateTable', current_date)"
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

export default {
  props: {
    todayDate: {
      type: [String, Object],
      default: ref(moment().format("YYYY/MM/DD")) || { from: ref(moment().subtract(7, "days").format("YYYY/MM/DD")), to: ref(moment().format("YYYY/MM/DD")) }
    },
    firstDate: {
      type: String,
      default: ref(moment().format("YYYY/MM/DD"))
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    updateTable: () => { return true },
    'update:modelValue': () => { return true }
  },
  data() {
    return {
      period_toggle_state: ref('day'),
      range_state: ref(false),


      current_date: ref(),
      active_period: {
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
  updated() {
    this.period_toggle_state = 'day';
    this.current_date = moment(new Date(this.todayDate)).format("YYYY/MM/DD");
    this.active_period = { 
      from: moment(new Date(this.firstDate)).format("YYYY/MM/DD"), 
      to: moment(new Date(this.todayDate)).format("YYYY/MM/DD") 
    };
    this.handleChangePeriod();
  },
  methods: {
    handleChangePeriod() {
      this.range_state = this.period_toggle_state === "day" ? false : true;
      this.current_date =
        this.period_toggle_state == "day"
          ? moment().format("YYYY/MM/DD")
          : {
            from: moment().subtract(7, "days").format("YYYY/MM/DD"),
            to: moment().format("YYYY/MM/DD"),
          };
    },
  }
}
</script>
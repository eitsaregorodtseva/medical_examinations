<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <q-card 
      class="q-py-md q-px-lg"
      style="width: 800px;"
    >
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
      <!-- <q-card-section class="text-center">
        <div>Выберите один день или интервал, выделив дату начала и дату конца.</div>
      </q-card-section> -->
      <q-card-section>
        <div v-if="calendarState === 'month'">
          <month-calendar 
            :active-period="active_period"
            @get-interval="getInterval"
          />
        </div>
        <div v-else>
          <year-calendar 
            :active-period="active_period"
            @get-interval="getInterval"
          />
        </div>
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
import MonthCalendar from "./MonthCalendar.vue";
import YearCalendar from "./YearCalendar.vue";

export default {
  components: {
    MonthCalendar,
    YearCalendar
  },
  props: {
    todayDate: {
      type: String,
      default: ref(moment().format("YYYY/MM/DD")) 
    },
    firstDate: {
      type: String,
      default: ref(moment().format("YYYY/MM/DD"))
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    calendarState: {
      type: String,
      default: 'month'
    },
  },
  emits: {
    updateTable: () => { return true },
    'update:modelValue': () => { return true }
  },
  data() {
    return {
      range_state: ref(false),
      current_date: ref(),
      active_period: {
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD")
      }
    }
  },
  updated() {
    this.active_period = { 
      from: moment(new Date(this.firstDate)).format("YYYY-MM-DD"), 
      to: moment(new Date(this.todayDate)).add(1, 'days').format("YYYY-MM-DD") 
    };
    this.handleChangePeriod();
  },
  methods: {
    handleChangePeriod() {
      this.current_date =
        this.period_toggle_state == "day"
          ? moment().format("YYYY/MM/DD")
          : {
            from: moment().subtract(7, "days").format("YYYY/MM/DD"),
            to: moment().format("YYYY/MM/DD"),
          };
    },

    getInterval(interval) {
      this.current_date = {
        from: moment(new Date(interval[0])).format("YYYY/MM/DD"), 
        to: moment(new Date(interval[1])).format("YYYY/MM/DD")
      }
    }
  }
}
</script>
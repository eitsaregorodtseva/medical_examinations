<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <q-card
      class="q-py-md q-px-lg"
      style="min-width: 300px; width: 900px;"
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
      <q-card-section>
        <div v-if="calendarState === 'month'">
          <month-calendar
            :active-period="active_period"
            :exams-count="examsCount"
            :select-all="select_all"
            @get-interval="getInterval"
          />
        </div>
        <div v-else>
          <year-calendar
            :active-period="active_period"
            :exams-count="examsCount"
            :select-all="select_all"
            @get-interval="getInterval"
          />
        </div>
      </q-card-section>
      <q-card-actions class="justify-between">
        <q-checkbox
          v-model="select_all"
          label="Весь период"
        />
        <q-btn
          color="dark"
          no-caps
          :disable="current_date && current_date.from === null && current_date.to === null"
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
import MonthCalendar from "./components/Calendars/MonthCalendar.vue";
import YearCalendar from "./components/Calendars/YearCalendar.vue";
import {
  getExamsCountByPeriod,
  getExamsCountForOrganizationByPeriod
} from "@/api/exams.api.js"
import { getMaxWorkload } from "@/api/medworkers.api";

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
    organizationId: {
      type: Number,
      default: 0
    },
    calendarType: {
      type: String,
      default: ''
    },
    filterValue: {
      type: String,
      default: ''
    }
  },
  emits: {
    updateTable: () => { return true },
    'update:modelValue': () => { return true }
  },
  data() {
    return {
      range_state: ref(false),
      select_all: ref(false),
      current_date: ref(),
      active_period: {
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD")
      },
      examsCount: [],
      user_id: this.$store.state.user.id,
    }
  },
  watch: {
    'select_all': function (select_all) {
      if (select_all) {
        this.current_date = {
          from: moment(this.active_period.from).format("YYYY/MM/DD"),
          to: moment(this.active_period.to).format("YYYY/MM/DD"),
        };
      }
      else {
        this.current_date = {
          from: null,
          to: null,
        };
      }
    },
  },
  updated() {
    this.select_all = false;
    this.active_period = {
      from: moment(new Date(this.firstDate)).format("YYYY-MM-DD"),
      to: moment(new Date(this.todayDate)).add(1, 'days').format("YYYY-MM-DD")
    };
    this.handleChangePeriod();
    if (this.organizationId !== 0) {
      this.getExamsCount();
    }
    if (this.calendarType === 'medworkers') {
      this.getExamsCount();
    }
  },
  methods: {
    handleChangePeriod() {
      this.current_date =
        this.period_toggle_state == "day"
          ? moment().format("YYYY/MM/DD")
          : {
            from: null,
            to: null,
          };
    },

    getInterval(interval) {
      this.current_date = {
        from: moment(new Date(interval[0])).format("YYYY/MM/DD"),
        to: moment(new Date(interval[1])).format("YYYY/MM/DD")
      }
    },

    async getExamsCount() {
      let date_from = moment(new Date(this.active_period.from)).add(1, 'days').format("YYYY-MM-DD");
      let date_to = moment(new Date(this.active_period.to)).subtract(1, 'days').format("YYYY-MM-DD");
      if (this.calendarType === 'exams') {
        if (this.organizationId) {
          var response;
          try {
            response = await getExamsCountForOrganizationByPeriod(
              this.user_id,
              date_from,
              date_to,
              this.organizationId,
              this.filterValue,
            );
            this.examsCount = response.data
          }
          catch (err) {
            console.log(err);
          }
        }
        else {
          try {
            response = await getExamsCountByPeriod(
              this.user_id,
              date_from,
              date_to,
              this.filterValue
            );
            this.examsCount = response.data
          }
          catch (err) {
            console.log(err);
          }
        }
      }
      else {
        try {
          response = await getMaxWorkload(
            this.user_id,
            date_from,
            date_to,
          );
          this.examsCount = response.data
        }
        catch (err) {
          console.log(err)
        }
      }
    }
  }
}
</script>
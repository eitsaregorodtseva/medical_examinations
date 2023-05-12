<template>
  <div class="col">
    <div
      v-for="year in buttonsData"
      :key="year"
      class="row q-ma-sm"
    >
      <div>
        <div style="font-weight: 600; font-size: 18px">
          {{ year.year }}
        </div>
        <div class="row q-gutter-sm">
          <div
            v-for="month in year.months"
            :key="month"
          >
            <month-component
              :title="month.title"
              :dates="month.dates"
              @change-month="onButtonClicked"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <month-calendar
    :handle-selected-date="selectedDate"
    :active-period="activePeriod"
    :exams-count="examsCount"
    :select-all="selectAll"
    @get-interval="passInterval"
  />
</template>

<script>
import { today } from '@quasar/quasar-ui-qcalendar/src';
import MonthCalendar from './MonthCalendar.vue';
import MonthComponent from './MonthComponent.vue';
import moment from 'moment';

export default {
  components: {
    MonthCalendar,
    MonthComponent
  },
  props: {
    activePeriod: {
      type: Object,
      default() {
        return {}
      }
    },
    examsCount: {
      type: Array,
      default() {
        return []
      }
    },
    selectAll: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['get-interval'],
  data() {
    return {
      selectedDate: today(),
      locale: 'ru',
    }
  },
  computed: {
    buttonsData() {
      var buttons_info = [];
      const first_year = new Date(this.activePeriod.from).getFullYear();
      const last_year = new Date(this.activePeriod.to).getFullYear();

      buttons_info.push({ year: first_year, months: [] });
      if (last_year !== first_year) {
        buttons_info.push({ year: last_year, months: [] });
      }

      var dateStart = moment(this.activePeriod.from);
      const dateEnd = moment(this.activePeriod.to);

      while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
        const year = new Date(dateStart).getFullYear();
        const index = buttons_info.findIndex((item) => item.year === year);
        buttons_info[index].months.push({ 
          title: this.monthFormatter().format(dateStart), 
          dates: {
            start_date: this.countStartDate(dateStart), 
            end_date: moment(this.countEndDate(dateStart)).format('YYYY-MM-DD')
          }
        });
        dateStart.add(1, 'month');
      }
      return buttons_info;
    }
  },
  methods: {
    monthFormatter() {
      try {
        return new Intl.DateTimeFormat(this.locale || undefined, {
          month: 'long',
          timeZone: 'UTC'
        })
      }
      catch (e) {
        //
      }
    },

    countStartDate(date) {
      let start_date = moment(this.activePeriod.from);
      if (new Date(start_date).getFullYear() === new Date(date).getFullYear() && start_date.format('M') === date.format('M')) {
        return date.format('YYYY-MM-DD');
      }
      else {
        return date.format('YYYY-MM-01');
      }
    },

    countEndDate(date) {
      let end_date = moment(this.activePeriod.to);
      if (new Date(end_date).getFullYear() === new Date(date).getFullYear() && end_date.format('M') === date.format('M')) {
        return date.format('YYYY-MM-DD');
      }
      else {
        return moment(new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0));
      }
    },

    passInterval(data) {
      this.$emit('get-interval', data)
    },

    onButtonClicked(dates) {
      this.selectedDate = dates.start_date
    }
  }
}
</script>
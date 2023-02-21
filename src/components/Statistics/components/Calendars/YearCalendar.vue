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
            v-for="month in year.periods"
            :key="month"
          >
            <month-component
              :title="month.month"
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
    @get-interval="passInterval"
  />
</template>

<script>
import { today } from '@quasar/quasar-ui-qcalendar/src';
import MonthCalendar from './MonthCalendar.vue';
import MonthComponent from '../../MonthComponent.vue';
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
      let new_structure = [];
      const first_date_year = new Date(this.activePeriod.from).getFullYear()
      const last_date_year = new Date(this.activePeriod.to).getFullYear()
      new_structure.push({ year: first_date_year, periods: [] })
      if (last_date_year !== first_date_year) {
        new_structure.push({ year: last_date_year, periods: [] })
      }
      var dateStart = moment(this.activePeriod.from);
      var dateEnd = moment(this.activePeriod.to);
      var interim = dateStart.clone();

      while (dateEnd > interim || interim.format('M') === dateEnd.format('M')) {
        if (new Date(interim).getFullYear() === first_date_year) {
          const index = new_structure.findIndex((item) => item.year === first_date_year)
          const end = new Date(first_date_year, new Date(interim).getMonth() + 1, 0);
          new_structure[index].periods.push({ month: this.monthFormatter().format(interim), dates: { start: interim.format('YYYY-MM-01'), end: moment(end).format('YYYY-MM-DD') } })
        }
        else {
          const index = new_structure.findIndex((item) => item.year === last_date_year)
          const end = new Date(last_date_year, new Date(interim).getMonth() + 1, 0);
          new_structure[index].periods.push({ month: this.monthFormatter().format(interim), dates: { start: interim.format('YYYY-MM-01'), end: moment(end).format('YYYY-MM-DD') } })
        }
        interim.add(1, 'month');
      }
      return new_structure;
    }
  },
  methods: {
    monthFormatter() { //TODO refactor
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

    passInterval(data) {
      this.$emit('get-interval', data)
    },

    onButtonClicked(dates) {
      this.selectedDate = dates.start
    }
  }
}
</script>
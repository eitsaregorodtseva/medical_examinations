<template>
  <div class="row">
    <div
      v-for="year_name in exams_count"
      :key="year_name"
      class="col"
    >
      <div style="font-weight: 600; font-size: 18px">
        {{ year_name.year }}
      </div>
      <div class="row q-gutter-sm">
        <div 
          v-for="month in year_name.exams"
          :key="month"
        >
          <month-component 
            :title="month.title"
            :count="month.count"
          />
        </div>
      </div>
    </div>
  </div>
  <month-calendar 
    :active-period="activePeriod"
    @get-interval="passInterval"
  />
</template>

<script>
import MonthCalendar from './MonthCalendar.vue';
import MonthComponent from '../../MonthComponent.vue';

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
        }
    },
    emits: ['get-interval'],
    data() {
        return {
          year: '2022',
          exams_count: [
            {
              year: 2022,
              exams: [{ title: "Февраль", year: "2022", count: "1" },
              { title: "Март", year: "2022", count: "2" },
              { title: "Апрель", year: "2022", count: "2" },
              { title: "Май", year: "2022", count: "2" },
              { title: "Июнь", year: "2022", count: "2" },
              { title: "Июль", year: "2022", count: "2" },
              { title: "Август", year: "2022", count: "2" },
              { title: "Сентябрь", year: "2022", count: "2" },
              { title: "Октябрь", year: "2022", count: "2" },
              { title: "Ноябрь", year: "2022", count: "2" },
              { title: "Декабрь", year: "2022", count: "2" },]
            },
            {
              year: 2023,
              exams: [{ title: "Январь", year: "2023", count: "2" },
              { title: "Февраль", year: "2023", count: "2" },]
            }
          ]
        }
    },
    updated() {
        console.log('year', this.activePeriod)
    },
    methods: {
        passInterval(data) {
            console.log(data)
            this.$emit('get-interval', data)
        }
    }
}
</script>
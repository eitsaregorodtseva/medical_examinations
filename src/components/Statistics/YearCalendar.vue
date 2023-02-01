<template>
  <div 
    v-for="month in exams_count"
    :key="month"
  >
    <month-component 
      :title="month.title"
      :count="month.count"
    />
  </div>
  <month-calendar 
    :active-period="activePeriod"
    @get-interval="passInterval"
  />
</template>

<script>
import MonthCalendar from './MonthCalendar.vue';
import MonthComponent from './MonthComponent.vue';

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
        exams_count: [{title: "1", count: "1"}, {title: "2", count: "2"}, {title: "2", count: "2"}]
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
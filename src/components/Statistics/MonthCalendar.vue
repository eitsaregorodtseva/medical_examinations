<template>
  <div class="row justify-center items-center text-center q-mb-md">
    <q-btn 
      flat
      icon="navigate_before"
      @click="onPrev"
    />
    <div style="display: flex;  flex-wrap: nowrap; font-weight: 600; text-transform: capitalize;">
      {{ formattedMonth }}
    </div>
    <q-btn 
      flat
      icon="navigate_next"
      @click="onNext"
    />
  </div>
  <q-calendar-month
    ref="calendar"
    v-model="selectedDate"
    animated
    bordered
    focusable
    hoverable
    no-outside-days
    style="cursor: pointer"
    :locale="locale"
    :selected-start-end-dates="startEndDates"
    :range="true"
    :day-min-height="60"
    :day-height="0"
    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    :disabled-before="activePeriod.from"
    :disabled-after="activePeriod.to"
    @mousedown-day="onMouseDownDay"
    @mouseup-day="onMouseUpDay"
    @mousemove-day="onMouseMoveDay"
    @change="onChange"
    @moved="onMoved"
    @click-date="onClickDate"
    @click-day="onClickDay"
    @click-workweek="onClickWorkweek"
    @click-head-workweek="onClickHeadWorkweek"
    @click-head-day="onClickHeadDay"
  >
    <template #day="{ scope: { timestamp } }">
      <template
        v-for="event in eventsMap[timestamp.date]"
        :key="event.id"
      >
        <div
          :class="badgeClasses('day')"
          class="my-event"
          style="display: flex; align-items: center"
        >
          <div style="width: 35px; border-radius: 50%; background-color: #2A0B71; margin-top: 5px;">   
            <!-- TODO        -->
            <div class="title q-calendar__ellipsis">
              {{ event.title }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </q-calendar-month>
</template>

<script>
import { ref } from 'vue';
import {
    QCalendarMonth,
    addToDate,
    parseDate,
    parseTimestamp,
    getDayIdentifier,
    today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

const CURRENT_DAY = new Date()
function getCurrentDay(day) {
    const newDay = new Date(CURRENT_DAY)
    newDay.setDate(day)
    const tm = parseDate(newDay)
    return tm.date
}


function leftClick(e) {
    return e.button === 0
}

export default {
    components: {
        QCalendarMonth
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
            selectedDate: ref(today()),
            calendar: ref(null),
            anchorTimestamp: ref(null),
            otherTimestamp: ref(null),
            mouseDown: ref(false),
            mobile: ref(true),
            locale: "ru",
            events: [
                {
                    id: 1,
                    title: '24',
                    date: getCurrentDay(1),
                },
            ]
        }
    },
    computed: {
        eventsMap() {
            const map = {}
            if (this.events.length > 0) {
                this.events.forEach(event => {
                    (map[event.date] = (map[event.date] || [])).push(event)
                    if (event.days !== undefined) {
                        let timestamp = parseTimestamp(event.date)
                        let days = event.days
                        // add a new event for each day
                        // skip 1st one which would have been done above
                        do {
                            timestamp = addToDate(timestamp, { day: 1 })
                            if (!map[timestamp.date]) {
                                map[timestamp.date] = []
                            }
                            map[timestamp.date].push(event)
                            // already accounted for 1st day
                        } while (--days > 1)
                    }
                })
            }
            return map
        },
        anchorDayIdentifier() {
            if (this.anchorTimestamp !== null) {
                return getDayIdentifier(this.anchorTimestamp)
            }
            return false
        },
        otherDayIdentifier() {
            if (this.otherTimestamp !== null) {
                return getDayIdentifier(this.otherTimestamp)
            }
            return false
        },
        startEndDates() {
            const dates = []
            if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
                if (this.anchorDayIdentifier <= this.otherDayIdentifier) {
                    dates.push(this.anchorTimestamp.date, this.otherTimestamp.date)
                    this.$emit('get-interval', dates)
                }
                else {
                    dates.push(this.otherTimestamp.date, this.anchorTimestamp.date)
                    this.$emit('get-interval', dates)
                }
            }
            return dates
        },
        formattedMonth() {
            const date = new Date(this.selectedDate)
            return this.monthFormatter().format(date) + ' ' + date.getFullYear()
        }
    },
    methods: {
        badgeClasses() {
            return {
                [`text-white bg-transparent`]: true,
                'rounded-border': true
            }
        },
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
        onToday() {
            this.$refs.calendar.moveToToday()
        },
        onPrev() {
            this.$refs.calendar.prev()
        },
        onNext() {
            this.$refs.calendar.next()
        },
        // onMoved(data) {
            // console.log('onMoved', data)
        // },
        onChange(data) {
            // this.$emit('get-interval', this.startEndDates)
            console.log('onChange', data)
        },
        // onClickDate(data) {
            // console.log('onClickDate', data)
        // },
        onClickDay() {
            // console.log('onClickDay', data)
            // console.log(this.startEndDates)
            this.$emit('get-interval', this.startEndDates)
        },
        // onClickWorkweek(data) {
            // console.log('onClickWorkweek', data)
        // },
        // onClickHeadDay(data) {
            // console.log('onClickHeadDay', data)
        // },
        // onClickHeadWorkweek(data) {
            // console.log('onClickHeadWorkweek', data)
        // },

        onMouseDownDay({ scope, event }) {
            if (leftClick(event)) {
                if (this.mobile === true
                    && this.anchorTimestamp !== null
                    && this.otherTimestamp !== null
                    && this.anchorTimestamp.date === this.otherTimestamp.date) {
                    this.otherTimestamp = scope.timestamp
                    this.mouseDown = false
                    return
                }
                // mouse is down, start selection and capture current
                this.mouseDown = true
                this.anchorTimestamp = scope.timestamp
                this.otherTimestamp = scope.timestamp
            }
        },
        onMouseUpDay({ scope, event }) {
            if (leftClick(event)) {
                // mouse is up, capture last and cancel selection
                this.otherTimestamp = scope.timestamp
                this.mouseDown = false
            }

        },
        onMouseMoveDay({ scope }) {
            if (this.mouseDown === true && scope.outside !== true) {
                this.fotherTimestamp = scope.timestamp
            }
        }
    }
}
</script>
<style lang="sass" scoped>
.my-event
  position: relative
  font-size: 14px
  width: 100%
  margin: 5px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer
.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%
.text-white
  color: white
.rounded-border
  border-radius: 2px
</style>
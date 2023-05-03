<template>
  <div class="column items-center text-center">
    <div class="row items-center q-mb-md">
      <q-btn
        flat
        unelevated
        icon="navigate_before"
        :disabled="disable_before"
        @click="onPrev"
      />
      <div style="display: flex;  flex-wrap: nowrap; font-weight: 600; text-transform: capitalize;">
        {{ formattedMonth }}
      </div>
      <q-btn
        flat
        unelevated
        icon="navigate_next"
        :disable="disable_after"
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
      no-active-date
      no-outside-days
      style="cursor: pointer"
      :locale="locale"
      :selected-start-end-dates="startEndDates"
      :range="true"
      :day-min-height="50"
      :day-height="0"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :disabled-before="activePeriod.from"
      :disabled-after="activePeriod.to"
      @mousedown-day="onMouseDownDay"
      @mouseup-day="onMouseUpDay"
      @mousemove-day="onMouseMoveDay"
      @change="onChange"
      @click-day="onClickDay"
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
            <div style="width: 30px; border-radius: 50%; background-color: #2A0B71; margin-top: 3px;">
              <div class="title q-calendar__ellipsis">
                {{ event.title }}
              </div>
            </div>
          </div>
        </template>
      </template>
    </q-calendar-month>
  </div>
</template>

<script>
import { ref } from 'vue';
import {
    QCalendarMonth,
    getDayIdentifier,
    today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

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
        },
        examsCount: {
            type: Array,
            default() {
                return []
            }
        },
        handleSelectedDate: {
            type: String,
            default: today()
        },
        selectAll: {
            type: Boolean,
            default: false,
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

            disable_before: ref(false),
            disable_after: ref(false),
        }
    },
    computed: {
        eventsMap() {
            const map = {}

            if (this.examsCount.length > 0) {
                this.examsCount.forEach(event => {
                    (map[event.calendar] = (map[event.calendar] || [])).push({
                        id: map.length,
                        title: event.exams,
                        date: event.calendar
                    })
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
            if (this.selectAll) {
                dates.push(this.activePeriod.from, this.activePeriod.to);
                this.$emit('get-interval', dates);
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.anchorTimestamp = ref(null);
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.otherTimestamp = ref(null);
            }
            else {
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
            }
            return dates
        },
        formattedMonth() {
            const date = new Date(this.selectedDate)
            return this.monthFormatter().format(date) + ' ' + date.getFullYear()
        }
    },
    watch: {
        handleSelectedDate() {
            this.selectedDate = this.handleSelectedDate;
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
        onPrev() {
            this.$refs.calendar.prev()
        },
        onNext() {
            this.$refs.calendar.next()
        },
        onChange() {
            this.disable_after = new Date(this.activePeriod.to).getMonth() ===
                new Date(this.selectedDate).getMonth() &&
                new Date(this.activePeriod.to).getFullYear() ===
                new Date(this.selectedDate).getFullYear();
            this.disable_before = new Date(this.activePeriod.from).getMonth() ===
                new Date(this.selectedDate).getMonth() &&
                new Date(this.activePeriod.from).getFullYear() ===
                new Date(this.selectedDate).getFullYear();
        },
        onClickDay() {
            this.$emit('get-interval', this.startEndDates)
        },

        onMouseDownDay({ scope, event }) {
            if (!this.selectAll) {
                if (leftClick(event)) {
                    if (this.mobile === true
                        && this.anchorTimestamp !== null
                        && this.otherTimestamp !== null
                        && this.anchorTimestamp.date === this.otherTimestamp.date) {
                        this.otherTimestamp = scope.timestamp
                        this.mouseDown = false
                        return
                    }
                    this.mouseDown = true
                    this.anchorTimestamp = scope.timestamp
                    this.otherTimestamp = scope.timestamp
                }
            }
        },
        onMouseUpDay({ scope, event }) {
            if (!this.selectAll) {
                if (leftClick(event)) {
                    this.otherTimestamp = scope.timestamp
                    this.mouseDown = false
                }
            }

        },
        onMouseMoveDay({ scope }) {
            if (!this.selectAll) {
                if (this.mouseDown === true && scope.outside !== true) {
                    this.fotherTimestamp = scope.timestamp
                }
            }
        }
    }
}
</script>
<style lang="sass" scoped>
.my-event
  position: relative
  font-size: 12px
  width: 100%
  margin: 2px 0 0 0
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

.q-btn:disabled 
  background: transparent 
.q-btn:hover 
  background: transparent 
</style>
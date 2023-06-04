<template>
  <div class="fit row wrap q-pl-xs q-gutter-md">
    <div class="q-mr-xl">
      <div class="col">
        <div class="row q-py-md q-gutter-md">
          <organization-toggler @change-organization="handleChangeOrganization" />
          <period-toggler
            v-if="organization_toggler_state !== 'workload'"
            @change-period="handleChangePeriod"
          />
        </div>
      </div>
    </div>
    <div class="col q-ml-xl">
      <filter-button
        :organization-toggler-state="organization_toggler_state"
        @update-filter-state="filter_state = true"
      />
    </div>
  </div>

  <div
    v-if="loading_state"
    style="display: flex; justify: center; margin-top: 20%"
  >
    <q-spinner-oval
      color="dark"
      size="3em"
      style="margin: auto"
    />
  </div>

  <div
    v-if="organization_toggler_state !== 'workload' && !loading_state"
    class="fit row wrap justify-center q-mt-md"
  >
    <div
      v-for="org in visibleOrganizationsList"
      :key="org"
      class="q-ma-lg"
    >
      <medworker-card
        class="col-4"
        :data="org"
      />
    </div>
  </div>

  <div
    v-if="organization_toggler_state === 'workload' && !loading_state"
    class="q-pa-md"
  >
    <workload-table
      :data="workloadTableData"
      :loading="loading_workload"
      @open-calendar="calendar_state = true"
      @update-table="updateWorkloadTable"
    />
  </div>
  <filter-modal
    v-model="filter_state"
    class="self-end"
    :options="organizationNamesList"
    :values="filterValues"
    @filter-cards="filterCards"
  />

  <calendar-modal 
    v-model="calendar_state"
    calendar-type="medworkers"
    :today-date="current_date"
    :first-date="first_date"
    :calendar-dates="calendar_dates"
    calendar-state="year"
    @update-table="updateWorkloadTable"
  />
</template>

<script>
import MedworkerCard from './MedworkerCard.vue';
import OrganizationToggler from './OrganizationToggler.vue';
import PeriodToggler from './PeriodToggler.vue';
import FilterButton from './FilterButton.vue';
import WorkloadTable from './WorkloadTable.vue';
import FilterModal from "./FilterModal.vue";
import CalendarModal from '../../CalendarModal.vue';
import moment from "moment";
import { ref } from "vue";
import { getMedworkersStats, getWorkload } from '@/api/medworkers.api';
export default {
  components: {
    MedworkerCard,
    OrganizationToggler,
    PeriodToggler,
    FilterButton,
    WorkloadTable,
    CalendarModal,
    FilterModal
  },
  data() {
    return {
      //togglers
      organization_toggler_state: ref("summary"),
      period_toggler_state: ref("month"),

      //organizations
      organizationsList: [],
      visibleOrganizationsList: [],
      workloadTableData: [],

      //calendar
      current_date: moment().format("YYYY-MM-DD"),
      first_date: moment().format("YYYY-MM-DD"),
      calendar_dates: {start: undefined, end: undefined},

      //filter
      filterValues: [],
      organizationNamesList: [],

      //states
      calendar_state: false,
      filter_state: false,
      loading_state: true,
      loading_workload: true,

      user_id: this.$store.state.user.id,
    }
  },
  mounted() {
    // console.log(this.$store.state.user)
    this.user_id =  this.$store.state.user.id;
      this.handleChangePeriod('month'),
      this.handleChangeOrganization('summary');
  },
  methods: {
    handleChangeOrganization(organization_toggler_state) {
      this.organization_toggler_state = organization_toggler_state;
      this.loading_state = true;
      this.filterValues = [];
      if (organization_toggler_state !== 'workload') {
        this.updateExamCard();
      }
      else {
        this.first_date = moment().subtract(364, "days").format("YYYY-MM-DD");
        this.updateWorkloadTable(undefined, 1, 10);
      }
    },

    handleChangePeriod(period_toggler_state) {
      this.period_toggler_state = period_toggler_state;
      this.loading_state = true;
      this.filterValues = [];
      if (this.period_toggler_state === "month") {
        this.first_date = moment().subtract(30, "days").format("YYYY-MM-DD");
      } else {
        this.first_date = moment().subtract(364, "days").format("YYYY-MM-DD");
      }
      this.updateExamCard();
    },

    filterCards(values) {
      this.visibleOrganizationsList = [];
      if (values.length > 0) {
        this.organizationsList.map((org) => {
          if (values.includes(org.fio)) {
            this.visibleOrganizationsList.push(org);
          }
        });
      } else {
        this.visibleOrganizationsList = this.organizationsList;
      }
      this.filter_state = false;
      this.filterValues = values;
    },


    async updateExamCard() {
      try {
        var response;
        if (this.organization_toggler_state === "summary") {
          response = await getMedworkersStats(
            this.user_id,
            this.first_date,
            this.current_date,
            true
          );
        }
        else {
          response = await getMedworkersStats(
            this.user_id,
            this.first_date,
            this.current_date,
            false
          );
        }

        this.organizationsList = response.data;
        this.loading_state = false;
        if (this.loading_state === false) {
          this.organizationNamesList = [];
          this.organizationsList.map((org) => {
            this.organizationNamesList.push(org.fio);
          });
        }
        if (this.organization_toggler_state === "summary") {
          this.organizationsList[0].fio = "Все медработники";
        }
        this.visibleOrganizationsList = this.organizationsList;
      } catch (err) {
        console.log(err);
      }
    },

    preparePeriod(date) {
      let start_date;
      let end_date;
        start_date = typeof date === "string" ?
          moment(new Date(date)).format("YYYY-MM-DD") :
          moment(new Date(date.from)).format("YYYY-MM-DD");
        end_date = typeof date === "string" ?
          moment(new Date(date)).format("YYYY-MM-DD") :
          moment(new Date(date.to)).format("YYYY-MM-DD");
      return { start: start_date, end: end_date }
    },

    async updateWorkloadTable(date_from_modal, page, count_row) {
      this.loading_workload = true;
      // this.loading_state = true;
      let date = {start: undefined, end: undefined}
      if (date_from_modal) {
        date = this.preparePeriod(date_from_modal);
        this.calendar_dates = date;
      }
      this.calendar_state = false;
      try {
        var response = await getWorkload(
          this.user_id,
          this.calendar_dates.start ?? this.first_date,
          this.calendar_dates.end ?? this.current_date,
          page ?? 1,
          count_row ?? 10
          );
        this.workloadTableData = response.data;
        this.loading_workload = false;
        this.loading_state = false;
      } catch (err) {
        console.log(err)
      }
    }
  },
};
</script>
<style scoped>
.q-btn .q-focus-helper {
  display: none;
}
</style>
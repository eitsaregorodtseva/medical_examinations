<template>
  <div class="row q-pl-xs">
    <div class="col">
      <div class="q-py-md row q-gutter-md">
        <organization-toggler
          @change-organization="handleChangeOrganization"
        />
        <period-toggler
          @change-period="handleChangePeriod"
        /> 
      </div>
    </div>
    <filter-button 
      :organization-toggler-state="organization_toggler_state"
      @update-filter-state="filter_state = true"
    />
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
    v-else
    class="fit row wrap justify-center q-gutter-xl q-mt-xs"
  >
    <div 
      v-for="org in visibleOrganizationsList" 
      :key="org"
    >
      <custom-card
        class="col-4"
        :data="org"
        @show-modal="handleToggleShowDialog"
      />
    </div>
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
    :today-date="current_date"
    :first-date="first_date"
    :calendar-state="period_toggler_state"
    @update-table="updateExamsHistoryTable"
  />
  <exams-modal
    v-model="exams_table_state"
    :period="period_toggler_state"
    :exams-list="examsList"
  />
</template>

<script>
import CustomCard from "@/components/Statistics/CustomCard.vue";
import CalendarModal from "@/components/Statistics/CalendarModal.vue";
import FilterModal from "@/components/Statistics/FilterModal.vue";
import ExamsModal from "./ExamsModal.vue";
import OrganizationToggler from "./OrganizationToggler.vue";
import PeriodToggler from "./PeriodToggler.vue";
import FilterButton from "./FilterButton.vue";
import { Role } from '../../helpers/role';
import {
  getAllOrganizationsStats,
  getOneOrganizationStats,
} from "@/api/organizations.api.js";
import {
  getExamsHistoryByPeriod,
} from "@/api/exams.api.js";
import moment from "moment";
import { ref } from "vue";

export default {
  components: {
    CustomCard,
    FilterModal,
    ExamsModal,
    CalendarModal,
    FilterButton,
    OrganizationToggler,
    PeriodToggler
  },
  data() {
    return {
      //togglers
      organization_toggler_state: ref("summary"),
      period_toggler_state: ref("today"),

      //organizations
      organizationsList: [],
      visibleOrganizationsList: [],
      summary: [{
        organization_name: '',
        all_exams_count: 0,
        new_exams_count: 0,
        admission_count: 0,
        non_admission_count: 0,
        alco_count: 0,
        pressure_heart_count: 0,
        other_count: 0,
      }],

      //calendar

      current_date: moment().format("YYYY-MM-DD"),
      first_date: moment().format("YYYY-MM-DD"),

      //filter
      filterValues: [],
      organizationNamesList: [],
      
      //states
      tab: ref("main"),
      calendar_state: false,
      filter_state: false,
      exams_table_state: false,
      loading_state: true,
      
      //variables
      Role,
      examsList: [],
      
      user_id: null,
      user_organization_id: null,
      user_role: null,
    };
  },
  mounted() {
    this.populateDataFromStorage(),
    this.handleChangePeriod('today'),
    this.handleChangeOrganization('summary');
  },
  methods: {
    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
      this.user_organization_id = sessionStorage.getItem(
        "user_organization_id"
      );
      this.user_role = sessionStorage.getItem('user_role');
    },

    handleChangeOrganization(organization_toggler_state) {
      this.organization_toggler_state = organization_toggler_state;
      if (this.organization_toggler_state === "summary") {
        this.visibleOrganizationsList = this.summary;
      } else {
        this.visibleOrganizationsList = this.organizationsList;
      }
    },

    handleChangePeriod(period_toggler_state) {
      this.period_toggler_state = period_toggler_state;
      this.loading_state = true;
      if (this.period_toggler_state === "month") {
        this.first_date = moment().subtract(30, "days").format("YYYY-MM-DD");
      } else {
        if (this.period_toggler_state === "today") {
          this.first_date = moment().format("YYYY-MM-DD");
        } else {
          this.first_date = moment().subtract(364, "days").format("YYYY-MM-DD");
        }
      }
      this.updateExamCard();
    },

    handleToggleShowDialog() {
      if (this.period_toggler_state !== 'today') {
        this.calendar_state = true;
      }    
      else {
        this.updateExamsHistoryTable(moment(new Date(this.current_date)).subtract(1, 'days').toString())
      }
    },

    prepareDate(date) {
      let new_date = new Date(date);
      new_date.setUTCHours(0,0,0,0)
      return new_date.toISOString()
    },

    async updateExamsHistoryTable(date_from_modal) {
      let start_date = typeof date_from_modal === "string" ?
        this.prepareDate(moment(new Date(date_from_modal)).add(1, 'days')) :
        this.prepareDate(moment(new Date(date_from_modal.from)).add(1, 'days'));
      let end_date = typeof date_from_modal === "string" ?
        this.prepareDate(moment(new Date(date_from_modal)).add(2, 'days')) :
        this.prepareDate(moment(new Date(date_from_modal.to)).add(2, 'days'));

        // this.exams_table_state = true;
      try {
        var response;
        response = await getExamsHistoryByPeriod(
          this.user_id,
          start_date,
          end_date
        );
        this.examsList = response.data;
        if (this.examsList.length > 0) {
          this.exams_table_state = true;
        }
      } catch (err) {
        console.log(err);
      }
    },

    filterCards(values) {
      this.visibleOrganizationsList = [];
      if (values.length > 0) {
        this.organizationsList.map((org) => {
          if (values.includes(org.organization_name)) {
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
        if (this.user_organization_id === "null") {
          response = await getAllOrganizationsStats(
            this.user_id,
            this.first_date,
            this.current_date
          );
        } else {
          response = await getOneOrganizationStats(
            this.user_organization_id,
            this.user_id,
            this.first_date,
            this.current_date
          );
        }
        this.organizationsList = response.data;
        this.loading_state = false;
        this.summary = [{
          organization_name: '',
          all_exams_count: 0,
          new_exams_count: 0,
          admission_count: 0,
          non_admission_count: 0,
          alco_count: 0,
          pressure_heart_count: 0,
          other_count: 0,
        }];
        if (this.loading_state === false) {
          this.organizationsList.map((org) => {
            this.organizationNamesList.push(org.organization_name);
            this.summary.all_exams_count = this.summary.all_exams_count + org.all_exams_count;
            this.summary.new_exams_count = this.summary.new_exams_count + org.new_exams_count;
            this.summary.admission_count = this.summary.admission_count + org.admission_count;
            this.summary.non_admission_count = this.summary.non_admission_count + org.non_admission_count;
            this.summary.alco_count = this.summary.alco_count + org.alco_count;
            this.summary.pressure_heart_count = this.summary.pressure_heart_count + org.pressure_heart_count;
            this.summary.other_count = this.summary.other_count + org.other_count;
          });
        }
        this.summary[0].organization_name = "Все организации";
        if (this.user_role === Role.Admin) {
          this.visibleOrganizationsList = this.organization_toggler_state === "summary" 
            ? this.summary
            : this.organizationsList;
        }
        else {
          this.visibleOrganizationsList = this.organizationsList;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
.q-btn .q-focus-helper {
  display: none;
}
</style>

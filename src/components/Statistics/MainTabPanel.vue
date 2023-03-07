<template>
  <div class="fit row wrap q-pl-xs q-gutter-md">
    <div>
      <div class="col q-mr-xl">
        <div class="row q-py-md q-gutter-md">
          <organization-toggler @change-organization="handleChangeOrganization" />
          <period-toggler @change-period="handleChangePeriod" />
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
    :organization-id="current_organization"
    @update-table="updateHistoryTable"
  />
  <table-history-modal
    v-model="table_state"
    :period="period_toggler_state"
    :items-type="current_part"
    :items-list="itemsList"
  />
</template>

<script>
import CustomCard from "@/components/Statistics/CustomCard.vue";
import CalendarModal from "@/components/Statistics/CalendarModal.vue";
import FilterModal from "@/components/Statistics/FilterModal.vue";
import TableHistoryModal from "./TableHistoryModal.vue";
import OrganizationToggler from "./components/OrganizationToggler.vue";
import PeriodToggler from "./components/PeriodToggler.vue";
import FilterButton from "./components/FilterButton.vue";
import { Role } from '../../helpers/role';
import {
  getAllOrganizationsStats,
  getOneOrganizationStats,
} from "@/api/organizations.api.js";
import {
  getExamsHistoryByPeriod,
  getExamsHistoryForOrganizationByPeriod
} from "@/api/exams.api.js";
import moment from "moment";
import { ref } from "vue";
import { getAllTermsStats, getOneTermnStats } from "../../api/terminals.api";
import { Notify } from 'quasar';

export default {
  components: {
    CustomCard,
    FilterModal,
    TableHistoryModal,
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
      table_state: false,
      loading_state: true,

      //variables
      Role,
      itemsList: [],
      examsList: [],
      terminalsList: [],

      current_part: '',
      current_organization: 0,

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

    handleToggleShowDialog(value, id, requestFlag) {
      this.current_part = value;
      this.current_organization = id;
      if (requestFlag) {
        if (this.period_toggler_state !== 'today') {
          this.calendar_state = true;
        }
        else {
          if (value === "exams") {
            this.updateExamsHistoryTable(moment(new Date(this.current_date)).subtract(1, 'days').toString(), this.current_organization)
          }
          else {
            this.updateTerminalsHistoryTable(moment(new Date(this.current_date)).subtract(1, 'days').toString(), this.current_organization)
          }
        }
      }
    },

    prepareDate(date) {
      let new_date = new Date(date);
      new_date.setUTCHours(0, 0, 0, 0)
      return new_date.toISOString()
    },

    preparePeriod(date, exams) {
      let start_date;
      let end_date;
      if (exams) {
        start_date = typeof date === "string" ?
          this.prepareDate(moment(new Date(date)).add(1, 'days')) :
          this.prepareDate(moment(new Date(date.from)).add(1, 'days'));
        end_date = typeof date === "string" ?
          this.prepareDate(moment(new Date(date)).add(2, 'days')) :
          this.prepareDate(moment(new Date(date.to)).add(2, 'days'));
      }
      else {
        start_date = typeof date === "string" ?
          moment(new Date(date)).add(1, 'days').format('YYYY-MM-DD') :
          moment(new Date(date.from)).add(1, 'days').format('YYYY-MM-DD');
        end_date = typeof date === "string" ?
          moment(new Date(date)).add(2, 'days').format('YYYY-MM-DD') :
          moment(new Date(date.to)).add(2, 'days').format('YYYY-MM-DD');
      }
      return { start: start_date, end: end_date }
    },

    updateHistoryTable(date_from_modal) {
      if (this.current_part === 'exams') {
        this.updateExamsHistoryTable(date_from_modal, this.current_organization);
      }
      else {
        this.updateTerminalsHistoryTable(date_from_modal, this.current_organization);
      }
    },

    async updateExamsHistoryTable(date_from_modal) {
      const date = this.preparePeriod(date_from_modal, true);
      if (this.current_organization !== undefined) {
        try {
          var response;
          response = await getExamsHistoryForOrganizationByPeriod(
            this.user_id,
            this.current_organization,
            date.start,
            date.end
          );
          this.examsList = this.itemsList = response.data;
          if (this.examsList.length > 0) {
            this.table_state = true;
          }
          else {
            Notify.create({
              color: 'warning',
              textColor: 'white',
              icon: 'warning',
              message: 'В данный период не было осмотров.'
            })
          }
        } catch (err) {
          console.log(err);
        }
      }
      else {
        try {
          response = await getExamsHistoryByPeriod(
            this.user_id,
            date.start,
            date.end
          );
          this.examsList = this.itemsList = response.data;
          if (this.examsList.length > 0) {
            this.table_state = true;
          }
          else {
            Notify.create({
              color: 'warning',
              textColor: 'white',
              icon: 'warning',
              message: 'В данный период не было осмотров.'
            })
          }
        } catch (err) {
          console.log(err);
        }
      }
    },

    async updateTerminalsHistoryTable(date_from_modal) {
      const date = this.preparePeriod(date_from_modal, false);
      if (this.current_organization !== undefined) {
        try {
          var response;
          response = await getOneTermnStats(
            this.user_id,
            this.current_organization,
            date.start,
            date.end
          );
          this.terminalsList = this.itemsList = response.data;
          if (this.terminalsList.length > 0) {
            this.table_state = true;
          }
          else {
            Notify.create({
              color: 'warning',
              textColor: 'white',
              icon: 'warning',
              message: 'В данный период не было осмотров.'
            })
          }
        } catch (err) {
          console.log(err);
        }
      }
      else {
        try {
          response = await getAllTermsStats(
            this.user_id,
            date.start,
            date.end
          );
          this.terminalsList = this.itemsList = response.data;
          if (this.terminalsList.length > 0) {
            this.table_state = true;
          }
          else {
            Notify.create({
              color: 'warning',
              textColor: 'white',
              icon: 'warning',
              message: 'В данный период не было осмотров.'
          })
          }
        } catch (err) {
          console.log(err);
        }
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
            this.summary[0].all_exams_count = this.summary[0].all_exams_count + org.all_exams_count;
            this.summary[0].new_exams_count = this.summary[0].new_exams_count + org.new_exams_count;
            this.summary[0].admission_count = this.summary[0].admission_count + org.admission_count;
            this.summary[0].non_admission_count = this.summary[0].non_admission_count + org.non_admission_count;
            this.summary[0].alco_count = this.summary[0].alco_count + org.alco_count;
            this.summary[0].pressure_heart_count = this.summary[0].pressure_heart_count + org.pressure_heart_count;
            this.summary[0].other_count = this.summary[0].other_count + org.other_count;
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

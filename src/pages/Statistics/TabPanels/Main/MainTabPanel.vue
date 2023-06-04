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
    class="fit row wrap justify-center q-mt-md"
  >
    <div
      v-for="org in visibleOrganizationsList"
      :key="org"
      class="q-ma-lg"
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
    calendar-type="exams"
    :today-date="current_date"
    :first-date="first_date"
    :filter-value="exams_filter"
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
import CustomCard from "./components/CustomCard.vue";
import CalendarModal from "../../CalendarModal.vue";
import FilterModal from '../../FilterModal.vue'
import TableHistoryModal from "./components/TableHistoryModal.vue";
import OrganizationToggler from "../../components/OrganizationToggler.vue";
import PeriodToggler from "../../components/PeriodToggler.vue";
import FilterButton from "../../components/FilterButton.vue";
import { Role } from '@/constants/role';
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
import { getAllTermsStats, getOneTermnStats } from "@/api/terminals.api";
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

      //calendar
      current_date: moment().format("YYYY-MM-DD"),
      first_date: moment().format("YYYY-MM-DD"),
      exams_filter: '',

      //filter
      filterValues: [],
      personnelFilterValues: [],
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

      user_id: this.$store.state.user.id,
      user_organization_id: this.$store.state.user.organization_id,
      user_role: this.$store.state.user.role,
    };
  },
  mounted() {
      this.handleChangePeriod('today'),
      this.handleChangeOrganization('summary');
  },
  methods: {
    handleChangeOrganization(organization_toggler_state) {
      this.organization_toggler_state = organization_toggler_state;
      this.loading_state = true;
      this.filterValues = [];
      this.updateExamCard();
    },

    handleChangePeriod(period_toggler_state) {
      this.period_toggler_state = period_toggler_state;
      this.loading_state = true;
      this.filterValues = [];
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

    handleToggleShowDialog(value, id, requestFlag, filter) {
      // console.log(filter)
      // console.log(requestFlag)
      this.current_part = value;
      this.current_organization = id;
      this.exams_filter = filter;
      if (requestFlag) {
        if (value === "terminals") {
          this.updateTerminalsHistoryTable(moment(new Date(this.current_date)).subtract(1, 'days').toString(), this.current_organization)

        }
        else {
          if (this.period_toggler_state !== 'today') {
            this.calendar_state = true;
          }
          else {
            // if (value === "exams") { // return if calendar logic for terminals
            this.updateExamsHistoryTable(moment(new Date(this.current_date)).subtract(1, 'days').toString(), this.current_organization)
            // }
          }
          // if (this.period_toggler_state !== 'today') {
          //   this.calendar_state = true;
          // }
          // else {
          //   if (value === "exams") {
          //     this.updateExamsHistoryTable(moment(new Date(this.current_date)).subtract(1, 'days').toString(), this.current_organization)
          //   }
          //   else {
          //     this.updateTerminalsHistoryTable(moment(new Date(this.current_date)).subtract(1, 'days').toString(), this.current_organization)
          //   }
          // }
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
            date.end,
            this.exams_filter
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
            date.end,
            this.exams_filter
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

    filterCards(orgValues, personnelValues) {
      // console.log(orgValues, personnelValues)
      if (personnelValues !== undefined && personnelValues !== {}) {
        this.getExamsFilteredByPersonnel(personnelValues.pers_id)
      }
      // console.log(this.personnelFilterValues)
      this.visibleOrganizationsList = [];
      if (orgValues.length > 0 || personnelValues !== undefined || personnelValues !== {}) {
        if (personnelValues === undefined || personnelValues === {}) {
          this.organizationsList.map((org) => {
            if (orgValues.includes(org.organization_name)) {
              this.visibleOrganizationsList.push(org);
            }
          });
        } else {
          if (orgValues.length === 0) {
            this.organizationsList.map((org) => {
              if (this.personnelFilterValues.includes(org.organization_name)) {
                this.visibleOrganizationsList.push(org);
              }
            })
          }
          else {
            this.organizationsList.map((org) => {
              if (this.personnelFilterValues.includes(org.organization_name) && orgValues.includes(org.organization_name)) {
                this.visibleOrganizationsList.push(org);
              }
            })
          }
        }

        this.organizationsList.map((org) => {
          if (orgValues.includes(org.organization_name) && this.personnelFilterValues.includes(org.organization_name)) {
            this.visibleOrganizationsList.push(org);
          }
        });
      } else {
        this.visibleOrganizationsList = this.organizationsList;
      }
      this.filter_state = false;
      this.filterValues = orgValues;
    },

    // async getExamsFilteredByPersonnel(pers_id) {
    //   const date = this.preparePeriod({ from: this.first_date, to: this.current_date }, true);
    //   try {
    //     var response;
    //     response = await getExamsHistoryForOrganizationByPeriodPersonnel(
    //       this.user_id,
    //       this.current_organization,
    //       pers_id,
    //       date.start,
    //       date.end,
    //     );
    //     let organizationNames = [];
    //     const exams = response.data;
    //     if (organizationNames.length > 0) {
    //       for (var i = 0; i < exams.length; i++) {
    //         if (!organizationNames.includes(exams[i].organization_name))
    //           organizationNames.push(exams[i].organization_name)
    //       }
    //     }
    //     this.personnelFilterValues =  organizationNames;
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },

    async updateExamCard() {
      try {
        var response;
        // if (this.user_role === Role.Admin) {
        if (this.user_organization_id === "null") {
          if (this.organization_toggler_state === "summary") {
            response = await getAllOrganizationsStats(
              this.user_id,
              this.first_date,
              this.current_date,
              true
            );
          }
          else {
            response = await getAllOrganizationsStats(
              this.user_id,
              this.first_date,
              this.current_date,
              false
            );
          }
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
        if (this.loading_state === false) {
          this.organizationNamesList = [];
          this.organizationsList.map((org) => {
            this.organizationNamesList.push(org.organization_name);
          });
        }
        if (this.user_organization_id === 'null' && this.organization_toggler_state === "summary") {
          this.organizationsList[0].organization_name = "Все организации";
        }
        this.visibleOrganizationsList = this.organizationsList;
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

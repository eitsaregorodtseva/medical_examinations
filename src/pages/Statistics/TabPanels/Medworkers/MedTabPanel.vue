<template>
  <div class="fit row wrap q-pl-xs q-gutter-md">
    <div>
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
    <workload-table />
  </div>

  <filter-modal
    v-model="filter_state"
    class="self-end"
    :options="organizationNamesList"
    :values="filterValues"
    @filter-cards="filterCards"
  />
</template>

<script>
import MedworkerCard from './MedworkerCard.vue';
import OrganizationToggler from './OrganizationToggler.vue';
import PeriodToggler from './PeriodToggler.vue';
import FilterButton from './FilterButton.vue';
import FilterModal from "./FilterModal.vue";
import WorkloadTable from './WorkloadTable.vue'
import moment from "moment";
import { ref } from "vue";
import { getMedworkersStats } from '@/api/medworkers.api';
export default {
  components: {
    MedworkerCard,
    OrganizationToggler,
    PeriodToggler,
    FilterButton,
    FilterModal,
    WorkloadTable
  },
  data() {
    return {
      //togglers
      organization_toggler_state: ref("summary"),
      period_toggler_state: ref("month"),

      //organizations
      organizationsList: [],
      visibleOrganizationsList: [],

      //calendar
      current_date: moment().format("YYYY-MM-DD"),
      first_date: moment().format("YYYY-MM-DD"),

      //filter
      filterValues: [],
      organizationNamesList: [],

      //states
      filter_state: false,
      loading_state: true,

      user_id: null,
    }
  },
  mounted() {
    this.populateDataFromStorage(),
      this.handleChangePeriod('month'),
      this.handleChangeOrganization('summary');
  },
  methods: {
    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
    },

    handleChangeOrganization(organization_toggler_state) {
      this.organization_toggler_state = organization_toggler_state;
      this.loading_state = true;
      this.filterValues = [];
      if (organization_toggler_state !== 'workload') {
        this.updateExamCard();
      }
      else {
        this.updateWorkloadTable();
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

    async updateWorkloadTable() {
      try {
        this.loading_state = false;
      } catch(err) {
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
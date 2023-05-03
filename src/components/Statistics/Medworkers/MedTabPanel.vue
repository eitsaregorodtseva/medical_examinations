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
      <medworker-card />
    </div>
  </div>
</template>

<script>
import MedworkerCard from './MedworkerCard.vue';
import OrganizationToggler from './OrganizationToggler.vue';
import PeriodToggler from './PeriodToggler.vue';
import FilterButton from '../components/FilterButton.vue';
export default {
  components: {
    MedworkerCard,
    OrganizationToggler,
    PeriodToggler,
    FilterButton
  },
  data() {
    return {

    }
  }
}
</script>
<style scoped>
.q-btn .q-focus-helper {
  display: none;
}
</style>

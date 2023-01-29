<template>
  <div>
    <div class="col">
      <div class="q-py-md row q-gutter-md">
        <organization-toggler
          :organization-toggler-state="organizationTogglerState"
          @change-organization="changeOrganization"
        />
      <!-- <period-toggler
        @change-period="handleChangePeriod"
      />  -->
      </div>
    </div>
    <div>
      <filter-button 
        :organization-toggler-state="organizationTogglerState"
        @update-filter-state="$emit('update-filter-state')"
      />
    </div>
  </div>
</template>
<script>
import OrganizationToggler from "./OrganizationToggler.vue";
import PeriodToggler from "./PeriodToggler.vue";
import FilterButton from "./FilterButton.vue";
export default {
  components: {
    OrganizationToggler,
    PeriodToggler,
    FilterButton
  },
  props: {
    organizationTogglerState: {
        type: String,
        default: 'summary',
    },
    periodTogglerState: {
        type: String,
        default: 'today',
    }
},
  emits: ['change-organization', 'update-filter-state'],
  data() {
    return {
        organization_state: 'summary',
    }
  },

  methods: {
    changeOrganization(val) {
        console.log(val)
        this.$emit('change-organization', val)
    }
  }
}
</script>
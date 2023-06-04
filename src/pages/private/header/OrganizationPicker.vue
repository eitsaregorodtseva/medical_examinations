<template>
  <q-select
    v-model="organization"
    filled
    dense
    label="Организация"
    :options="organizationOptions"
    option-value="id"
    option-label="name"
    style="width: 250px"
    use-input
    input-debounce="0"
    @update:model-value="OrganizationChangeValueHandler"
    @filter="organizationFilterFunc"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          Не найдено
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { getAllOrganizations } from '@/api/organizations.api.js'

export default {
  data () {return {
    organization: this.$store.chosenOrganization,
    organizationOptions : null,
    receivedOrgOptions: null,
    user_id : this.$store.state.user.id,
    user_organization_id: this.$store.state.user.organization_id,
  }},
  mounted() {
    this.getOrganizationsList()
  },
  methods: {
    organizationFilterFunc (val, update) {
        if (val === '') {
          update(() => {
            this.organizationOptions = this.receivedOrgOptions
          })
        } else {
          update(() => {
            const needle = val.toLowerCase()
            this.organizationOptions = this.receivedOrgOptions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          })
        }
    },
    async getOrganizationsList() {
      try {
        var response
        response = await getAllOrganizations(this.user_id)
        this.receivedOrgOptions = response.data
        this.organizationOptions = this.receivedOrgOptions
      } catch (err) {
        console.log(err)
      }
    },
    OrganizationChangeValueHandler(){
      if (this.organization) {
        this.$store.commit('chooseOrganization', this.organization)
      } else {
        this.$store.commit('chooseOrganization', this.organization)
      }
    },
  }


}
</script>

<style>

</style>

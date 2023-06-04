<template>
  <q-btn-toggle
    v-if="user_organization_id === '' || user_organization_id === 'null'"
    v-model="model"
    toggle-color="dark"
    no-caps
    :options="[
      { label: 'Всего', value: 'summary' },
      { label: 'Организации', value: 'organizations' },
    ]"
    style="border-radius: 5px;"
    @click="$emit('change-organization', model)"
  />
</template>
<script>
import { ref } from 'vue';
import { Role } from '../../../constants/role';

export default {
  emits: ['change-organization'],
  data() {
    return {
      Role,
      model: ref('summary'),
      role: this.$store.state.user.role,
      user_organization_id: this.$store.state.user.organization_id ?? '',
    }
  },
}
</script>
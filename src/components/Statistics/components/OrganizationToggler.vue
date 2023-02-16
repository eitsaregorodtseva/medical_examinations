<template>
  <q-btn-toggle
    v-if="role === Role.Admin"
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
import { Role } from '../../../helpers/role';

export default {
  emits: ['change-organization'],
  data() {
    return {
      Role,
      model: ref('summary'),
      role: sessionStorage.getItem('user_role'),
    }
  },
}
</script>
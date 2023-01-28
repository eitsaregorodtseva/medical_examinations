<template>
  <q-btn-toggle
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

export default {
    emits: ['change-organization'],
    data() {
        return {
            model: ref('summary')
        }
    },
}
</script>
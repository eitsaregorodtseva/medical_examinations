<template>
  <q-btn-toggle
    v-model="model"
    toggle-color="dark"
    no-caps
    :options="[
      { label: 'Сегодня', value: 'today' },
      { label: 'Месяц', value: 'month' },
      { label: 'Год', value: 'year' },
    ]"
    style="border-radius: 5px;"
    @click="$emit('change-period', model)"
  />
</template>
<script>
import { ref } from 'vue';

export default {
    emits: ['change-period'],
    data() {
        return {
            model: ref('today')
        }
    },
}
</script>
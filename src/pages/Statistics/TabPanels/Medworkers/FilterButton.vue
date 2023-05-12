<template>
  <div
    v-if="organizationTogglerState === 'medworkers'" 
    class="col-4 q-py-md q-mr-lg"
  > 
    <q-btn
      style="float: right"
      flat
      icon="filter_list"
      no-caps
      @click="$emit('update-filter-state')"
    >
      Фильтры
    </q-btn>
  </div>
</template>
<script>

export default {
    props: {
        organizationTogglerState: {
            type: String,
            default: 'summary'
        }
    },
    emits: ['update-filter-state'],
}
</script>
<style scoped>
.q-btn ::v-deep(.q-icon) {
  margin-right: 10px;
}
</style>
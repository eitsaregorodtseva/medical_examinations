<template>
  <q-tabs role="tab"
    :model-value="modelValue"
    dense
    outside-arrows
    mobile-arrows
    active-color="white"
    active-bg-color="dark"
    active-radius="20px"
    indicator-color="transparent"
    align="justify"
    style="width: 90%"
    no-caps
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <template
      v-for="(menuItem, index) in navigationMenu"
      :key="index"
    >
      <q-tab
        :name="menuItem.name"
        :label="menuItem.label"
      />
    </template>
  </q-tabs>
</template>
<script>

export default {
    props: {
    modelValue: {
      type: String,
      default: 'main'
    },
    navigationMenu: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: {
    'update:modelValue': () => { return true }
  },
}
</script>
<style scoped>
.q-tabs--dense .q-tab {
    border-radius: 5px;
}
</style>
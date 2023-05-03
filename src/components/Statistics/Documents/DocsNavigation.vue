<template>
  <q-tabs
    :model-value="modelValue"
    dense
    outside-arrows
    mobile-arrows
    active-color="white"
    active-bg-color="dark"
    active-radius="20px"
    indicator-color="transparent"
    align="justify"
    style="width: 91%"
    no-caps
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <template
      v-for="(menuItem, index) in docsList"
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
      default: 'exams_log'
    }
  },
  emits: {
    'update:modelValue': () => { return true }
  },
    data() {
        return {
          docsList: [
    {
        name: "exams_log",
        label: "Журнал осмотров",
    },
    {
        name: "sobriety_protocol",
        label: "Протокол трезвости",
        
    },
    {
        name: "ref_doctor",
        label: "Напраление на врача",
        
    },
    {
        name: "ready_documents",
        label: "Готовые документы",
        
    },
]
        }
    },

}
</script>
<style scoped>
.q-tabs--dense .q-tab {
    border-radius: 5px;
}
</style>
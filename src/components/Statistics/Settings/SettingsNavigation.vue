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
      v-for="(menuItem, index) in settingsList"
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
      default: 'exams'
    }
  },
  emits: {
    'update:modelValue': () => { return true }
  },
  data() {
    return {
      settingsList: [
        {
          name: "organizations",
          label: "Организации",
        },
        {
          name: "exams",
          label: "Осмотры",
        },
        {
          name: "terminals",
          label: "Терминалы",
        },
        {
          name: "appliances",
          label: "Приборы",
        },
        {
          name: "medworker",
          label: "Медработник",
        },
        {
          name: "1C",
          label: "1С",
        },
        {
          name: "applications",
          label: "Заявки",
        },
        {
          name: "printers",
          label: "Принтеры",
        },
        {
          name: "cameras",
          label: "Камеры",
        },
        {
          name: "network",
          label: "Сеть",
        },
        {
          name: "access",
          label: "Доступ",
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
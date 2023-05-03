<template>
  <settings-navigation
    v-model="tab"
    class="q-mt-md"
  />
  <q-tab-panels   
    v-model="tab"
  >
    <q-tab-panel
      name="exams"
    />
    <q-tab-panel
      name="terminals"
    />
    <q-tab-panel
      name="appliances"
    />
    <q-tab-panel
      name="medworker"
    />
    <q-tab-panel
      name="1C"
    />
    <q-tab-panel
      name="applications"
    />
    <q-tab-panel
      name="printers"
    />
    <q-tab-panel
      name="cameras"
    />
    <q-tab-panel
      name="network"
    />
    <q-tab-panel
      name="access"
    />
  </q-tab-panels>
</template>
<script>
import { ref } from "vue";
import SettingsNavigation from "./SettingsNavigation.vue";
export default {
  components: {
    SettingsNavigation,
  },
  data() {
    return {
      tab: ref("exams"),
    };
  },
};
</script>
<style scoped>
.q-tabs--dense .q-tab {
  border-radius: 5px;
}

.q-tab-panel {
  padding-left: 0px;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
</style>
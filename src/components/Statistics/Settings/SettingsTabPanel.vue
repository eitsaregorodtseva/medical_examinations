<template>
  <settings-navigation
    v-model="tab"
    class="q-mt-md"
  />
  <q-tab-panels   
    v-model="tab"
  >
    <q-tab-panel
      name="organizations"
    >
      <organization-settings />
    </q-tab-panel>
    <q-tab-panel
      name="terminals"
    >
      <terminal-settings />
    </q-tab-panel>
    <q-tab-panel
      name="access"
    >
      <access-settings />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script>
import { ref } from "vue";
import SettingsNavigation from "./SettingsNavigation.vue";
import OrganizationSettings from "./Tables/OrganizationSettings.vue";
import TerminalSettings from "./Tables/TerminalSettings.vue";
import AccessSettings from "./Tables/AccessSettings.vue";
export default {
  components: {
    SettingsNavigation,
    OrganizationSettings,
    TerminalSettings,
    AccessSettings
  },
  data() {
    return {
      tab: ref("organizations"),
    };
  },
};
</script>
<style scoped>
.q-tabs--dense .q-tab {
  border-radius: 5px;
}

.q-tab-panel {
  padding-top: 50px;
  overflow: hidden;
}
</style>
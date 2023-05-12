<template>
  <navigation-navbar
    v-model="tab"
    :navigation-menu="navigationList"
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
import OrganizationSettings from "./Tables/OrganizationSettings.vue";
import TerminalSettings from "./Tables/TerminalSettings.vue";
import AccessSettings from "./Tables/AccessSettings.vue";
import NavigationNavbar from "@/components/NavigationNavbar/NavigationNavbar.vue";

export default {
  components: {
    OrganizationSettings,
    TerminalSettings,
    AccessSettings,
    NavigationNavbar
  },
  data() {
    return {
      tab: ref("organizations"),
      navigationList: [
        {
          name: "organizations",
          label: "Организации",
        },
        {
          name: "terminals",
          label: "Терминалы",
        },
        {
          name: "access",
          label: "Доступ",
        },
      ]
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
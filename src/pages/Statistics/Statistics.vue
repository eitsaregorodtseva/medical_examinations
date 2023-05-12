<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <div
      class="q-pa-md"
    >
      <navigation-navbar
        v-model="tab"
        :navigation-menu="thisRolesMenu"
      />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="main">
          <main-tab-panel />
        </q-tab-panel>
        <q-tab-panel name="documents">
          <docs-tab-panel />
        </q-tab-panel>
        <q-tab-panel
          name="1c"
          style="padding-top: 50px; padding-left: 16px;
  overflow: hidden;"
        >
          <consulting-table />
        </q-tab-panel>
        <q-tab-panel name="medworkers">
          <med-tab-panel />
        </q-tab-panel>
        <q-tab-panel name="applications">
          <applications-tab-panel />
        </q-tab-panel>
        <q-tab-panel name="settings">
          <settings-tab-panel />
        </q-tab-panel>
        <q-tab-panel name="help">
          <info-docs-tab-panel />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import MainTabPanel from "./TabPanels/Main/MainTabPanel.vue";
import DocsTabPanel from "./TabPanels/Documents/DocsTabPanel.vue";
import SettingsTabPanel from "./TabPanels/Settings/SettingsTabPanel.vue";
import InfoDocsTabPanel from "./TabPanels/Information/InfoDocsTabPanel.vue";
import MedTabPanel from "./TabPanels/Medworkers/MedTabPanel.vue";
import ApplicationsTabPanel from "./TabPanels/Applications/ApplicationsTabPanel.vue";
import ConsultingTable from "./TabPanels/Consulting/ConsultingTable.vue"
import NavigationNavbar from "@/components/NavigationNavbar/NavigationNavbar.vue";
import { Role } from '@/constants/role';

const navigationList = [
    {
        name: "main",
        label: "Главная",
        roles: [
            Role.Admin,
            Role.Dispatcher,
        ],
    },
    {
        name: "documents",
        label: "Документы",
        roles: [
            Role.Admin,
            Role.Dispatcher,
        ],
    },
    {
        name: "1c",
        label: "1С",
        roles: [
            Role.Admin,
            Role.Dispatcher,
        ],
    },
    {
        name: "medworkers",
        label: "Медперсонал",
        roles: [
            Role.Admin,
        ],
    },
    {
        name: "applications",
        label: "Заявки",
        roles: [
            Role.Admin,
            Role.Dispatcher
        ],
    },
    {
        name: "settings",
        label: "Настройки",
        roles: [
            Role.Admin,
            Role.Dispatcher
        ],
    },
    {
        name: "help",
        label: "Справка",
        roles: [
            Role.Admin,
            Role.Dispatcher
        ],
    },
]

export default {
  components: {
    MainTabPanel,
    DocsTabPanel,
    InfoDocsTabPanel,
    SettingsTabPanel,
    MedTabPanel,
    ApplicationsTabPanel,
    ConsultingTable,
    NavigationNavbar
},
  data() {
    return {
      tab: ref("main"),
      role: sessionStorage.getItem('user_role'),
    };
  },
  computed: {
        thisRolesMenu() {
            return navigationList.filter(i => i.roles.indexOf(this.role) > -1)
        },
    }
};
</script>
<style scoped>
.q-tab-panel {
    padding-left: 0px;
}
</style>
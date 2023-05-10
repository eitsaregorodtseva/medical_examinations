<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <div
      class="q-pa-md"
    >
      <navigation-navbar 
        v-model="tab"
      />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="main">
          <main-tab-panel />
        </q-tab-panel>
        <q-tab-panel name="documents">
          <docs-tab-panel />
        </q-tab-panel>
        <q-tab-panel name="1c" />
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
import MainTabPanel from "@/components/Statistics/MainTabPanel.vue";
import NavigationNavbar from "../components/Statistics/components/NavigationNavbar.vue";
import DocsTabPanel from "../components/Statistics/Documents/DocsTabPanel.vue";
import SettingsTabPanel from "../components/Statistics/Settings/SettingsTabPanel.vue";
import InfoDocsTabPanel from "../components/Statistics/Information/InfoDocsTabPanel.vue";
import MedTabPanel from "../components/Statistics/Medworkers/MedTabPanel.vue";
import ApplicationsTabPanel from "../components/Statistics/ApplicationsTabPanel.vue";
export default {
  components: {
    MainTabPanel,
    NavigationNavbar,
    DocsTabPanel,
    InfoDocsTabPanel,
    SettingsTabPanel,
    MedTabPanel,
    ApplicationsTabPanel
},
  data() {
    return {
      tab: ref("main"),
    };
  },
};
</script>
<style scoped>
.q-tab-panel {
    padding-left: 0px;
}
</style>
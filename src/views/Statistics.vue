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
        <q-tab-panel name="medworkers" />
        <q-tab-panel name="applications" />
        <q-tab-panel name="settings" />
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
import InfoDocsTabPanel from "../components/Statistics/InfoDocsTabPanel.vue";
import DocsTabPanel from "../components/Statistics/DocsTabPanel.vue";

export default {
  components: {
    MainTabPanel,
    NavigationNavbar,
    DocsTabPanel,
    InfoDocsTabPanel
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
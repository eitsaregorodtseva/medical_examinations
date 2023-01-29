<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <div
      class="q-pa-md q-ml-xl"
    >
      <navigation-navbar 
        v-model="tab"
      />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="main">
          <main-tab-panel />
        </q-tab-panel>
        <q-tab-panel name="documents" />
        <q-tab-panel name="1c" />
        <q-tab-panel name="medworkers" />
        <q-tab-panel name="applications" />
        <q-tab-panel name="settings" />
        <q-tab-panel name="help" />
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import MainTabPanel from "@/components/Statistics/MainTabPanel.vue";
import NavigationNavbar from "../components/Statistics/NavigationNavbar.vue";

export default {
  components: {
    MainTabPanel,
    NavigationNavbar
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
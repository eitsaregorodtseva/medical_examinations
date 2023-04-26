<template>
  <docs-navigation
    v-model="tab"
    class="q-mt-md"
  />
  <q-tab-panels   
    v-model="tab"
  >
    <q-tab-panel
      name="exams_log"
    >
      <exams-report-form />
    </q-tab-panel>
    <q-tab-panel
      name="sobriety_protocol"
    >
      <sobriety-protocol />
    </q-tab-panel>
    <q-tab-panel
      name="ref_doctor"
    />
    <q-tab-panel
      name="ready_documents"
    />
  </q-tab-panels>
</template>
<script>
import { ref } from "vue";
import DocsNavigation from './components/DocsNavigation.vue';
import ExamsReportForm from "../ReportsExport/ExamsReportForm.vue";
import SobrietyProtocol from "./Documents/SobrietyProtocol.vue";
export default {
  components: {
    DocsNavigation,
    ExamsReportForm,
    SobrietyProtocol
  },
  data() {
    return {
      tab: ref("exams_log"),
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
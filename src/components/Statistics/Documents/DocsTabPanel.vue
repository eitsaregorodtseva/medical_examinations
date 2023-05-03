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
    >
      <appointment-doctor />
    </q-tab-panel>
    <q-tab-panel
      name="ready_documents"
    >
      <documents-list />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script>
import { ref } from "vue";
import DocsNavigation from './DocsNavigation.vue';
import ExamsReportForm from "../../ReportsExport/ExamsReportForm.vue";
import SobrietyProtocol from "./SobrietyProtocol.vue";
import AppointmentDoctor from "./AppointmentDoctor.vue";
import DocumentsList  from "./DocumentsList.vue"
export default {
  components: {
    DocsNavigation,
    ExamsReportForm,
    SobrietyProtocol,
    AppointmentDoctor,
    DocumentsList
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
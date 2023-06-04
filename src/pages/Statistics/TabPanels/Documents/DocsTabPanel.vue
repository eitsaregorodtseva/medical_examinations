<template>
  <navigation-navbar
    v-model="tab"
    :navigation-menu="navigationList"
    class="q-mt-md"
  />
  <q-tab-panels v-model="tab">
    <q-tab-panel name="exams_log">
      <exams-report-form />
    </q-tab-panel>
    <q-tab-panel name="sobriety_protocol">
      <sobriety-protocol />
    </q-tab-panel>
    <q-tab-panel name="ref_doctor">
      <appointment-doctor />
    </q-tab-panel>
    <q-tab-panel
      style="display: block;"
      name="ready_documents"
    >
      <div class="q-pa-md">
        <div>
          <documents-list />
        </div>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script>
import { ref } from "vue";
import ExamsReportForm from "./components/ReportsExport/ExamsReportForm.vue";
import SobrietyProtocol from "./components/SobrietyProtocol.vue";
import AppointmentDoctor from "./components/AppointmentDoctor.vue";
import DocumentsList from "./components/DocumentsList.vue";
import NavigationNavbar from "@/components/NavigationNavbar/NavigationNavbar.vue";


export default {
  components: {
    ExamsReportForm,
    SobrietyProtocol,
    AppointmentDoctor,
    DocumentsList,
    NavigationNavbar
  },
  data() {
    return {
      tab: ref("exams_log"),
      navigationList: [
        {
          name: "exams_log",
          label: "Журнал осмотров",
        },
        {
          name: "sobriety_protocol",
          label: "Протокол трезвости",

        },
        {
          name: "ref_doctor",
          label: "Направление на врача",

        },
        {
          name: "ready_documents",
          label: "Готовые документы",

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
  padding-left: 0px;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
</style>
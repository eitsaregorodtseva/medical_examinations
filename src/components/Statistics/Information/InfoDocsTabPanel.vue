<template>
  <info-docs-navigation
    v-model="tab"
    class="q-mt-md"
  />
  <q-tab-panels    
    v-model="tab"
  >
    <q-tab-panel
      name="passport"
    >
      <pdf-viewer path="certificate.pdf" />
    </q-tab-panel>
    <q-tab-panel
      name="certificate"
    >
      <pdf-viewer path="certificate.pdf" />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script>
import { ref } from "vue";
import PdfViewer from "../components/PdfViewer.vue";
import InfoDocsNavigation from "./InfoDocsNavigation.vue";
export default {
  components: {
    PdfViewer,
    InfoDocsNavigation
  },
  data() {
    return {
      tab: ref("passport"),
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
}
</style>
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <div
      class="q-pa-md q-ml-xl"
    >
      <q-tabs
        v-model="tab"
        dense
        outside-arrows
        mobile-arrows
        active-color="white"
        active-bg-color="dark"
        active-radius="20px"
        indicator-color="transparent"
        align="justify"
        style="width: 90%"
        :default="200"
        no-caps
      >
        <q-tab
          name="main"
          label="Главная"
        />
        <q-tab
          name="documents"
          label="Документы"
        />
        <q-tab
          name="1c"
          label="1С"
        />
        <q-tab
          name="medworkers"
          label="Медики"
        />
        <q-tab
          name="applications"
          label="Заявки"
        />
        <q-tab
          name="settings"
          label="Настройки"
        />
        <q-tab
          name="help"
          label="Справка"
        />
      </q-tabs>

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
import MainTabPanel from "@/components/Statistics/MainTabPanel.vue";
import { ref } from "vue";

export default {
  components: {
    MainTabPanel,
  },
  data() {
    return {
      tab: ref("main"),
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

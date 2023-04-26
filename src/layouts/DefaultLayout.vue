<template>
  <q-layout view="hHh LpR lfr">
    <q-header
      class="bg-white q-pa-xs"
      style="color: inherit"
    >
      <q-toolbar>
        <q-btn
          v-if="user_role === Role.MedWorker"
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
          @click="showSidebar = !showSidebar"
        />
        <header-logo />
        <header-logout-link />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <navigation-sidebar
        v-if="user_role === Role.MedWorker"
        v-model="showSidebar"
      />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import HeaderLogo from '@/components/header/HeaderLogo.vue'
import HeaderLogoutLink from '@/components/header/HeaderLogoutLink.vue'
import NavigationSidebar from '@/components/NavigationSidebar.vue'
import { Role } from '../helpers/role'
export default {
    components: {
        HeaderLogo,
        HeaderLogoutLink,
        NavigationSidebar,
    },
    data () { 
      return {
      Role,
      showSidebar : true,
      user_role: undefined
    }},
    mounted() {
      this.populateDataFromStorage();
    },
    methods: {
      populateDataFromStorage() {
        this.user_role = sessionStorage.getItem('user_role');
    },
    }
}
</script>

<style scoped>

header {
    height: 4rem;
    width: 100%;
}

main {
    height: 1px;
    min-height: calc(100vh - 4rem);
}


</style>

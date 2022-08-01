<template>
  <q-layout view="hHh LpR lfr">
    <q-header class="bg-white q-pa-xs" style="color: inherit">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="showSidebar = !showSidebar"/>
        <header-logo />
        <header-logout-link />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <navigation-sidebar v-model="showSidebar" />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import HeaderLogo from '@/components/header/HeaderLogo.vue'
import HeaderLogoutLink from '@/components/header/HeaderLogoutLink.vue'
import NavigationSidebar from '@/components/NavigationSidebar.vue'
export default {
    components: {
        HeaderLogo,
        HeaderLogoutLink,
        NavigationSidebar,
    },
    data () { return {
      showSidebar : true
    }}
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

<template>
  <q-layout view="hHh lpr lFf" class="q-pa-md">
    <q-header class="bg-white q-pa-xs q-gutter-xs" style="color: inherit">
      <q-toolbar>
        <header-logo />
        <header-logout-link />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import HeaderLogo from '@/components/header/HeaderLogo.vue'
import HeaderLogoutLink from '@/components/header/HeaderLogoutLink.vue'
export default {
    components: {
        HeaderLogo,
        HeaderLogoutLink,
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

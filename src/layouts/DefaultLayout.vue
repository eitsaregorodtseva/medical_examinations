<template>
  <header class="p-3 d-flex align-items-center justify-content-between">
    <header-logo />
    <header-logout-link />
  </header>
  <main>
    <router-view />
  </main>
</template>

<script>
import HeaderLogo from '@/components/header/HeaderLogo.vue'
import HeaderLogoutLink from '@/components/header/HeaderLogoutLink.vue'
export default {
    components: {
        HeaderLogo,
        HeaderLogoutLink
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

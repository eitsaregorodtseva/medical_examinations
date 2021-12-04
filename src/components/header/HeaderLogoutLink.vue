<template>
  <a
    v-if="userIsLoggedIn"
    href="/auth"
    class="flex-shrink-1 d-flex align-items-center"
    @click="logOut"
  >
    <div class="p-1">Выход</div>
    <i class="fs-5 bi bi-box-arrow-right" />
  </a>
</template>

<script>
export default {
computed: {
    userIsLoggedIn () {
        return this.$route.path != '/auth'
    }
},
methods : {
    logOut() {
        sessionStorage.removeItem('user_id')
    }
}
}
</script>

<style>

</style>
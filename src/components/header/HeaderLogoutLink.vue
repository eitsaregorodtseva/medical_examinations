<template>
  <q-btn
    v-if="userIsLoggedIn"
    no-caps
    flat
    rounded
    label="Выйти"
    @click="logOut"
  />
</template>

<script>
export default {
computed: {
    userIsLoggedIn () {
        return this.$route.path != '/auth' && this.$route.path != '/sms'
    }
},
methods : {
    logOut() {
        sessionStorage.clear()
        this.$router.push('/auth');
    }
}
}
</script>

<style>

</style>
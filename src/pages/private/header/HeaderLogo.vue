<template>
  <q-avatar
    color="dark"
    text-color="white"
    icon="medical_services"
    class="cursor-pointer"
    @click="$router.push('/')"
  />
  <q-toolbar-title>
    <router-link
      to="/"
      class="text-decoration-none"
    >
      Медосмотры
    </router-link>
  </q-toolbar-title>
</template>

<script>
export default {

}
</script>

<style>

#logo {
    height: 50px;
    width: auto;
    margin: 5px;
}
</style>
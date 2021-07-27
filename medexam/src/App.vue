<template>
  <div id='app'>
    <component :is='layout'>
      <router-view/>
    </component>
  </div>
</template>

<script>
import AuthLayout from '@/layouts/AuthLayout';
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'auth') + '-layout';
    }
  },
  components: {
    AuthLayout,
  }
}
</script>

<style lang="scss">
@import 'assets/style.css';
//@import '~materialize-css/dist/css/materialize.min.css';
</style>

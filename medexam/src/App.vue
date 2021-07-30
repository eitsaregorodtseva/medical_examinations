<template>
  <div id='app'>
    <component :is='layout'>
      <router-view/>
    </component>
  </div>
</template>

<script>
import AuthNormalLayout from '@/layouts/AuthNormalLayout';
import AuthErrorLayout from '@/layouts/AuthErrorLayout';
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'auth') + '-layout';
    }
  },
  components: {
    AuthNormalLayout,
    AuthErrorLayout
  }
}
</script>

<style lang="scss">
@import 'assets/style.css';
//@import '~materialize-css/dist/css/materialize.min.css';
</style>

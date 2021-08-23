<template>
  <div id='app'>
    <component :is='layout'>
      <router-view/>
    </component>
  </div>
  <notifications classes="my-notification" position="bottom right" />
</template>

<script>
import DefaultLayout from '@/layouts/DefaultLayout';

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout';
    }
  },
  components: {
    DefaultLayout
  }
}
</script>

<style lang="scss">
@import 'assets/style.css';
//@import '~materialize-css/dist/css/materialize.min.css';
</style>

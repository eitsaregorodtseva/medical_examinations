<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
  <notifications position="bottom right" />
</template>

<script>
import DefaultLayout from '@/components/layouts/DefaultLayout';
import AuthLayout from '@/components/layouts/AuthLayout';

export default {
  components: {
    DefaultLayout,
    AuthLayout
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout';
    }
  }
}
</script>

<style lang="scss">
#app {
  min-width: 200px;
}

</style>

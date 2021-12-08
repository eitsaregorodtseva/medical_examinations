<template>
  <div id='app'>
    <component :is='layout'>
      <router-view/>
    </component>
  </div>
  <notifications position="bottom right" />
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
</style>

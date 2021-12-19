<template>
  <div class="row items-center justify-center fit">
    <q-responsive
      :ratio="4/3"
      :class="isError ? 'app_error' : 'app_normal'"
      class="col"
      style="max-width:600px"
    >
      <div class="q-pa-lg">
        <slot />
      </div>
    </q-responsive>
  </div>
</template>

<script>
export default {
    props : {isError: Boolean}
}
</script>

<style>

</style>

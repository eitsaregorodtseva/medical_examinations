<template>
  <div class="q-pa-sm fit">
    <div class="q-gutter-md fit row justify-center items-center">
      <div class="col" style="max-width:600px">
        <q-responsive
          class=""
          style="max-width:600px; min-height: 300px;"
          :ratio="4/3"
          :class="isError ? 'app_error' : 'app_normal'"
        >
          <div class="q-pa-md">
            <slot />
          </div>
        </q-responsive>
        <div class="q-mt-md row items-start justify-center">
          <slot name="below-box" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props : {isError: Boolean}
}
</script>

<style>

</style>

<template>
  <div class="col-2 text-center">
    <q-btn
      style="min-width: 90px; width: 90px; text-transform: capitalize; font-size: 12px;"
      color="dark"
      no-caps
      @click="$emit('change-month', dates)"
    >
      {{ title }}
    </q-btn>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    dates: {
      type: String,
      default: ""
    }
  },
  emits: ['change-month']
}
</script>
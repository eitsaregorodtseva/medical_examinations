<template>
  <div class="col-2 text-center">
    <q-btn 
      style="min-width: 100px; width: 100px"
      color="dark"
      no-caps
    >
      <div>{{ title }}</div>
    </q-btn>
    
    <div> {{ count }}</div>
  </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        count: {
            type: String,
            default: ""
        },
    }
}
</script>
<template>
  <div>{{ title }}</div>
  <div> {{ count }}</div>
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
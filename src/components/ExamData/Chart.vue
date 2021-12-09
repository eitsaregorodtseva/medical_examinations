<template>
    <v-chart class="chart" :option="options" />
</template>

<script>
import VChart, { THEME_KEY } from "vue-echarts";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Chart",
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: "light"
  },
  props: {
    options: {
      type: Object,
      required: true,
    }
  },
});


</script>

<style scoped>
.chart {
  height: 300px; 
  width: 600px;

}
</style>

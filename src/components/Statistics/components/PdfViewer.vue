<template>
  <div
    class="q-mt-md"
    style="display: flex; justify-content: center;"
  >
    <div
      style="max-height: 65vh; overflow: auto;"
    >
      <pdf
        style="width: 90%;"
        :src="path"
      />
    </div>
  </div>
</template>
<script>
import pdf from 'pdfvuer';
export default {
  components: {
    pdf,
  },
  props: {
    path: {
      type: String,
      default: ''
    }
  },
};
</script>
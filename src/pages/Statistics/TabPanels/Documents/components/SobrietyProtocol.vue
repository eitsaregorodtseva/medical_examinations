<template>
  <generate-documents-form @generate-document="handleGenerateDocument" />
</template>
<script>
import GenerateDocumentsForm from './GenerateDocumentsForm.vue';
export default {
  components: {
    GenerateDocumentsForm
  },
  methods: {
    handleGenerateDocument(data) {
      console.log(data);
    }
  }
}
</script>
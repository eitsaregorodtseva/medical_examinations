<template>
  <generate-documents-form @generate-document="handleGenerateDocument" />
</template>
<script>

import GenerateDocumentsForm from './GenerateDocumentsForm.vue';
import { getDataForGenerate } from '@/api/personnel.api.js';
import { generateDocument } from './createProtocol'
import { DocumentType } from "../../../../../constants/documents";
export default {
  components: {
    GenerateDocumentsForm
  },
  data() {
    return {
      user_id: this.$store.state.user.id
    }
  },
  methods: {
    handleGenerateDocument(data) {
      this.getDocumentData(data.pers_id);
    },
    async getDocumentData(pers_id) {
      try {
        const response = await getDataForGenerate(
          this.user_id,
          pers_id,
          DocumentType.Protocol
        )
        console.log(response.data)
        generateDocument(response.data)
      }
      catch (err) {
        console.log(err)
      }
    },
  }
}
</script>
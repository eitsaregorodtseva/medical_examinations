<template>
  <generate-documents-form
    form-type="appointment"
    @generate-document="handleGenerateDocument"
  />
</template>
<script>

import GenerateDocumentsForm from './GenerateDocumentsForm.vue';
import { getDataForGenerate } from '@/api/personnel.api.js';
import { DocumentType } from "@/constants/documents";
import { generateDocument } from './createAppointment'
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
      this.getDocumentData(data);
    },

    async getDocumentData(data) {
      try {
        const response = await getDataForGenerate(
          this.user_id,
          data.pers_id,
          DocumentType.Appointment,
          data.medical_institution ?? null
        )
        generateDocument({...response.data, medical_institution: data.medical_institution})
      }
      catch (err) {
        console.log(err)
      }
    },
  }
}
</script>
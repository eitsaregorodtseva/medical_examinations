<template>
  <div style="width: 50%">
    <q-form
      class="column q-gutter-md"
      @submit="handleSubmitForm"
    >
      <div class="h6">
        Выберите сотрудника:
      </div>
      <q-select
        v-model="selectValue"
        :options="selectOptions"
        :option-label="option => GetFullName(option.second_name, option.first_name, option.father_name)"
        class="col-8"
        outline
        use-input
        stack-label
        input-debounce="0"
        label="Сотрудники"
        @filter="handleFilterOptions"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              Нет результатов
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        v-if="formType"
        v-model="medical_institution"
        label="Медицинская организация"
      />
      <div>
        <q-btn
          color="dark"
          no-caps
          type="submit"
        >
          Сформировать
        </q-btn>
      </div>
    </q-form>
  </div>
</template>
<script>
import { fullName } from '@/constants/names'
import { getPersonnelListWithoutOrganization } from '@/api/personnel.api.js'
import { getPersonnelList } from '../../../../../api/personnel.api';
export default {
  props: {
    formType: {
      type: String,
      default: ''
    }
  },
  emits: ['generate-document'],
  data() {
    return {
      selectOptions: [],
      options: [],
      selectValue: null,
      medical_institution: null,

      user_id: this.$store.state.user.id,
      organization_id: this.$store.state.user.organization_id,
    }
  },
  mounted() {
    this.getPersonnel();
  },
  methods: {
    async getPersonnel() {
      if (this.organization_id !== 'null') {
        try {
          var response
          response = await getPersonnelList(this.user_id, this.organization_id);
          this.options = response.data
        } catch (err) {
          console.log(err)
        }
      }
      else {
        try {
          response = await getPersonnelListWithoutOrganization(this.user_id);
          this.options = response.data
        } catch (err) {
          console.log(err)
        }
      }
    },

    GetFullName(second, first, father){
      return fullName(second, first, father)
    },

    handleFilterOptions(value, update) {
      update(() => {
        if (value === '') {
          this.selectOptions = this.options;
        }
        else {
          update(() => {
          const needle = value.toLowerCase()
          this.selectOptions = this.options.filter(v => fullName(v.second_name, v.first_name, v.father_name).toLowerCase().indexOf(needle) > -1)
        })
        }
      })
    },
    handleSubmitForm() {
      this.$emit('generate-document', {...this.selectValue, medical_institution: this.medical_institution});
    }
  },
}
</script>
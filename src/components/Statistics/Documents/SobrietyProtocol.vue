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
        :options="options"
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
import { fullName } from '@/helpers/names'
import { getPersonnelList } from '@/api/personnel.api.js'
export default {
  data() {
    return {
      selectOptions: [],
      options: [],
      selectValue: null,

      user_id: null,
      organization_id: null,
    }
  },
  mounted() {
    this.populateDataFromStorage();
    this.getPersonnel();
  },
  methods: {
    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem('user_id')
      this.organization_id = sessionStorage.getItem('user_organization_id')
    },

    async getPersonnel() {
      try {
        var response
        response = await getPersonnelList(this.user_id, this.organization_id);
        this.options = response.data
      } catch (err) {
        console.log(err)
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
          const needle = value.toLowerCase();
          this.selectOptions = this.options.filter(
            v => fullName(v.second_name,  v.first_name, v.father_name).toLowerCase().indexOf(needle) > -1
          );
        }
      })
    },

    handleSubmitForm() {
      console.log(this.selectValue)
    }
  },
}
</script>
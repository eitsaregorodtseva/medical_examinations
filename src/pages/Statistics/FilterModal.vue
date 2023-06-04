<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <q-card
      class="q-pt-md q-px-md"
      style="width: 700px; min-height: 300px"
    >
      <q-card-section class="row">
        <div class="text-h6">
          Фильтры
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="$emit('update:modelValue', false)"
        />
      </q-card-section>
      <q-card-section>
        <div class="h6">
          Выберите организации:
        </div>
        <q-select
          v-model="filterValues"
          :options="filterOptions"
          class="col-8"
          outline
          multiple
          use-chips
          use-input
          stack-label
          input-debounce="0"
          label="Организации"
          @filter="handleFilterOptions"
        >
          <template #append>
            <q-icon
              name="close"
              class="cursor-pointer"
              @click.stop.prevent="filterValues = []"
            />
          </template>
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Нет результатов
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- <div class="h6">
          Выберите водителя:
        </div>
        <q-select
          v-model="valuesPersonnel"
          :options="optionsPersonnel"
          :option-label="option => GetFullName(option.second_name, option.first_name, option.father_name)"
          class="col-8"
          outline
          use-input
          stack-label
          input-debounce="0"
          label="Водители"
          @filter="handleFilterOptions"
        >
          <template #append>
            <q-icon
              name="close"
              class="cursor-pointer"
              @click.stop.prevent="valuesPersonnel = []"
            />
          </template>
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Нет результатов
              </q-item-section>
            </q-item>
          </template>
        </q-select> -->
      </q-card-section>
      <q-card-actions>
        <div class="row q-gutter-md q-mt-xl">
          <q-btn
            color="dark"
            no-caps
            @click="$emit('filterCards', filterValues, valuesPersonnel)"
          >
            Применить
          </q-btn>
          <q-btn
            no-caps
            @click="handleResetFilters"
          >
            Сбросить
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
// import { getPersonnelList } from '@/api/personnel.api.js'
import { fullName } from '@/constants/names'

export default {
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    values: {
      type: Array,
      default() {
        return []
      },
    },
    modelValue: {
      type: Boolean,
      default: false
    },
  },
  emits: {
    filterCards: () => { return true },
    'update:modelValue': () => { return true }
  },
  data() {
    return {
      filterValues: ref(),
      filterOptions: ref(),

      optionsPersonnel: ref(),
      valuesPersonnel: ref(),

      user_id: this.$store.state.user.id,
      organization_id: this.$store.state.user.organization_id,
    }
  },
  mounted() {
    this.filterValues = this.values;
    this.filterOptions = this.options;
    // this.getPersonnel();
  },
  updated() {
    this.filterValues = this.values;
  },
  methods: {
    GetFullName(second, first, father){
      return fullName(second, first, father)
    },

    handleResetFilters() {
      this.filterValues = [];
    },
    handleFilterOptions(value, update) {
      update(() => {
        if (value === '') {
          this.filterOptions = this.options;
        }
        else {
          const needle = value.toLowerCase();
          this.filterOptions = this.options.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          );
        }
      })
    },

    // handleFilterPersonnelOptions(value, update) {
    //   update(() => {
    //     if (value === '') {
    //       this.optionsPersonnel = this.optionsPersonnel;
    //     }
    //     else {
    //       const needle = value.toLowerCase();
    //       this.optionsPersonnel = this.options.filter(
    //         v => v.toLowerCase().indexOf(needle) > -1
    //       );
    //     }
    //   })
    // },

    // async getPersonnel() {
    //   try {
    //     var response = await getPersonnelList(this.user_id, this.organization_id);
    //     this.optionsPersonnel = response.data
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },

  },
}
</script>
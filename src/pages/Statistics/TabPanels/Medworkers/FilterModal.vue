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
          Выберите медработников:
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
          label="Медработники"
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
      </q-card-section>
      <q-card-actions>
        <div class="row q-gutter-md q-mt-xl">
          <q-btn
            color="dark"
            no-caps
            @click="$emit('filterCards', filterValues)"
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
      type : Boolean,
      default : false
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
    }
  },
  mounted() {
    this.filterValues = this.values;
    this.filterOptions = this.options;
  },
  updated() {
    this.filterValues = this.values;
  },
  methods: {
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
    }
  }
}
</script>
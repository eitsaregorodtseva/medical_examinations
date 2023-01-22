<template>
  <q-dialog
    v-model="dialog" 
    persistent
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
          @click="$emit('handle-toggle')"
        />
      </q-card-section>
      <q-card-section>
        <div class="h6">
          Выберите организации:
        </div>
        <q-select
          v-model="modelMultiple"
          class="col-8"
          outline
          multiple
          :options="modelOptions"
          use-chips
          use-input
          stack-label
          input-debounce="0"
          label="Организации"
          @filter="filterFn"
        >
          <template #append>
            <q-icon
              name="close"
              class="cursor-pointer"
              @click.stop.prevent="modelMultiple = []"
            />
          </template>
          <template 
            #no-option
          >
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
            @click="$emit('filter-cards', modelMultiple)"
          >
            Применить
          </q-btn>
          <q-btn @click="resetFilters">
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
        organiz: {
          type: Array,
          default() {
            return []
          },
        }

    },
    emits: ['filter-cards', 'handle-toggle'],
    data() {
        return {
            modelMultiple: ref(),
            modelOptions: ref(),
            dialog: true,
        }   
    },
    mounted() {
      this.modelMultiple = this.organiz;
      this.modelOptions = this.options;
    },
    methods: {
      resetFilters() {
        this.modelMultiple = [];
      },
      filterFn (val, update) {
        update(() => {
          if (val === '') {
            this.modelOptions = this.options
          }
          else {
            const needle = val.toLowerCase()
            this.modelOptions = this.options.filter(
              v => v.toLowerCase().indexOf(needle) > -1
            )
          }
        })
      }
    }
}</script>
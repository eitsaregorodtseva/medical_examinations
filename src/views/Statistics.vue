<!-- eslint-disable vue/require-v-for-key 
  eslint-disable vue/multi-word-component-names -->

<!-- 
TODO
1. спиннер на загрузку +
2. переверстать на row -> column +
3. поведение при сворачивании + 
4. медиа запросы
5. спустить спиннер +
6. календарь в отдельный компонент
7. рефакторинг
-->
<template>
  <q-page>
    <div class="q-pa-md q-ml-xl">
      <q-tabs
        v-model="tab"
        dense
        outside-arrows
        active-color="white"
        active-bg-color="dark"
        active-radius="20px"
        indicator-color="transparent"
        align="justify"
        style="width: 90%"
      >
        <q-tab name="main" label="Главная" />
        <q-tab name="documents" label="Документы" />
        <q-tab name="1c" label="1С" />
        <q-tab name="medworkers" label="Медики" />
        <q-tab name="applications" label="Заявки" />
        <q-tab name="settings" label="Настройки" />
        <q-tab name="help" label="Справка" />
      </q-tabs>

      <q-tab-panels v-model="tab">
        <q-tab-panel name="main">
          <!-- <q-input 
              v-model="search" 
              type="search" 
              label="Поиск"
              style="float: right;"
            >
              <template 
                v-slot:append
              >
                <q-icon name="search" />
              </template>
            </q-input> -->
          <div class="q-py-md row q-gutter-md">
            <q-btn-toggle
              v-model="org_toggler"
              toggle-color="dark"
              :options="[
                { label: 'Всего', value: 'summary' },
                { label: 'Организации', value: 'organizations' },
              ]"
              style="border-radius: 5px"
              @click="handleChangeOrganization"
            />
            <q-btn-toggle
              v-model="model"
              toggle-color="dark"
              :options="[
                { label: 'Сегодня', value: 'today' },
                { label: 'Месяц', value: 'month' },
                { label: 'Год', value: 'year' },
              ]"
              style="border-radius: 5px"
              @click="handleChangePeriod"
            />
            <q-btn v-if="org_toggler === 'organizations'">Фильтры</q-btn>
          </div>

          <q-dialog>
            <q-select
              v-model="modelMultiple"
              class="col-8"
              outline
              multiple
              :options="options"
              use-chips
              stack-label
              label="Выбрать организации"
              @update:model-value="filterCards"
            >
              <template #append>
                <q-icon
                  name="close"
                  class="cursor-pointer"
                  @click.stop.prevent="modelMultiple = []"
                  @click="filterCards"
                />
              </template>
            </q-select>
          </q-dialog>

          <div
            v-if="loadingState"
            style="display: flex; justify: center; margin-top: 20%"
          >
            <q-spinner-oval color="dark" size="3em" style="margin: auto" />>
          </div>

          <div v-else>
            <div class="fit row wrap justify-center q-gutter-xl q-mt-xs">
              <div v-for="org in visibleList">
                <custom-card
                  class="col-4"
                  :data="org"
                  :dialog="handleToggleShowDialog"
                />
              </div>
            </div>
          </div>

          <div class="q-pa-sm q-gutter-sm">
            <!-- <calendar-modal
              :dialog_state="show_dialog"
              :date="current_date"
              :periodState="toggler"
              :changePeriod="handleSelectPeriod"
              :range_state="rangeState"
            /> -->
            <q-dialog v-model="show_dialog">
              <q-card class="q-py-sm q-px-md">
                <q-card-section>
                  <div class="text-h6">Выбор даты</div>
                </q-card-section>
                <q-card-section>
                  <q-btn-toggle
                    v-model="toggler"
                    toggle-color="dark"
                    :options="[
                      { label: 'День', value: 'day' },
                      { label: 'Период', value: 'period' },
                    ]"
                    @click="handleSelectPeriod"
                  />
                </q-card-section>
                <q-card-section>
                  <q-date
                    :locale="locale"
                    v-model="current_date"
                    color="dark"
                    :range="rangeState"
                    :options="
                      (date) =>
                        date >= this.current_date.from &&
                        date <= this.current_date.to
                    "
                  />
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn @click="updateOrganizationsTable" color="dark">
                    Показать
                  </q-btn>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <!-- </div> -->
        </q-tab-panel>
        <q-tab-panel name="documents" />
        <q-tab-panel name="1c" />
        <q-tab-panel name="medworkers" />
        <q-tab-panel name="applications" />

        <q-tab-panel name="settings" />

        <q-tab-panel name="help" />
      </q-tab-panels>
    </div>

    <!-- <div class="row q-gutter-md col-6">
      <div class="h6 col">Выберите период</div>
      <q-date class="col" v-model="model" range minimal />
      <input
        v-model="dates.from"
        class="col"
        type="date"
        required
      >
      <input
        v-model="dates.to"
        class="col"
        type="date"
        required
      >
      <button @click="updateOrganizationsTable" class="col btn_normal">Показать</button>
    </div>
    <organizations-statistics-table
      v-show="showTable"
      :organizations="organizationsList"
      :dates="dates"
      :user_id="user_id"
      height="80vh"
    /> -->
  </q-page>
</template>

<script>
// import OrganizationsStatisticsTable from "@/components/OrganizationsStatisticsTable.vue";
import CustomCard from "@/components/Statistics/CustomCard.vue";
import CalendarModal from "@/components/Statistics/CalendarModal.vue";
import {
  getAllOrganizationsStats,
  getOneOrganizationStats,
} from "@/api/organizations.api.js";
import {
  getExamsHistoryAll,
  getExamsHistoryByPeriod,
} from "@/api/exams.api.js";
import moment from "moment";
import { ref } from "vue";
import "@quasar/quasar-ui-qcalendar/dist/index.css";

export default {
  components: {
    // OrganizationsStatisticsTable,
    CustomCard,
    CalendarModal,
  },
  data() {
    return {
      modelMultiple: ref(),
      locale: {
        days: "Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье".split(
          "_"
        ),
        daysShort: "Пн_Вт_Ср_Чт_Пт_Сб_Вс".split("_"),
        months:
          "Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь".split(
            "_"
          ),
        monthsShort: "Янв_Фев_Мар_Апр_Май_Июнь_Июль_Авг_Сен_Окт_Ноя_Дек".split(
          "_"
        ),
      },
      selectedDate: ref(moment()),
      calendar: ref(null),
      startDate: ref(moment()),
      endDate: ref(moment()),
      rangeState: false,
      loadingState: true,

      options: [],
      examsList: [],

      toggler: ref("day"),
      current_date: ref(moment().format("YYYY/MM/DD")),

      org_toggler: ref("summary"),
      tab: ref("main"),
      model: ref("today"),
      show_dialog: false,
      current_data: moment().format("YYYY-MM-DD"),
      first_data: moment().format("YYYY-MM-DD"),
      dates: {
        from: moment().subtract(1, "months").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      },
      user_id: null,
      user_organization_id: null,
      organizationsList: [],
      visibleList: [],
      showTable: false,
      summary: 0,
    };
  },
  mounted() {
    this.populateDataFromStorage(),
      this.handleChangePeriod(),
      this.handleChangeOrganization();
  },
  methods: {
    handleChangeOrganization() {
      if (this.org_toggler === "summary") {
        this.visibleList = [
          { organization_name: "Все организации", exams_count: this.summary },
        ];
      } else {
        this.visibleList = this.organizationsList;
      }
    },

    handleSelectPeriod() {
      this.rangeState = this.toggler == "day" ? false : true;
      this.current_date =
        this.toggler == "day"
          ? moment().format("YYYY/MM/DD")
          : {
              from: moment().subtract(7, "days").format("YYYY/MM/DD"),
              to: moment().format("YYYY/MM/DD"),
            };
    },
    handleToggleShowDialog() {
      this.show_dialog = !this.show_dialog;
    },

    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
      this.user_organization_id = sessionStorage.getItem(
        "user_organization_id"
      );
    },

    async updateOrganizationsTable() {
      this.showTable = true;
      console.log(moment().toISOString());
      let period =
        this.toggler === "day"
          ? {
              date_from: moment(this.current_date).toISOString(),
              date_to: moment(this.current_date).toISOString(),
            }
          : {
              date_from: moment(this.current_date.from).toISOString(),
              date_to: moment(this.current_date.to).toISOString(),
            };
      try {
        var response;
        response = await getExamsHistoryByPeriod(
          this.user_id,
          period.date_from,
          period.date_to
        );
        this.examsList = response.data;
      } catch (err) {
        console.log(err);
      }
    },

    filterCards() {
      this.visibleList = [];
      if (this.modelMultiple.length > 0) {
        this.organizationsList.map((org, index) => {
          if (this.modelMultiple.includes(org.organization_name)) {
            this.visibleList.push(org);
          }
        });
      } else {
        this.visibleList = this.organizationsList;
      }
    },

    handleChangePeriod() {
      this.loadingState = true;
      if (this.model === "month") {
        this.first_data = moment().subtract(30, "days").format("YYYY-MM-DD");
      } else {
        if (this.model === "today") {
          this.first_data = moment().format("YYYY-MM-DD");
        } else {
          this.first_data = moment().subtract(364, "days").format("YYYY-MM-DD");
        }
      }
      this.updateExamCard();
    },

    async updateExamCard() {
      try {
        var response;
        if (this.user_organization_id === "null") {
          response = await getAllOrganizationsStats(
            this.user_id,
            this.first_data,
            this.current_data
          );
        } else {
          response = await getOneOrganizationStats(
            this.user_organization_id,
            this.user_id,
            this.first_data,
            this.current_data
          );
        }
        this.organizationsList = response.data;
        this.visibleList = response.data;
        this.loadingState = false;
        this.summary = 0;
        if (this.loadingState === false) {
          this.organizationsList.map((org, index) => {
            this.options.push(org.organization_name);
            this.summary = this.summary + org.exams_count;
          });
        }
        this.visibleList =
          this.org_toggler === "summary"
            ? [
                {
                  organization_name: "Все организации",
                  exams_count: this.summary,
                },
              ]
            : this.organizationsList;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.q-tabs--dense .q-tab {
  border-radius: 5px;
  text-transform: capitalize;
}
.q-tab-panel {
  padding-left: 0px;
}
.q-btn,
.q-btn-toggle {
  text-transform: capitalize;
}
.q-btn .q-focus-helper {
  display: none;
}
.btn {
  cursor: auto;
}
</style>

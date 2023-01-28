<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <div
      class="q-pa-md q-ml-xl"
    >
      <q-tabs
        v-model="tab"
        dense
        outside-arrows
        mobile-arrows
        active-color="white"
        active-bg-color="dark"
        active-radius="20px"
        indicator-color="transparent"
        align="justify"
        style="width: 90%"
        :default="200"
        no-caps
      >
        <q-tab
          name="main"
          label="Главная"
        />
        <q-tab
          name="documents"
          label="Документы"
        />
        <q-tab
          name="1c"
          label="1С"
        />
        <q-tab
          name="medworkers"
          label="Медики"
        />
        <q-tab
          name="applications"
          label="Заявки"
        />
        <q-tab
          name="settings"
          label="Настройки"
        />
        <q-tab
          name="help"
          label="Справка"
        />
      </q-tabs>

      <q-tab-panels v-model="tab">
        <q-tab-panel name="main">
          <div class="row">
            <div class="q-py-md row q-gutter-md q-mr-md">
              <q-btn-toggle
                v-model="org_toggler"
                toggle-color="dark"
                no-caps
                :options="[
                  { label: 'Всего', value: 'summary' },
                  { label: 'Организации', value: 'organizations' },
                ]"
                style="border-radius: 5px;"
                @click="handleChangeOrganization"
              />
              <q-btn-toggle
                v-model="model"
                toggle-color="dark"
                no-caps
                :options="[
                  { label: 'Сегодня', value: 'today' },
                  { label: 'Месяц', value: 'month' },
                  { label: 'Год', value: 'year' },
                ]"
                style="border-radius: 5px;"
                @click="handleChangePeriod"
              />
            </div>
            <div class="col q-py-md q-mr-md"> 
              <q-btn 
                v-if="org_toggler === 'organizations'"
                style="float: right"
                flat
                icon="filter_list"
                no-caps
                @click="handleToggleFilterDialog"
              >
                Фильтры
              </q-btn>
              <filter-modal 
                v-if="filter_state"
                class="self-end" 
                :options="options" 
                :organiz="modelMultiple"
                @filter-cards="filterCards"
                @handle-toggle="handleToggleFilterDialog"
              />
            </div>
          </div>

          <div
            v-if="loadingState"
            style="display: flex; justify: center; margin-top: 20%"
          >
            <q-spinner-oval
              color="dark"
              size="3em"
              style="margin: auto"
            />
          </div>

          <div v-else>
            <div class="fit row wrap justify-center q-gutter-xl q-mt-xs">
              <div 
                v-for="org in visibleList" 
                :key="org"
              >
                <custom-card
                  class="col-4"
                  :data="org"
                  @show-dialog="handleToggleShowDialog"
                />
              </div>
            </div>
          </div>

          <div class="q-pa-sm q-gutter-sm">
            <calendar-modal 
              v-if="model !== 'today' && show_dialog"
              :date="current_date"
              :period-state="toggler"
              :range_state="rangeState"
              :first_data="first_data"
              :current_data="current_data"
              @change-period="handleSelectPeriod"
              @update-table="updateOrganizationsTable"
              @handle-toggle="handleToggleShowDialog"
            />
            <q-dialog 
              v-model="show_exams" 
              style="width: 3000px; max-width: 3000px;"
            >
              <q-card 
                style="max-width: 3000px" 
                class="q-pa-xs"
              >
                <q-card-section class="q-pa-xs">
                  <q-btn
                    flat
                    icon="west"
                    @click="show_exams = false"
                  />
                </q-card-section>
                <q-card-section class="q-pt-xs">
                  <div v-if="examsList.length > 0">
                    <exams-history-table 
                      :exams="examsList"
                      height="80vh"
                    />
                  </div>
                  <div v-else>
                    <q-spinner-oval
                      color="dark"
                      size="3em"
                      style="margin: auto"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
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
import CustomCard from "@/components/Statistics/CustomCard.vue";
import CalendarModal from "@/components/Statistics/CalendarModal.vue";
import FilterModal from "@/components/Statistics/FilterModal.vue";
import ExamsHistoryTable from "../components/ExamsHistoryTable.vue";
import {
  getAllOrganizationsStats,
  getOneOrganizationStats,
} from "@/api/organizations.api.js";
import {
  getExamsHistoryByPeriod,
} from "@/api/exams.api.js";
import moment from "moment";
import { ref } from "vue";

export default {
  components: {
    FilterModal,
    CustomCard,
    CalendarModal,
    ExamsHistoryTable
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
      rangeState: ref(false),
      loadingState: true,

      options: [],
      examsList: [],
      show_exams: ref(false),

      toggler: ref("day"),
      current_date: ref(moment().format("YYYY/MM/DD")),

      org_toggler: ref("summary"),
      tab: ref("main"),
      model: ref("today"),
      show_dialog: false,
      filter_state: false,
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

    handleSelectPeriod(period) {
      this.toggler = period;
      this.rangeState = this.toggler === "day" ? false : true;
      this.current_date =
        this.toggler == "day"
          ? moment().format("YYYY/MM/DD")
          : {
              from: moment().subtract(7, "days").format("YYYY/MM/DD"),
              to: moment().format("YYYY/MM/DD"),
            };
    },

    handleToggleFilterDialog() {
      this.filter_state = !this.filter_state;
    },

    handleToggleShowDialog() {
      if (this.model !== 'today') {
        this.show_dialog = !this.show_dialog;
      }    
      else {
        this.updateOrganizationsTable(moment(new Date(this.current_data)).subtract(1, 'days').toString())
      }
    },

    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem("user_id");
      this.user_organization_id = sessionStorage.getItem(
        "user_organization_id"
      );
    },

    prepareDate(date) {
      let new_date = new Date(date);
      new_date.setUTCHours(0,0,0,0)
      return new_date.toISOString()
    },

    async updateOrganizationsTable(date_from_modal) {
      this.showTable = true;
      let start_date = typeof date_from_modal === "string" ?
        this.prepareDate(moment(new Date(date_from_modal)).add(1, 'days')) :
        this.prepareDate(moment(new Date(date_from_modal.from)).add(1, 'days'));
      let end_date = typeof date_from_modal === "string" ?
        this.prepareDate(moment(new Date(date_from_modal)).add(2, 'days')) :
        this.prepareDate(moment(new Date(date_from_modal.to)).add(1, 'days'));

      let period =
        this.toggler === "day"
          ? {
              date_from: start_date,
              date_to: end_date,
            }
          : {
              date_from: start_date,
              date_to: end_date,
            };
      try {
        var response;
        response = await getExamsHistoryByPeriod(
          this.user_id,
          period.date_from,
          period.date_to
        );
        this.examsList = response.data;
        if (this.examsList.length > 0) {
          this.show_exams = true;
        }
      } catch (err) {
        console.log(err);
      }
    },

    filterCards(orgs) {
      this.visibleList = [];
      if (orgs.length > 0) {
        this.organizationsList.map((org) => {
          if (orgs.includes(org.organization_name)) {
            this.visibleList.push(org);
          }
        });
      } else {
        this.visibleList = this.organizationsList;
      }
      this.filter_state = false;
            this.modelMultiple = orgs;
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
          this.organizationsList.map((org) => {
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
<style scoped>
.q-tabs--dense .q-tab {
  border-radius: 5px;
  /* text-transform: capitalize; */
}
.q-tab-panel {
  padding-left: 0px;
}
/* .q-btn,
.q-btn-toggle {
  text-transform: capitalize !important;
} */
.q-btn .q-focus-helper {
  display: none;
}
.btn {
  cursor: auto;
}
.q-btn >>> .q-icon {
  margin-right: 10px;
}
</style>

<template>
  <q-inner-loading :showing="!dataLoaded">
    <q-spinner
      color="primary"
      size="3em"
    />
  </q-inner-loading>
  <div
    v-if="dataLoaded"
    class="container"
  >
    <div class="row">
      <div class="col-xl-6">
        <div
          id="pers_data"
          class="container"
        >
          <div class="row">
            <div
              id="img"
              class="col-md-3"
            />
            <div
              id="pers_data_txt"
              class="col-md-3"
            >
              <div class="d-flex flex-column">
                <div class="h4">
                  {{ fullName }}
                </div>
                <div class="m-1">
                  Пол: {{ exam_data.gender }}
                </div>
                <div class="m-1">
                  Возраст: {{ exam_data.age }}
                </div>
              </div>
            </div>
            <q-card class="col-md-3 mt-2 p-2 d-flex flex-column" v-if="exam_data.admittance !== null">
              <q-badge class="align-self-center" v-if="exam_data.admittance" color="positive" text-color="black">Допущен</q-badge>
              <q-badge class="align-self-center" v-if="!exam_data.admittance" color="negative" text-color="black">Не допущен</q-badge>
              <div class="mt-3">Медработник: {{ medNameWithInitials }} </div>
              <div v-if="!exam_data.admittance" class="mt-3"> {{ parsedVerdictsList }} </div>
            </q-card>
          </div>
        </div>
        <div class="mt-4 p-2 d-flex flex-column align-items-center">
          <div class="fs-4">
            Данные приборов
          </div>
          <table class="table p-2">
            <thead class="text-dark">
              <tr>
                <th scope="col">
                  Параметр
                </th>
                <th scope="col">
                  Значение
                </th>
                <th scope="col">
                  Норма
                </th>
              </tr>
            </thead>
            <tbody>
              <tr :class="exam_data.pressure_upper >= 110 && exam_data.pressure_upper <= 130 ? 'input_normal' : 'app_error'">
                <td>Верхнее артериальное давление</td>
                <td class="right_col">
                  {{ exam_data.pressure_upper }}
                </td>
                <td>110 - 130</td>
              </tr>
              <tr :class="exam_data.pressure_lower >= 70 && exam_data.pressure_lower <= 85 ? 'input_normal' : 'app_error'">
                <td>Нижнее артериальное давление</td>
                <td class="right_col">
                  {{ exam_data.pressure_lower }}
                </td>
                <td> 70 - 85</td>
              </tr>
              <tr :class="exam_data.heart_rate >= 60 && exam_data.heart_rate <= 80 ? 'input_normal' : 'app_error'">
                <td>Пульс</td>
                <td class="right_col">
                  {{ exam_data.heart_rate }}
                </td>
                <td>60 - 80</td>
              </tr>
              <tr :class="exam_data.alcohol * 100 <= 16 ? 'input_normal' : 'app_error'">
                <td>Уровень алкоголя</td>
                <td class="right_col">
                  {{ exam_data.alcohol }}
                </td>
                <td> {{ '< 0.16' }}</td>
              </tr>
              <tr :class="exam_data.temperature * 10 >= 359 && exam_data.temperature * 10 <= 372 ? 'input_normal' : 'app_error'">
                <td>Температура тела</td>
                <td class="right_col">
                  {{ exam_data.temperature.toPrecision(3) }}
                </td>
                <td>35.9 - 37.2</td>
              </tr>
            </tbody>
          </table>
          <button
            id="hist_btn"
            class="btn_normal"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse"
            aria-expanded="false"
            aria-controls="collapse"
            @click="clc"
          >
            Посмотреть историю
          </button>
        </div>
      </div>
      <div class="col-xl-6">
        <div
          id="player"
          class="container"
        />
        <div
          id="notions"
          class="container"
        >
          <div class="row">
            <span class="fs-4">Жалобы</span>
          </div>
          <span id="notes">{{ parsedComplaints || 'Нет' }}</span>
        </div>
        <div
          v-if="exam_data.admittance === null"
          id="buttns"
          class="container"
        >
          <div class="d-flex justify-content-around">
            <button
              id="reject"
              type="button"
              class="btn_error"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              @click="getlist"
            >
              Не допустить
            </button>
            <button
              id="resolve"
              class="btn_normal"
              @click="admit"
            >
              Допустить
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      id="exampleModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <form
          class="form-horizontal"
          @submit.prevent="req_form"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5
                id="exampleModalLabel"
                class="modal-title"
              >
                Причины недопуска
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body">
              <div
                v-for="item in verd_list"
                :key="item.id"
                class="input-group"
              >
                <div class="input-group-text">
                  <input
                    v-model="checked"
                    class="form-check-input mt-0"
                    type="checkbox"
                    :value="item.id"
                  >
                </div>
                <label
                  class="form-check-label form-control"
                  for="flexCheckDefault"
                >
                  {{ item.text }}
                </label>
              </div>
              <div class="input-group">
                <div class="input-group-text">
                  <input
                    v-model="checked_13"
                    class="form-check-input mt-0"
                    type="checkbox"
                    :value="13"
                  >
                </div>
                <input
                  v-model="comment_13"
                  type="text"
                  class="form-control"
                  placeholder="Другое"
                >
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Отмена
              </button>
              <button
                v-if="checked.length > 0 || checked_13"
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                @click="req_form"
              >
                Отправить
              </button>
              <button
                v-else
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                disabled
                @click="req_form"
              >
                Отправить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div
      id="collapse"
      class="collapse collapsing"
    >
      <div class="container-fluid">
        <div class="row">
          <div class="col-xl-6">
            <chart :options="sys_dia_opt" />
          </div>
          <div class="col-xl-6">
            <chart :options="pulse_opt" />
          </div>
        </div>
        <div class="row">
          <div class="col-xl-6">
            <chart :options="temp_opt" />
          </div>
          <div class="col-xl-6">
            <chart :options="alc_opt" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Chart.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import sys_dia_opt from '@/components/options/sys_dia'
import pulse_opt from '@/components/options/pulse'
import temp_opt from '@/components/options/temp'
import alc_opt from '@/components/options/alc'
import { getVerdictList,
    getExamData,
    getExamsHistoryForPersonnel,
    postVerdict, } from '@/api/exams.api'

export default {

    components: {
        Chart
    },
    data() {
            return {
                verd_list: [],
                sys_dia_opt,
                pulse_opt,
                temp_opt,
                alc_opt,
                exam_data: null,
                exam_hist: {},
                checked: [],
                comment_13: '',
                checked_13: false,
                user_id: sessionStorage.getItem('user_id'),
                exam_id: sessionStorage.getItem('exam_id'),
        }
    },
    computed : {
        dataLoaded () {
          return this.exam_data && 0 !== Object.keys(this.exam_data).length
        },
        parsedComplaints () {
            if (this.dataLoaded && this.exam_data.complaints) {
                return this.exam_data.complaints.replaceAll('"', '').replace('[', '').replace(']', '');
            } else {
                return ''
            }
        },
        fullName () {
            if (this.exam_data && 0 !== Object.keys(this.exam_data).length) {
                return [this.exam_data.second_name, this.exam_data.first_name, this.exam_data.father_name].filter(Boolean).join(' ')
            } else {
                return ''
            }
        },
        medNameWithInitials () {
          if (!this.exam_data || !this.exam_data.med_first_name || !this.exam_data.med_second_name) {
            return ''
          }
          let result = this.exam_data.med_second_name
                  + ' ' + this.exam_data.med_first_name.charAt(0) + '.';
          if (this.exam_data.med_father_name) {
              result += this.exam_data.med_father_name.charAt(0) + '.';
          }
          return result;
        },
        parsedVerdictsList () {
          if (!this.dataLoaded || !this.exam_data.verdicts) {
            return "";
          }
          let verdicts_list = JSON.parse(this.exam_data.verdicts);
          console.log(verdicts_list);

          if (verdicts_list.includes('Допущен')) {
            return '';
          }
          if (verdicts_list.includes('Другое')) {
            // Replace with comment
            const ind = verdicts_list.indexOf('Другое');
            verdicts_list[ind] = this.exam_data.verdict_comment;
          }
          return verdicts_list.join(', ');

        }
    },
    mounted() {
        this.getdata()
    },
    methods: {
        clc() {
            let myCollapsible = document.getElementById('collapse');
            myCollapsible.addEventListener('shown.bs.collapse', function () {
                this.scrollIntoView();
            });
            this.sys_dia_opt.series = [
                {
                    name: 'sys',
                    data: [['11.0', 820], ['Tue', 932], ['Wed', 901], ['Thu', 934], ['Fri', 1290], ['Sat', 1330], ['Sun', 1320]],
                    type: 'line',
                    smooth: true,
                },
                {
                    name: 'dia',
                    data: [['11.0', 462], ['Tue', 854], ['Wed', 456], ['Thu', 1250], ['Fri', 121], ['Sat', 4586], ['Sun', 1360]],
                    type: 'line',
                    smooth: true,
                }
            ];
        },
        async getlist() {
            try {
                const response = await getVerdictList();
                this.verd_list = response.data;
                this.verd_list.shift();
                this.verd_list.pop();
            } catch (error) {
            }
        },
        async getdata() {
            try {
              const exam_data = await getExamData(this.exam_id, this.user_id);
              const exam_hist = await getExamsHistoryForPersonnel(this.user_id, exam_data.pers_id);
              this.is_requested = true;
              this.exam_data = exam_data.data;
              this.exam_hist = exam_hist;
            } catch (error) {
              console.log(error);
            }
        },
        req_form() {
            let verdicts = [];
            for (let i of this.checked)
                verdicts.push(i);
            if (this.checked_13 || this.comment_13 !== '')
                verdicts.push(13);
            try {
                postVerdict(this.exam_id, verdicts, this.user_id, this.comment_13);
                this.$router.push('/expect_patient');
            } catch (error) {
            }
        },
        admit() {
            try {
                let verdicts = [ 1 ];
                postVerdict(this.exam_id, verdicts, this.user_id);
                this.$router.push('/expect_patient');
            } catch (error) {
            }
        }
    }
};
</script>

<style scoped>

button {
    border-radius: 50px;
}

.container {
    padding: 0;
}

#player {
    width: 640px;
    height: 360px;
    background-color: darkgrey;
}

#notions {
    margin-top: 40px;
    margin-left: 10px;
    width: 640px;
    height: 100px;
}

#buttns {
    margin-top: 25px;
    height: 100px;
}

#pers_data_txt {
    width: 300px;
    height: 200px;
}

#img {
    width: 200px;
    height: 200px;
    background-color: darkgray;
}

#hist_btn {
    width: 300px;
    height: 40px;
    font-size: 15px;
}

#notes {
    width: 100%;
}

#reject {
    width: 200px;
    height: 40px;
    font-weight: 900;
    font-size: 15px;
}

#resolve {
    width: 200px;
    height: 40px;
    font-weight: 900;
    font-size: 15px;
}

</style>

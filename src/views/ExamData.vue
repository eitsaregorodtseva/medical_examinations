<template>
    <div class='container' >
        <div class='row'>
            <div class='col-xl-6'>
                <div id='pers_data' class='container'>
                    <div class='row'>
                        <div id='img' class='col-4'></div>
                        <div id='pers_data_txt' class='col-4'>
                            <div class='row'>
                                <span id='name'>{{ name }}</span>
                                <span id='sex'>{{ gender }}</span>
                                <span id='age'>{{ age }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='table_data' class='container'>
                    <table>
                        <thead>
                            <tr>Данные приборов</tr>
                        </thead>
                        <tbody>
                            <tr :class="pressure_upper >= 110 && pressure_upper <= 130 ? 'input_normal' : 'input_error'">
                                <td>Верхнее артериальное давление</td>
                                <td class='right_col'>{{ pressure_upper }}</td>
                            </tr>
                            <tr :class="pressure_lower >= 70 && pressure_lower <= 85 ? 'input_normal' : 'input_error'">
                                <td>Нижнее артериальное давление</td>
                                <td class='right_col'>{{ pressure_lower }}</td>
                            </tr>
                            <tr :class="heart_rate >= 60 && heart_rate <= 80 ? 'input_normal' : 'input_error'">
                                <td>Пульс</td>
                                <td class='right_col'>{{ heart_rate }}</td>
                            </tr>
                            <tr :class="alcohol * 100 <= 16 ? 'input_normal' : 'input_error'">
                                <td>Уровень алкоголя</td>
                                <td class='right_col'>{{ alcohol }}</td>
                            </tr>
                            <tr :class="temperature * 10 >= 359 && temperature * 10 <= 372 ? 'input_normal' : 'input_error'">
                                <td>Температура тела</td>
                                <td class='right_col'>{{ temperature }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class='d-flex justify-content-center'>
                        <button id='hist_btn' class='btn_normal' type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-expanded="false" aria-controls="collapse" @click='clc'>Посмотреть историю</button>
                    </div>
                </div>
            </div>
            <div class='col-xl-6'>
                <div id='player' class='container'></div>
                <div id='notions' class='container'>
                    <div class='row'>
                        <span id='pr'>Примечание</span>
                    </div>
                    <span id='notes'>{{ complaints }}</span>
                </div>
                <div id='buttns' class='container'>
                    <div class='d-flex justify-content-around'>
                        <button @click="getlist" type="button" id='reject' class='btn_error' data-bs-toggle="modal" data-bs-target="#exampleModal">Не допустить</button>
                        <button @click='admit' id='resolve' class='btn_normal'>Допустить</button>
                    </div>
               </div>
            </div>
        </div>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form class='form-horizontal' @submit.prevent='req_form'>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Причины недопуска</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-group" v-for="item in verd_list" :key='item.id'>
                            <div class="input-group-text">
                                <input class="form-check-input mt-0" type="checkbox" :value='item.id' v-model='checked'>
                            </div>
                            <label class="form-check-label form-control" for="flexCheckDefault">
                                {{ item.text }}
                            </label>
                        </div>
                        <div class="input-group">
                            <div class="input-group-text">
                                <input class="form-check-input mt-0" type="checkbox" :value='13' v-model='checked_13'>
                            </div>
                            <input type="text" class="form-control" placeholder='Другое' v-model='comment_13'>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="req_form">Отправить</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
        <div class='collapse collapsing' id="collapse">
            <div class="container-fluid">
                <div class='row'>
                    <div class='col-xl-6'>
                        <chart :options='sys_dia_opt' />
                    </div>
                    <div class='col-xl-6'>
                        <chart :options='pulse_opt' />
                    </div>
                </div>
                <div class='row'>
                    <div class='col-xl-6'>
                        <chart :options='temp_opt' />
                    </div>
                    <div class='col-xl-6'>
                        <chart :options='alc_opt' />
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
                name: '',
                gender: '',
                age: '',
                pressure_upper: '',
                pressure_lower: '',
                heart_rate: '',
                alcohol: '',
                temperature: '',
                complaints: '',
                verd_list: [],
                sys_dia_opt,
                pulse_opt,
                temp_opt,
                alc_opt,
                exam_data: {},
                exam_hist: {},
                checked: [],
                comment_13: '',
                checked_13: false,
                admission: false,
                user_id: sessionStorage.getItem('user_id'),
                exam_id: sessionStorage.getItem('exam_id'),
        }
    },
    created() {
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
            const exam_data = await getExamData(this.exam_id, this.user_id);
            const exam_hist = await getExamsHistoryForPersonnel(this.user_id, exam_data.data.pers_id);
            this.is_requested = true;
            this.exam_data = exam_data;
            this.exam_hist = exam_hist;
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
    },
    watch: {
        exam_data: function() {
            this.name = this.exam_data.data.first_name + ' ' + this.exam_data.data.father_name + ' ' + this.exam_data.data.second_name;
            this.gender = this.exam_data.data.gender;
            this.age = this.exam_data.data.age + ' ' + 'лет';
            this.pressure_upper = this.exam_data.data.pressure_upper;
            this.pressure_lower = this.exam_data.data.pressure_lower;
            this.heart_rate = this.exam_data.data.heart_rate;
            this.alcohol = this.exam_data.data.alcohol.toFixed(1);
            this.temperature = this.exam_data.data.temperature.toFixed(1);
            if (this.exam_data.data.complaints != null)
                this.complaints = this.exam_data.data.complaints.replaceAll('"', '').replace('[', '').replace(']', '');
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

#container {
    margin: 0;
}

#pers_data {
    width: 550px;
    height: 200px;
}

#table_data {
    margin-top: 60px;
    width: 550px;
    height: 400px;
}

#player {
    width: 640px;
    height: 360px;
    background-color: darkgrey;
}

#notions {
    margin-top: 40px;
    width: 640px;
    height: 100px;
}

#buttns {
    margin-top: 40px;
    width: 640px;
    height: 100px;
}


#pers_data_txt {
    width: 300px;
    height: 200px;
}

#name {
    width: 100%;
    text-align: center;
    font-size: 24px;
}

#sex {
    width: 50%;
    text-align: left;
    top: 26px;
}

#age {
    width: 50%;
    text-align: right;
    right: 0;
    top: 26px;
}

#img {
    width: 200px;
    height: 200px;
    background-color: darkgray;
}

tr {
    width: 100%;
    display: block;
    height: 45px;
}

td {
    width: 300px;
}

.right_col {
    text-align: right;
}

table {
    width: 100%;
    height: 300px;
}

thead {
    font-size: 26px;
    text-align: center;
    height: 70px;
}

#hist_btn {
    width: 300px;
    height: 40px;
    font-size: 15px;
}

#pr {
    width: 100%;
    font-size: 28px;
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

<template>
    <div id='auth_rect' class='container position-absolute top-50 start-50 translate-middle app_normal' >
        <form class='form-horizontal' @submit.prevent='get_next_patient'>
            <button id='btn' class='btn_normal position-absolute top-50 start-50 translate-middle'>Следующий пациент</button>
        </form>
    </div>
</template>

<script>
import { getNextPatient } from '@/api/exams.api'

export default {
    data() {
        return { user_id: sessionStorage.getItem('user_id') }
    },
    methods: {
        async get_next_patient() {
            try {
                const response = await getNextPatient(this.user_id);
                sessionStorage.setItem('exam_id', response.data);
                this.$router.push('/exam_data');
            } catch (error) {
                if (error.response.status === 404) {
                    this.$notify({
                    type : 'success',
                    title : 'В очереди нет пациентов',
                    });
                }
            }
        }
    }
}
</script>

<style scoped>
button {
    border-radius: 10px;
    font-size: 30px;
}

#btn {
    width: 250px;
    height: 100px;
}

#auth_rect {
    width: 550px;
    height: 400px;
    display: block;
}
</style>

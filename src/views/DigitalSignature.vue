<template>
    <div id="ds_rect" class='container position-absolute top-50 start-50 translate-middle' :class="isError ? 'app_error' : 'app_normal'">
        <form class='form-horizontal' @submit.prevent='verf'>
            <div class='form-group'>
                <div id='img_cont' class='row mt-3 d-flex justify-content-center'>
                    <img id='img'  v-if="isError" src='@\assets\images\flash-drive(1).png' />
                    <img id='img' v-else src='@\assets\images\flash-drive.png' />
                </div>
                <div class='row d-flex justify-content-center'>
                    <div id='err_txt' v-if="isError" class='txt_error'>Неверный ключ</div>
                </div>
                <div class='row d-flex justify-content-center'>
                    <div id='text_ds' :class="isError ? 'txt_error' : 'txt_normal'">Присоедините к компьютеру носитель ключа электронной подписи.</div>
                </div>
                <div class='row mt-3 d-flex justify-content-center'>
                    <button id='btn' :class="isError ? 'btn_error' : 'btn_normal'" type='submit' @click='clc'>Готово</button>
                </div>
                <div class='row d-flex justify-content-center'>
                    <button id='nav' :class="isError ? 'nav_btn_error' : 'nav_btn_normal'" @click='back'>Назад</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data: () => ({
        isError: false,
    }),
    methods: {
        back() {
            this.$router.push('/auth');
        },
        clc() {
            this.$router.push('/expect_patient');
        }
    }
}
</script>

<style scoped>

#ds_rect {
    width: 550px;
    height: 400px;
    display: block;
}

.row {
    height: 100px;
}

#text_ds {
    text-align: center;
    width: 70%;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.017em;
}

#img {
    width: 129px;
    height: 129px;
    padding: 0;
}

#err_txt {
    text-align: center;
    width: 100%;
    font-weight: 600;
    padding-top: 50px;
}

#nav {
    text-align: center;
    width: auto;
    height: 30%;
    background-color: #FFF;
}

#btn {
    height: 40%;
    width: 30%;
    border-radius: 50px;
}

</style>

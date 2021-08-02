<template>
    <div id="ds_rect" :class="isError ? 'app_error' : 'app_normal'">
        <form @submit.prevent='verf'>
            <div id='img_cont'>
                <img id='img'  v-if="isError" src='@\assets\images\flash-drive(1).png' />
                <img id='img' v-else src='@\assets\images\flash-drive.png' />
            </div>
            <div id='err_txt' v-if="isError" class='txt_error'>Неверный ключ</div>
            <div id='text_ds' class='txt_normal'>Присоедините к компьютеру носитель ключа электронной подписи.</div>
            <button id='btn' :class="isError ? 'btn_error' : 'btn_normal'" type='submit'>Готово</button>
            <button id='nav' :class="isError ? 'nav_btn_error' : 'nav_btn_normal'" @click='back'>Назад</button>
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
        }
    }
}
</script>

<style scoped>

#ds_rect {
    position: absolute;
    width: 550px;
    height: 400px;
    display: block;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -225px;
}


#text_ds {
    position: absolute;
    text-align: center;
    top: 52%;
    width: 70%;
    padding-left: 15%;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.017em;
}

#img {
    width: 129px;
    height: 129px;
}

#img_cont {
    position: absolute;
    left: 50%;
    margin-left: -64.5px;
    top: 7%;
}

#err_txt {
    position: absolute;
    text-align: center;
    top: 43%;
    width: 100%;
    font-weight: 600;
}

#nav {
    position: absolute;
    text-align: center;
    width: auto;
    top: 110%;
    left: 46%;
    /* font-weight: 00; */
    background-color: #FFF;
}

#btn {
    position: absolute;
    width: 25%;
    height: 10%;
    top: 80%;
    left: 37.5%;
}



</style>
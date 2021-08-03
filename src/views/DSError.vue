<template>
    <form @submit.prevent='verf'>
        <div id='img_cont'>
            <img id='img' src='@\assets\images\flash-drive(1).png' />
        </div>
        <div id='err_txt' class='input_error'>Неверный ключ</div>
        <div id='text_ds' class='txt_error'>Присоедините к компьютеру носитель ключа электронной подписи.</div>
        <button id='btn' class='bttn_error' type='submit'>Готово</button>
        <button id='nav' class='input_error nav_error' @click='back'>Назад</button>
    </form>
</template>

<script>
export default {
    methods: {
        back() {
            this.$router.push('/auth');
        }
    }
}
</script>

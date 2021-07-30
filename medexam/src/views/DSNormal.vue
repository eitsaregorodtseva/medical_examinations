<template>
    <form @submit.prevent='verf'>
        <div id='img_cont'>
            <img id='img' src='@\assets\images\flash-drive.png' />
        </div>
        <div id='text_ds' class='txt_normal'>Присоедините к компьютеру носитель ключа электронной подписи.</div>
        <button id='btn' class='bttn_normal' type='submit'>Готово</button>
        <button id='nav' class='input_normal nav_normal'>Назад</button>
    </form>
</template>
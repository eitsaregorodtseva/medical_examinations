<template>
    <form @submit.prevent='auth'>
        <div id='text_au' class='txt_normal'>Авторизация</div>
        <input id='log' class='input input_normal' v-model='login' placeholder="Логин" />
        <input id='pas' class='input input_normal' type="password" v-model='password' placeholder="Пароль" />
        <button id='btn' class='bttn_normal' type='submit'>Войти</button>
    </form>    
</template>
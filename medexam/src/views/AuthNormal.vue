<template>
    <form @submit.prevent='auth'>
        <div id='text' class='txt'>Авторизация</div>
        <input id='log' class='input' v-model='login' placeholder="Логин" />
        <input id='pas' class='input' type="password" v-model='password' placeholder="Пароль" />
        <button id='btn' class='bttn' type='submit' v-on:mouseover='overBttn' v-on:mouseout='outBttn'>Войти</button>
    </form>
</template>
<template>
    <header>
        <img id="logo" src="../assets/logo.png">
        <div id="logo_text">Медосмотры</div>
    </header>
    <div id="content">
        <router-view />
    </div>
</template>

<style scoped>

header {
    position: relative;
    height: 80px;
    width: 100%;
}

#logo {
    height: 50px;
    width: auto;
    margin: 10px;
    float: left;
}

#logo_text {
    position: relative;
    top: 25px;
    float: left;
    font-weight: bold;
}

#content {
    top: 10%;
    width: 100%;
}

</style>
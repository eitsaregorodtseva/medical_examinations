<template>
    <header class="d-flex align-items-center">
        <img id="logo" src="../assets/logo.png">
        <div class="fw-bold">Медосмотры</div>
    </header>
    <main>
        <router-view />
    </main>
</template>

<style scoped>

header {
    height: 4rem;
    width: 100%;
}

main {
    min-height: calc(100vh - 4rem);
}

#logo {
    height: 50px;
    width: auto;
    margin: 5px;
}

</style>
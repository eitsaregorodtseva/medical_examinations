<template>
  <header class="d-flex align-items-center">
    <a href="/"><img
      id="logo"
      src="../assets/logo.png"
    ></a>
    <a
      href="/"
      class="text-decoration-none"
    >
      <div class="fw-bold">
        Медосмотры
      </div>
    </a>
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
    height: 1px;
    min-height: calc(100vh - 4rem);
}

#logo {
    height: 50px;
    width: auto;
    margin: 5px;
}

</style>

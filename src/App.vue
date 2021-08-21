<template>
  <div id="main-container">
    <Navbar> </Navbar>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
      <router-link :to="{ name: 'Test' }">Test</router-link>
    </div> -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: { Navbar },
}
</script>

<style lang="scss">
:root {
  /* colors */
  --color-details: #ff7b42;
  --color-background-white: hsl(0, 0%, 100%);
  --color-light-gray: hsl(180, 1%, 75%);
  --color-mid-gray: hsl(218, 19%, 38%);
  --color-dark-gray: hsl(229, 19%, 22%);

  /* breakpoints */
  /* $md: 768px; */
  /* $xxl: 1400px; */

  /* navbar */
  --navbar-width: 200px;
}

*,
*::after,
*::before {
  box-sizing: border-box;
  margin: 0;
}

/* html {
  padding:20px;
} */
body {
  /* max-width:100vw;
max-height: 100vh; */
}

#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  font-size: 100%;
}

.main-content {
  background-image: url(./assets/background.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow-x: hidden;
  /* width: 100vw; */
  height: 100vh;
  padding-top: 3rem;
  /* max-width: 1920px; */
  @media only screen and (min-width: 768px) {
    background-image: url(./assets/background_desktop.svg);
    background-position: left calc(var(--navbar-width) / 2) center;  
    background-size: cover;
    max-width: calc(100vw - var(--navbar-width));
    margin-left:var(--navbar-width);
    /* background-size: 100vh 100vw; */
  }
}

</style>

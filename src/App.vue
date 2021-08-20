<template>
  <div id="main-container">
    <div id="nav">
      <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
      <router-link :to="{ name: 'Test' }">Test</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
:root {
  /* colors */
  --color-details: #ff7b42;
  --color-background-white: hsl(0, 0%, 100%);
  --color-light-gray: hsl(180, 1%, 75%);
  --color-mid-gray: hsl(218, 19%, 38%);
  --color-dark-gray: hsl(229, 19%, 22%);

  /* breakpoints */
  --md: 768px;
  --xxl: 1400px;
}

*,
*::after,
*::before {
  box-sizing: border-box;
  margin: 0;
}

body {
  background-image: url(./assets/background.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow-x: hidden;
  @media only screen and (min-width: var(--md)) {
    background-image: url(./assets/background_desktop.svg);
  }
}

#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  font-size: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

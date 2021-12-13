<template>
  <div class="loaderContainer" v-if="isLoading">
    <Loader />
  </div>
  <div id="main-container" v-else>
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Loader from './components/Loader.vue'
import { loadLayersModel } from '@tensorflow/tfjs'

export default {
  components: { Navbar, Loader },
  data() {
    return {
      isLoading: true,
    }
  },
  async mounted() {
    try {
      await Promise.all([
        loadLayersModel('indexeddb://hiragana'),
        loadLayersModel('indexeddb://katakana'),
        loadLayersModel('indexeddb://kanji'),
      ])
    } catch (e) {
      try {
        const [modelKanji, modelHiragana, modelKatakana] = await Promise.all([
          loadLayersModel(`${process.env.VUE_APP_MODEL_URL}/kanji/model.json`),
          loadLayersModel(`${process.env.VUE_APP_MODEL_URL}/hiragana/model.json`),
          loadLayersModel(`${process.env.VUE_APP_MODEL_URL}/katakana/model.json`),
        ])
        await Promise.all([
          modelKanji.save('indexeddb://kanji'),
          modelHiragana.save('indexeddb://hiragana'),
          modelKatakana.save('indexeddb://katakana'),
        ])
      } catch (e) {
        console.log(e)
        this.$router.push({ name: 'NotFound' })
      }
    }
    this.isLoading = false
  },
}
</script>

<style lang="scss">
:root {
  /* colors */
  --color-details: hsl(18, 100%, 63%);
  --color-background-white: hsl(0, 0%, 100%);
  --color-light-gray: hsl(180, 1%, 75%);
  --color-mid-gray: hsl(218, 19%, 38%);
  --color-dark-gray: hsl(229, 19%, 22%);

  /* navbar */
  --navbar-width: 200px;

  /* content width */
  --xxl: 1400px;
}

*,
*::after,
*::before {
  box-sizing: border-box;
  margin: 0;
}

a,
a:visited {
  text-decoration: none;
  color: #000000;
}

#app {
  font-family: 'Arial', 'Helvetica', 'sans-serif';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  font-size: 100%;
}

.loaderContainer {
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: var(--color-background-white);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-content {
  background-image: url(./assets/background.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow-x: hidden;
  min-height: 100vh;
  padding-top: 3rem;

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    background-image: url(./assets/background_desktop.svg);
  }

  @media only screen and (min-width: 1025px) {
    background-image: url(./assets/background_desktop.svg);
    background-position: left calc(var(--navbar-width) / 2) center;
    background-size: cover;
    max-width: calc(100vw - var(--navbar-width));
    margin-left: var(--navbar-width);
  }
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-details);
  border-radius: 10px;
  border: 1px solid var(--color-background-white);
}
</style>

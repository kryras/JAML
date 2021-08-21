<template>
  <div class="toggle-container" @click="toggleNavigation">
    <font-awesome-icon :icon="navOpen ? 'plus' : 'bars'" :class="[{ 'toggle-open': navOpen }, 'toggle']" />
  </div>
  <nav v-if="navOpen" class="navigation">
    <span class="logo">LOGO</span>
    <router-link :to="{ name: 'Home' }">
      <font-awesome-icon :icon="'home'" :class="['icon']" />
      <span>Home</span>
    </router-link>
    <router-link :to="{ name: 'MenuKatakana' }">
      <img :class="['icon']" src="@/assets/logo_katakana.svg" />
      <span>Katakana</span>
    </router-link>
    <router-link :to="{ name: 'MenuHiragana' }">
      <img :class="['icon']" src="@/assets/logo_hiragana.svg" />
      <span>Hiragana</span>
    </router-link>
    <router-link :to="{ name: 'MenuKanji' }">
      <img :class="['icon']" src="@/assets/logo_kanji.svg" />
      <span>Kanji</span>
    </router-link>
    <router-link :to="{ name: 'Search' }">
      <font-awesome-icon :icon="'search'" :class="['icon']" />
      <span>Search</span>
    </router-link>
    <router-link :to="{ name: 'About' }">
      <font-awesome-icon :icon="'info-circle'" :class="['icon']" />
      <span>About</span>
    </router-link>
  </nav>
  <div class="background" v-if="navOpen" @click="toggleNavigation"></div>
</template>
<script>
export default {
  data() {
    return {
      navOpen: false,
    }
  },
  created() {
    window.addEventListener('resize', this.openNavigation)
  },
  mounted() {
    this.openNavigation()
  },
  unmounted() {
    window.removeEventListener('resize', this.openNavigation)
  },
  methods: {
    toggleNavigation() {
      this.navOpen = !this.navOpen
    },
    openNavigation() {
      if (!this.navOpen && window.innerWidth >= 768) {
        this.navOpen = true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.toggle-container {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 101;

  @media only screen and (min-width: 768px) {
    display: none;
  }
}

.toggle {
  color: var(--color-details);
  z-index: 102;
  font-size: 2rem;

  &-open {
    transform: rotate(45deg);
  }
}

.icon {
  filter: invert(54%) sepia(97%) saturate(1110%) hue-rotate(331deg) brightness(101%) contrast(101%); /* box-shadow: 0 0 10px  var(--color-background-white); */
  width: 2rem;
  height: 2rem;
  z-index: 102;
  font-size: 2rem;
  user-select: none;
}

.background {
  position: fixed;
  inset: 0;
  background-color: hsl(0, 0, 0, 0.4);
  z-index: 99;

  @media only screen and (min-width: 768px) {
    display: none;
  }
}

.navigation {
  z-index: 100;
  background-color: var(--color-background-white);
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  position: fixed;
  padding-top: 50px;
  left: 0;
  top: 0;
  bottom: 0;
  min-width: var(--navbar-width);

  box-shadow: 0 0 2px var(--color-details);
}

.logo {
  position: fixed;
  left: calc(var(--navbar-width) / 2);
  top: calc(50px / 2);
  transform: translate(-50%, -50%);
  user-select: none;
}

a {
  color: black;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 50px;
  padding: 10px;
  width: 100%;

  &:hover {
    text-shadow: 0px 0px 2px var(--color-details);
    box-shadow: inset 0px 0px 4px 0px var(--color-details);
  }

  &.router-link-exact-active {
    color: var(--color-details);
    font-weight: bold;
  }

  span {
    padding-left: 10px;
  }
}
</style>

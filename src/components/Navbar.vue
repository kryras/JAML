<template>
  <div class="toggle-container" @click="toggleNavigation">
    <font-awesome-icon :icon="navOpen ? 'plus' : 'bars'" :class="[{ 'toggle-open': navOpen }, 'toggle']" />
  </div>
  <nav class="navigation" :class="[navOpen ? 'navigation--open' : 'navigation--closed']">
    <div class="logo">
      <img class="logo__img" src="@/assets/logo.png" />
    </div>
    <router-link :to="{ name: 'Home' }">
      <font-awesome-icon :icon="'home'" :class="['icon']" />
      <span>Home</span>
    </router-link>
    <router-link :to="{ name: 'MenuHiragana' }">
      <img :class="['icon']" src="@/assets/logo_hiragana.svg" />
      <span>Hiragana</span>
    </router-link>
    <router-link :to="{ name: 'MenuKatakana' }">
      <img :class="['icon']" src="@/assets/logo_katakana.svg" />
      <span>Katakana</span>
    </router-link>
    <router-link :to="{ name: 'MenuKanji' }">
      <img :class="['icon']" src="@/assets/logo_kanji.svg" />
      <span>Kanji</span>
    </router-link>
    <router-link :to="{ name: 'Search' }">
      <font-awesome-icon :icon="'search'" :class="['icon']" />
      <span>Search kanji</span>
    </router-link>
    <router-link :to="{ name: 'About' }">
      <font-awesome-icon :icon="'info-circle'" :class="['icon']" />
      <span>About</span>
    </router-link>
  </nav>
  <transition name="fade">
    <div class="background" v-if="navOpen" @click="toggleNavigation"></div>
  </transition>
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
$transition-time: 200ms;

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
  filter: invert(54%) sepia(97%) saturate(1110%) hue-rotate(331deg) brightness(101%) contrast(101%);
  width: 2rem;
  height: 2rem;
  z-index: -1;
  font-size: 2rem;
  user-select: none;
}

.background {
  position: fixed;
  inset: 0;
  background-color: hsla(0, 0%, 0%, 0.4);
  z-index: 99;

  @media only screen and (min-width: 768px) {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity #{$transition-time};
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.navigation {
  z-index: 100;
  background-color: var(--color-background-white);
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  min-width: var(--navbar-width);
  overflow-y: auto;
  box-shadow: 0 0 2px var(--color-details);
  transition: transform #{$transition-time};

  &--open {
    transform: translateX(0);
  }

  &--closed {
    transform: translateX(calc(var(--navbar-width) * -1));
  }
}

.logo {
  background-color: var(--color-background-white);
  width: calc(var(--navbar-width) - 0px);
  z-index: 101;
  box-shadow: 0 0 2px var(--color-details);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  height: 50px;
  &__img {
    user-select: none;
    width: 100px;
    height: auto;
    z-index: 102;
  }
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

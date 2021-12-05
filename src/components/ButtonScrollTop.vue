<template>
  <button @click="scrollToTop" :class="{ 'button-visible': isVisible }">
    <font-awesome-icon icon="arrow-up" />
  </button>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    scrollToTop() {
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        this.$el.blur()
      })
    },
    handleScroll() {
      if (window.innerHeight < window.top.scrollY) {
        this.isVisible = true
      } else {
        this.isVisible = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  $size: 2.9rem;
  $offset: 1.6rem;
  $translateValue: calc(#{$offset} + #{$size});
  cursor: pointer;
  border-radius: 5px;
  width: $size;
  height: $size;
  border: 1px solid var(--color-background-white);
  background: var(--color-details);
  color: var(--color-background-white);
  opacity: 0.5;

  position: fixed;
  right: $offset;
  bottom: $offset;
  transform: translateY($translateValue);
  transition: transform 0.2s, opacity 0.2s;

  &:hover,
  &:focus {
    box-shadow: 0 0 5px 0px var(--color-details);
    -webkit-tap-highlight-color: transparent;
    opacity: 1;
  }
}

.button-visible {
  transform: translateY(0);
}
</style>

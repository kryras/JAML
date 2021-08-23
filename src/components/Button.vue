<template>
  <button :class="color">
    <font-awesome-icon v-if="icon" :icon="icon" />
    <span :class="{ 'icon-space': isIconWithText }">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'white',
    },
    icon: {
      required: false,
      type: String,
    },
  },
  computed: {
    isIconWithText() {
      return !!this.icon && !!this.$slots.default
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  font-family: inherit;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;

  &:hover,
  &:focus {
    box-shadow: 0 0 5px 0px var(--color-details);
    -webkit-tap-highlight-color: transparent;
  }
}

.icon-space {
  margin-left: 10px;
}

.white {
  border: 1px solid var(--color-details);
  background: var(--color-background-white);
  color: var(--color-details);
}

.orange {
  border: 1px solid var(--color-background-white);
  background: var(--color-details);
  color: var(--color-background-white);
}
</style>

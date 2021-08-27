<template>
  <div>
    <div class="container">
      <font-awesome-icon :icon="'frown'" :class="['icon']" />
      <h1 class="text">Something went wrong...</h1>
      <router-link class="go-back" :to="{ name: 'Home' }">
        <Button class="orange">
          GO TO HOME PAGE
        </Button>
      </router-link>
    </div>
  </div>
</template>
<script>
import Button from '@/components/Button.vue'
export default {
  components: { Button },
}
</script>
<style lang="scss" scoped>
.container {
  height: calc(100vh - 50px);
  display: flex;
  flex-flow: column wrap;
  justify-content: space-evenly;
  align-items: center;

  .text,
  .go-back {
    z-index: 1;
    margin: 10px;
  }

  .go-back {
  }

  .icon {
    font-size: 12rem;
    position: absolute;
    z-index: 0;
    color: var(--color-details);
    opacity: 0.25;
  }
}
</style>

<template>
  <div>
    <h1>meaning to character</h1>
    <h1>{{ data }}</h1>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>
<style lang="scss" scoped></style>

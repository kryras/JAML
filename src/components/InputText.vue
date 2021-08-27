<template>
  <div class="text-input-container">
    <label for="input">{{ label }}</label>
    <div class="input-wrapper">
      <input
        id="input"
        @keyup="emitInput"
        @paste="emitInput"
        type="text"
        class="text-input"
        :placeholder="placeholder"
        v-model="value"
        :disabled="disabled"
        autocomplete="off"
      />
      <button @click="$emit('buttonClicked')" class="icon-container" v-if="icon">
        <font-awesome-icon :icon="icon" class="icon" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    lengthToEmit: {
      type: Number,
      required: false,
      default: 0,
    },
    time: {
      type: Number,
      required: false,
      default: 500,
    },
    icon: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      value: '',
      timeout: null,
    }
  },
  methods: {
    emitInput() {
      clearTimeout(this.timeout)
      if (this.value.length > this.lengthToEmit) {
        let self = this
        this.timeout = setTimeout(() => {
          this.$emit('getInput', self.value)
        }, this.time)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.text-input-container {
  position: relative;

  label {
    font-size: 1.2rem;
    margin: auto;
    margin-bottom: 10px;
    display: inline-block;
  }

  .input-wrapper {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    position: relative;

    .text-input {
      /* width: 90%; */
      width: 100%;
      height: 2.9rem;
      font-size: 1.2rem;
      text-align: center;
      padding: 10px;
      border-radius: 5px 0 0 5px;
      border: 2px solid var(--color-details);
      background: var(--color-background-white);
      &:focus {
        box-shadow: 0 0 5px 0 var(--color-details);
        outline: none;
      }

      &:disabled,
      &[disabled] {
        background: var(--color-light-gray);
        cursor: default;
        box-shadow: none;
      }
    }

    .icon-container {
      position: relative;
      height: 2.9rem;
      width: 2.9rem;
      border-radius: 0 5px 5px 0;
      border: 2px solid var(--color-details);
      border-left: 0;
      cursor: pointer;
      background: var(--color-background-white);

      .icon {
        position: absolute;
        inset: 0;
        margin: auto;
        font-size: 1.8rem;
        color: var(--color-details);
      }

      &:focus {
        box-shadow: 0 0 5px 0 var(--color-details);
        outline: none;
      }
    }
  }
}
</style>

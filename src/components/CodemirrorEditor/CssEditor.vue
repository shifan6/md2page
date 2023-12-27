<template>
  <transition enter-active-class="bounceInRight">
    <el-col :span="8" v-show="showCssEditor" class="cssEditor-wrapper">
      <i class="el-icon-close" @click="close"></i>
      <textarea
        id="cssEditor"
        type="textarea"
        placeholder="Your custom css here."
      >
      </textarea>
    </el-col>
  </transition>
</template>

<script>
export default {
  name: `CssEditor`,
  props: {
    showCssEditor: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    close() {
      this.$emit('showCssEditor')
    }
  }
}
</script>

<style lang="less" scoped>
.cssEditor-wrapper {
  position: relative;
}
.el-icon-close {
  position: absolute;
  z-index: 10;
  right: 0;
  top: 0;
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
}
.bounceInRight {
  animation-name: bounceInRight;
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  100% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    transform: translate3d(10px, 0, 0);
  }

  90% {
    transform: translate3d(-5px, 0, 0);
  }

  100% {
    transform: none;
  }
}
</style>

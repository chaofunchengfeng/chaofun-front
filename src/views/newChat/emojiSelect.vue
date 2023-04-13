<template>
  <el-popover ref="popover" :v-model="false" :visible-arrow=false placement="top-start" trigger="click" width="324">
    <span v-for="(item,index) in icons" :key="index" class="item selectDisable" @click="chooseEmoji(item)">{{ item
      }}</span>
    <slot slot="reference"></slot>
  </el-popover>
</template>

<script lang="js">

export default {
  props: {
    callback: {
      type: Function
    }
  },
  data() {
    return {
      icons: [
        '😀', '😃', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '😍', '😘', '🤪', '😝', '👍', '🤝', '🙏', '💪', '👏', '✍️', '💔', '👮‍♂️', '☠️', '👽',
        '🌚', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐷', '🐵', '🙈', '🙉', '🙊', '🐶', '🐮', '🐸'
      ]
    };
  },
  methods: {
    chooseEmoji(item) {
      this.callback(item);
    },
    closePopover() {
      this.$refs.popover.doClose();
    }
  }
};

</script>

<style lang="scss" scoped>

.selectDisable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.item {
  cursor: pointer;
  font-size: 24px;
}

</style>
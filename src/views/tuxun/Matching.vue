<template>
  <div class="matching" >
    <div class="content">
      <div>
        <circle2 style="width: 100px; height: 100px" class="loading_image" background="#F9BA02"></circle2>
      </div>

      <div class="loading_text">
        正在匹配对手中，请稍候...
      </div>

      <div class="matching_home_button">
        <el-button class="home_button" type="warning" @click="end" round>结束匹配</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {Circle2} from 'vue-loading-spinner';
import {tuxunJump, tuxunOpen} from './common';

export default {
  name: 'tuxun-matching',
  components: {
    Circle2,
  },
  props: {

  },
  methods: {
    end() {
      this.$emit('end');
    },
  }
};
</script>

<style lang="scss" scoped>

.matching {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
  .loading_image {
    margin: auto;
  }
  .loading_text {
    margin-top: 2rem;
    color: white;
    font-size: 28px;
  }
  .content {
    color: white;
    font-size: 32px;
  }
  .matching_home_button {
    width: 100%;
  }
}
</style>

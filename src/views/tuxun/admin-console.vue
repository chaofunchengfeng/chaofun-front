<template>
<div class="container">
  <div class="choose-container">
    <el-button @click="toPano" style="margin-top: 1rem">街景审核 {{restPano}}</el-button>
    <div></div>
    <el-button @click="toWonders" style="margin-top: 1rem">街景奇观审核 {{restWonders}}</el-button>
    <div></div>
    <el-button style="margin-top: 1rem">用户封禁</el-button>
<!--    <div>-->
<!--      <el-input placeholder="uid"></el-input>-->
<!--      <div>封禁时间</div>-->
<!--    </div>-->
  </div>
</div>
</template>

<script>
import {tuxunJump, tuxunOpen} from './common';
import {init} from '../../components/game/snake/snake3';
import * as api from '../../api/api';

export default {
  name: 'admin-console',
  data() {
    return {
      restPano: 0,
      restWonders: 0
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/tuxun/admin/getTotalUncheckWonders', {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          this.restWonders = res.data;
        }
      });
      api.getByPath('/api/v0/tuxun/admin/getTotalUncheckPano', {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          this.restPano = res.data;
        }
      });
    },
    toPano() {
      tuxunJump('/tuxun/pano-filter');
    },
    toWonders() {
      tuxunJump('/tuxun/wonders-filter');
    },
    toBan() {

    }
  }
};
</script>

<style lang="scss" scoped>

.container {
  height: 100%;
  width: 100%;

  .choose-container {
    margin: auto;
    width: 30%;

    .input {
      width: 50%;
      //padding-top: 1rem;
      //max-width: 40%;
      //margin: auto;
    }
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .text-create, .img-create .click-create {
    cursor: pointer;

    &:hover {
      transform: scale(1.03);
    }
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .choose-container {
      width: 80%;
    }
  }
}

</style>

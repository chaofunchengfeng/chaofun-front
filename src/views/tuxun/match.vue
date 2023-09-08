<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
    </div>
    <div class="nav">匹配Solo</div>
    <matching v-if="this.showMatch" @end="endMatching" style="margin-top: 2rem"/>
    <div v-else style="margin-top: 1rem">

      <div @click="nmMatching" class="card">
        <div class="title">固定匹配</div>
        <div class="desc"></div>
      </div>
      <div></div>
      <div @click="moveMatching" class="card">
        <div class="title">移动匹配</div>
        <div class="desc"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import {tuxunJump} from "./common";
import Matching from './Matching';


export default {
  name: "match",
  components: {Matching},
  data() {
    return {
      showMatch: false,
      notifyStatus: '',
      from: null,
      path: null,
      t: null,
    }
  },
  created() {
    this.init();
    this.from = this.$route.query.from;
    if (this.from === 'move') {
      this.moveMatching();
    } else if (this.from === 'noMove') {
      this.nmMatching();
    }
  },
  methods: {
    init() {
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    nmMatching() {
      this.showMatch = true;
      this.path = '/api/v0/tuxun/solo/joinRandom';
      this.match();
    },
    moveMatching() {
      this.showMatch = true;
      this.path = '/api/v0/tuxun/solo/joinMoveRandom';
      this.match();
    },
    endMatching() {
      this.showMatch = false;
      clearInterval(this.t);
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    match() {
      // 每3秒发送一次心跳
      this.doLoginStatus().then((res) => {
        this.continueSend = true;
        var interval = 1500;
        this.t = setInterval(() => {
          try {
            if (this.continueSend) {
              this.continueSend = false;
              api.getByPathLongTimeout(this.path, {interval: interval}).then(res => {
                if (res.data) {
                  if (!this.showMatch) {
                    return;
                  }
                  this.showMatch = false;
                  tuxunJump( '/tuxun/solo_game?gameId=' + res.data);
                  this.gameId = res.data;
                  this.init();
                  this.continueSend = false;
                  clearInterval(this.t);
                } else {
                  this.continueSend = true;
                }
              });
            }
          } catch (e) {
            this.continueSend = true;
          }
        }, interval);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color:  $tuxunBackgroundColor;
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 5000;
  }
  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }
  .card {
    //width: content-box;
    display: inline-block;
    cursor: pointer;
    max-width: 90%;
    margin-top: 3rem;
    padding-top: 2rem;
    padding-left: 4rem;
    padding-right: 4rem;
    padding-bottom: 2rem;
    border-radius: 10px;
    background-color: #2b2f3a;

    .title {
      font-size: 24px;
      font-weight: bold;
      color: white;
    }
    .desc {

    }
    &:hover {
      transform: scale(1.05);
    }
  }

}
</style>

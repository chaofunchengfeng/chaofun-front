<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" round>←返回</el-button>
      <el-button v-if="!tuxunApp" @click="goHome" round>首页</el-button>
    </div>
    <div class="nav">匹配Solo</div>
    <div v-if="tips===0" style="color: white; padding-top: 10px">提示：第一位选手选择后触发倒计时15秒，如果倒计时时间不准，请调整系统时间</div>
    <div v-if="tips===1" style="color: white; padding-top: 10px">提示：用户初始积分为1500</div>
    <div v-if="tips===2" style="color: white; padding-top: 10px">提示：移动匹配更适合新人，固定匹配适合有一定基础的用户</div>
    <div v-if="tips===3" style="color: white; padding-top: 10px">提示：12月31日本赛季结束，开启新赛季</div>
    <div v-if="tips===4" style="color: white; padding-top: 10px">提示：如果所有人都确认选择，倒计时将会提前结束</div>
    <div v-if="tips===5" style="color: white; padding-top: 10px">提示：在倒计时结束后，如果你没有确认选择，系统将会选取你最后在地图上的选择作为你提交的答案</div>
    <matching v-if="this.showMatch" @end="endMatching" style="margin-top: 2rem"/>
    <div v-else style="margin-top: 1rem">
      <div @click="nmMatching" class="card">
        <div class="title">固定匹配</div>
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
      tips: null,
      path: null,
      t: null,
    }
  },
  created() {
    this.init();
    this.tips =Math.floor(Math.random() * (6));
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
      tuxunJump('https://tuxun.fun/')
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
        tuxunJump('https://tuxun.fun/');
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

<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
    </div>
    <div v-if="mapsData" style="padding-top: 4rem">
      <div style="align-items: center">
        <img :src="imgOrigin + (mapsData.cover || 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg' )" class="cover">
      </div>
      <div v-if="name" class="nav">
        {{name}}
      </div>

      <div v-if="mapsData.canMove">
        <div style="color: white; font-size: 18px; padding-top: 1rem">
          移动
        </div>
        <el-switch
            v-model="move"
            @change="changeMove"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>
      <div v-if="!this.move">
        <div style="color: white; font-size: 18px; padding-top: 1rem">
          自由视角
        </div>

        <el-switch
            @change="changeFree"
            v-model="free"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="this.move"
        >
        </el-switch>
      </div>



      <div style="color: white; font-size: 18px; padding-top: 1rem">
        轮次无限时间
      </div>

      <el-switch
          v-model="timeInfinity"
          active-color="#13ce66"
          inactive-color="#ff4949"
      >
      </el-switch>

      <div v-if="!timeInfinity" style="padding-top: 1rem; font-size: 16px; color: white">
        <el-input-number v-model="timeLimitSeconds" :min=5 :max=600 :step=5 />
        <div>
          (秒)
        </div>
      </div>
<!--      </div>-->


<!--      <div style="color: white; font-size: 18px; padding-top: 1rem">-->
<!--        无限轮次-->
<!--      </div>-->

<!--      <el-switch-->
<!--          v-model="infinityRound"-->
<!--          active-color="#13ce66"-->
<!--          inactive-color="#ff4949"-->
<!--      >-->
<!--      </el-switch>-->

<!--      <div v-if="!infinityRound" style="padding-top: 1rem; font-size: 16px; color: white">-->
<!--        <el-input-number v-model="rounds" :min=1 :max=100 :step=1 />-->
<!--        <div>-->
<!--          轮-->
<!--        </div>-->
<!--      </div>-->

      <div style="padding-top: 2rem">
      </div>
      <el-button @click="createChallenge" type="primary" style="font-size: 20px" round>开始(经典5轮)</el-button>
      <div style="height: 10px"></div>
      <el-button @click="createInfinity" type="primary" style="font-size: 20px" round>开始(无限轮次)</el-button>
      <div style="height: 10px"></div>
      <el-button v-if="mapsData && mapsData.countryStreak" @click="createMapStreak" type="primary" style="font-size: 20px" round>开始(国家连胜)</el-button>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import {tuxunJump} from "./common";

export default {
  name: "maps-start",
  data() {
    return {
      history: null,
      mapsId: null,
      name: null,
      desc: null,
      mapsData: null,
      move: true,
      free: true,
      rounds: 5,
      infinityRound: false,
      timeInfinity: true,
      timeLimitSeconds: 60
    }
  },
  created() {
    this.history = history;
    this.mapsId = this.$route.query.mapsId;
    this.getMapsInfo();
  },
  methods: {
    getMapsInfo() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
        this.mapsData = res.data;
        if (!res.data.canMove) {
          this.move = false;
        }
      });
    },
    changeFree() {
      console.log("changeFree")
      if (!this.free) {
        this.move = false;
      }
    },

    changeMove() {
      console.log("move")
      if (!this.free) {
        this.free = true;
        this.$toast('非自由视角下只能为固定模式')
      }
    },

    createInfinity() {
      this.infinityRound = true;
      this.createChallenge();
    },

    createMapStreak() {
      var pan = true;
      var zoom = true;
      var timeLimitMS = null
      if (!this.free) {
        pan = false;
        zoom = false;
      }

      if (!this.timeInfinity) {
        timeLimitMS = this.timeLimitSeconds * 1000;
      }

      api.getByPath('/api/v0/tuxun/streak/createMapCountryStreak', {
        'mapsId': this.mapsId,
        'move': this.move,
        'pan': pan,
        'zoom': zoom,
        'timeLimit': timeLimitMS,
      }).then(res => {
        if (res.success) {
          console.log(res.data);
          tuxunJump('/tuxun/solo_game?streakId=' + res.data.id);
        } else {
          if (res.errorCode === 'need_vip') {
            this.$vip();
          }
        }
      });
    },

    createChallenge() {
      var pan = true;
      var zoom = true;
      var timeLimitMS = null
      if (!this.free) {
        pan = false;
        zoom = false;
      }

      if (!this.timeInfinity) {
        timeLimitMS = this.timeLimitSeconds * 1000;
      }

      if (this.infinityRound) {
        api.getByPath('/api/v0/tuxun/infinity/createGame', {
          'mapsId': this.mapsId,
          'move': this.move,
          'pan': pan,
          'zoom': zoom,
          'timeLimit': timeLimitMS,
          infinityRound: this.infinityRound,
          rounds: this.rounds
        }).then(res => {
          if (res.success) {
            tuxunJump('/tuxun/solo_game?infinityId=' + res.data);
          } else {
            if (res.errorCode === 'need_vip') {
              this.$vip();
            }
          }
        });

      } else {

        api.getByPath('/api/v0/tuxun/challenge/create', {
          'mapsId': this.mapsId,
          'move': this.move,
          'pan': pan,
          'zoom': zoom,
          'timeLimit': timeLimitMS,
          infinityRound: this.infinityRound,
          rounds: this.rounds
        }).then(res => {
          if (res.success) {
            tuxunJump('/tuxun/challenge?challengeId=' + res.data);
          } else {
            if (res.errorCode === 'need_vip') {
              this.$vip();
            }
          }
        });
      }
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
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
  background-color: #090723;

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 1rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
    text-align: left;
  }
  .cover {
    width: 20vw;
    height: 10vw;
    object-fit: contain;
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .cover {
      width: 50vw;
      height: 25vw
    }
  }
}
</style>

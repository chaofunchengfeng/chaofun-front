<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome"  round>首页</el-button>
    </div>

    <div class="nav">
      历史记录
    </div>
    <div style="color: white">目前只记录积分比赛</div>
    <div class="list">
      <div v-for="(item, index) in list" class="list-item">
        <div> {{moment(item.gmt_create).format('YY年MM月DD日 HH:mm')}}</div>
        <div>
          <div v-if="item.type === 'solo_match'" class="solo-match" @click="toGame(item)">匹配solo</div>
          <div v-else="item.type === 'solo_match'" class="main-game">积分赛</div>
        </div>
        <div>
          <div v-if="item.ratingChange >= 0" class="rating-change positive">
            +{{item.ratingChange}}
          </div>
          <div v-else class="rating-change nagative">
            {{item.ratingChange}}
          </div>
        </div>
        <div class="score">
          {{item.rating}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as api from "../../api/api";
import 'moment/locale/zh-cn';
import moment from 'moment';
import {tuxunJump} from "./common";

export default {
  name: "activities",
  data() {
    return {
      moment: moment,
      list: []
    }
  },
  created() {
    this.history = history;
    this.getHistory();
  },
  methods: {
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    getHistory() {
      api.getByPath('/api/v0/tuxun/getUserHistory', {userId: this.$store.state.user.userInfo.userId}).then(res=>{
        if (res.success) {
          this.list = res.data.slice(0, 100);
        }
      });
    },
    toGame(item) {
      tuxunJump('/tuxun/solo_game?gameId=' + item.gameId);
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;
  div {
    color: white;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }
  .list{
    width: 30%;
    padding-top: 2rem;
    margin: auto;
    text-align: left;
    .list-item {
      display: flex;
      margin-top: 10px;
      .solo-match {
        margin-left: 1rem;
        cursor: pointer;
        font-weight: bolder;
      }
      .main-game {
        margin-left: 1rem;
      }
      .rating-change {
        margin-left: 1rem;
      }
      .positive {
        color: green;
      }
      .nagative {
        color: red;
      }
      .score {
        margin-left: 1rem;
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .list {
      width: 80%;
    }
  }
}

</style>

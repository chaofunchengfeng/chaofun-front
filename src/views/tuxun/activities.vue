<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome"  round>首页</el-button>
    </div>

    <div class="nav">
      比赛历史
    </div>
    <div v-if="!isSelf" style="color: white">只能查看20挑他人积分比赛记录}}</div>

    <div class="list">
      <el-dropdown  @command="handleCommand" >
        <el-button >
          {{choose}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="getAll">全部</el-dropdown-item>
          <el-dropdown-item @click.native="getRating">积分</el-dropdown-item>
          <el-dropdown-item @click.native="getParty">派对</el-dropdown-item>
          <el-dropdown-item @click.native="getMaps">题库</el-dropdown-item>
          <el-dropdown-item @click.native="getOther">其他</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-for="(item, index) in list" class="list-item">
        <div> {{moment(item.gmtCreate).format(isSelf?'YY年MM月DD日 HH:mm':'YY年MM月DD日')}}</div>
        <div>
          <div v-if="item.type === 'solo_match'" class="solo-match" @click="toGame(item)">匹配solo</div>
          <div v-if="item.type === 'main_game'" class="main-game">积分赛</div>
          <div v-if="item.type === 'daily_challenge'"  class="solo-match" @click="toGame(item)">每日挑战</div>
          <div v-if="item.type === 'infinity'"  class="solo-match" @click="toGame(item)">无限轮次</div>
          <div v-if="item.type === 'battle_royale'"  class="solo-match" @click="toGame(item)">淘汰赛</div>
          <div v-if="item.type === 'challenge'"  class="solo-match" @click="toGame(item)">经典五轮</div>
          <div v-if="item.type === 'team_match'"  class="solo-match" @click="toGame(item)">组队匹配</div>
          <div v-if="item.type === 'solo'"  class="solo-match" @click="toGame(item)">1V1对决</div>
          <div v-if="item.type === 'team'"  class="solo-match" @click="toGame(item)">1V1组队对决</div>
          <div v-if="item.type === 'map_country_streak'"  class="solo-match" @click="toGame(item)">题库国家连胜</div>
          <div v-if="item.type === 'country_streak'"  class="solo-match" @click="toGame(item)">国家连胜</div>
          <div v-if="item.type === 'province_streak'"  class="solo-match" @click="toGame(item)">省份连胜</div>
        </div>
        <div v-if="item.rating">
          <div v-if="item.ratingChange >= 0" class="rating-change positive">
            +{{item.ratingChange}}
          </div>
          <div v-else class="rating-change nagative">
            {{item.ratingChange}}
          </div>
        </div>
        <div v-if="item.rating" class="score">
          {{item.rating}}
        </div>
        <div v-if="item.type !== 'main_game'" class="review"><el-button type="warning" size="mini" round @click="toGame(item)">复盘</el-button></div>
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '../../api/api';
import 'moment/locale/zh-cn';
import moment from 'moment';
import {tuxunJump} from './common';

export default {
  name: 'activities',
  data() {
    return {
      userId: null,
      isSelf: false,
      choose: '全部',
      moment: moment,
      list: []
    };
  },
  created() {
    this.userId = new URL(location.href).searchParams.get('userId');
    if(!this.userId){
      //如果没有用户id参数则默认查看自己的历史
      this.userId = this.$store.state.user.userInfo.userId;
    }
    this.isSelf = (this.userId == this.$store.state.user.userInfo.userId);
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
      tuxunJump('/tuxun/');
    },
    handleCommand(command) {
    },
    getRating() {
      this.choose="积分"
      api.getByPath('/api/v0/tuxun/history/listSelfRating', {count: 200}).then(res=>{
        if (res.success) {
          this.list = res.data.slice(0, 100);
        }
      });
    },

    getAll() {
      this.choose="全部"
      api.getByPath('/api/v0/tuxun/history/listSelf', {count: 200}).then(res=>{
        if (res.success) {
          this.list = res.data.slice(0, 100);
        }
      });
    },

    getParty() {
      this.choose="派对"
      api.getByPath('/api/v0/tuxun/history/listSelfParty', {count: 200}).then(res=>{
        if (res.success) {
          this.list = res.data.slice(0, 100);
        }
      });
    },

    getOther() {
      this.choose="其他"
      api.getByPath('/api/v0/tuxun/history/listSelfOther', {count: 200}).then(res=>{
        if (res.success) {
          this.list = res.data.slice(0, 100);
        }
      });
    },

    getMaps() {
      this.choose="题库"
      api.getByPath('/api/v0/tuxun/history/listSelfMaps', {count: 200}).then(res=>{
        if (res.success) {
          this.list = res.data.slice(0, 100);
        }
      });
    },

    getHistory() {
      if (this.isSelf) {
        this.getAll();
      } else {
        api.getByPath('/api/v0/tuxun/history/listOtherRating', {userId: this.userId}).then(res=>{
          if (res.success) {
            this.list = res.data.slice(0, 100);
          }
        });
      }

    },
    toGame(item) {
      tuxunJump('/tuxun/solo_game?gameId=' + item.gameId);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color:  $tuxunBackgroundColor;
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
    width: 60%;
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
      .review{
        margin-left: 1rem;
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .list {
      width: 90%;
    }
  }
}

</style>

<template>
  <div class="container">
    <div class="top-left">
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome"  round>首页</el-button>
    </div>
    <div style="width: 100%; text-align: center; align-items: center; padding-top: 20px">
        <div @click="toUser(userProfile)" v-if="this.userProfile" class="left">
          <img :src="imgOrigin+this.userProfile.userAO.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt="">
          <div class="info">
            <div class="title">{{this.userProfile.userAO.userName}} (uid: {{this.userProfile.userAO.userId}})</div>
          </div>
          <div v-if="isVip">
            图寻会员 <span v-if="vipDue">｜过期时间 {{vipDue}}</span>
          </div>

          <div v-if="ban">
            封禁中
          </div>
        </div>
      <div v-if="!this.userProfile || this.$store.state.user.userInfo.userId !== this.userProfile.userAO.userId" style="margin-top: 10px">
        <el-button v-if="checkFriend && !friend" @click="applyFriend" round>添加好友</el-button>
        <el-button v-if="checkFriend && friend" disabled="true" round>好友</el-button>
      </div>

      <div v-if="!this.userProfile || this.$store.state.user.userInfo.userId !== this.userProfile.userAO.userId" style="margin-top: 10px">
        <el-button @click="openReportUserDialog" round>举报用户</el-button>
      </div>

      <el-button v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId" @click="logout()">退出登录</el-button>
      <div style="height: 10px"></div>
      <el-button v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId" @click="$vip()">续费/开通会员</el-button>
      <div style="height: 10px"></div>
      <el-button v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId" @click="changeSetting()">修改用户名/头像</el-button>
      <div style="height: 10px"></div>
      <el-button v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId" @click="toHistory()">历史记录</el-button>
    </div>
    <div v-if="this.userProfile" style="padding-left: 20px">
      <div>
        <span>分数: </span>
        <span style="color: red">{{this.userProfile.rating}}</span>
      </div>
      <div>
        <span>排名: </span>
        <span style="color: blue">{{this.userProfile.rank}}</span>
      </div>
<!--      <div>-->
<!--        <span>贡献街景: </span>-->
<!--        <span>{{this.userProfile.contributes}}</span>-->
<!--      </div>-->
      <div>
        <span>最高分: </span>
        <span>{{this.userProfile.maxRating}}</span>
      </div>
      <div>
        <span>最高排名: </span>
        <span>{{this.userProfile.maxRanking}}</span>
      </div>

      <div>
        <span>游戏次数:  </span>
        <span>{{this.userProfile.gameTimes}}</span>
      </div>

      <div>
        <span>匹配Solo胜率: </span>
        <span v-if="this.userProfile.soloTimes">{{(this.userProfile.soloWin / this.userProfile.soloTimes * 100).toFixed(2)}} %</span>
        <span v-else>-</span>
      </div>

      <div>
        <span>匹配Solo目前连胜:  </span>
        <span>{{this.userProfile.winningStreak}}</span>
      </div>

      <div>
        <span>匹配Solo最长连胜:  </span>
        <span>{{this.userProfile.longestWinningStreak}}</span>
      </div>

      <div>
        <span>匹配Solo目前连败:  </span>
        <span>{{this.userProfile.loseStreak}}</span>
      </div>

      <div>
        <span>匹配Solo最长连败:  </span>
        <span>{{this.userProfile.longestLoseStreak}}</span>
      </div>
    </div>
    <div style="padding-left: 20px; padding-top: 20px; padding-right: 20px">
      <div style="font-size: 20px">
        分数走势：
      </div>
      <v-chart class="chart" :option="option"/>
    </div>
    <div style="padding-left: 20px; padding-top: 20px; padding-right: 20px">
      <div style="font-size: 20px">
        游戏活跃：
      </div>
      <calendar-heatmap :values="this.activity" :end-date="this.endDate" tooltip-unit="活动" />
    </div>
  </div>

</template>

<script>
// @ is an alias to /src

import moment from 'moment';
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api';
import { CalendarHeatmap } from 'vue-calendar-heatmap';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import {tuxunJump, tuxunOpen} from './common';


use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);


export default {
  name: 'tuxun-profile',
  components: {
    CalendarHeatmap,
    VChart
  },
  data(){
    return {
      userId: null,
      userProfile: null,
      endDate: null,
      checkFriend: false,
      activity: [],
      vipDue: null,
      isVip: false,
      history: null,
      friend: false,
      ban: false,
      showReport: false,
      option: {
        xAxis: {
          type: 'time',
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    };
  },
  created() {
    this.history = history;
    this.userId = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.endDate = yyyy + '-' + mm + '-' + dd;
    this.getUserProfile();
    this.getUserActivity();
    this.getHistory();
    this.checkVip();
    this.checkBan();
    this.checkFriendFunc();
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout');
      setTimeout(() => {
        tuxunJump('/tuxun/');
      }, 1000);
    },
   checkBan() {
      api.getByPath('/api/v0/tuxun/user/checkBan', {userId: this.userId}).then(res=>{
        if (res.data) {
          this.ban = true;
        }
      });
    },
    getUserProfile() {
      api.getByPath('/api/v0/tuxun/getProfile', {userId: this.userId}).then(res=>{
        this.userProfile = res.data;
      });
    },
    getUserActivity() {
      api.getByPath('/api/v0/tuxun/getUserDailyActivity', {userId: this.userId}).then(res=>{
        this.activity = res.data;
      });
    },
    getHistory() {
      api.getByPath('/api/v0/tuxun/getUserHistory', {userId: this.userId}).then(res=>{
        this.historys = res.data;
        console.log(this.historys);
        var data = [];

        this.historys = this.historys.reverse();
        for (let i = 0; i < this.historys.length; i++) {
          var history = this.historys[i];
          data.push([history['gmt_create'], history['rating']]);
        }
        this.option.series = [{
          data:data,
          type: 'line',
          smooth: false
        }];
      });

    },
    toUser(item){
      // try {
      //   window.flutter_inappwebview.callHandler('toAppUser',{userId: item.userAO.userId + ''});
      // } catch (e) {
      //   window.open(location.origin + '/user/' + item.userAO.userId,'_blank');
      // }
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    changeSetting() {
      tuxunJump('/tuxun/settings');
    },
    checkFriendFunc() {
      api.getByPath('/api/v0/tuxun/friend/check', {friend: this.userId}).then(res => {
        if (res.success) {
          this.checkFriend = true;
          this.friend = res.data;
        }
      });
    },
    checkVip() {
      if (this.$store.state.user.userInfo.userId == this.userId) {
        api.getByPath('/api/v0/tuxun/vip/check').then(res=>{
          if (res.data) {
            this.isVip = true;
            this.vipDue = moment(res.data).format('YYYY年MM月DD日');
          }
        });
      } else {
        api.getByPath('/api/v0/tuxun/vip/checkIsVip', {userId: this.userId}).then(res => {
          if (res.data) {
            this.isVip = true;
          }
        });
      }
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    applyFriend() {
      api.getByPath('/api/v0/tuxun/friend/apply', {friend: this.userId}).then(res => {
        if (res.success) {
          this.checkFriend = true;
          this.friend = res.data;
          this.$toast('已发送申请');
        }
      });
    },
    toHistory() {
      tuxunJump('/tuxun/activities')
    },
    openReportUserDialog() {
      this.$confirm( '恶意举报可能会被处以短期封禁处罚', '你确定要举报用户吗？',{
        confirmButtonText: '确定',
        callback: action => {
          if (action == 'confirm') {
            api.getByPath('/api/v0/tuxun/user/report', {target: this.userId}).then(res => {
              if (res.success) {
                this.$toast('举报成功！');
              }
            });
          }
        }
      });

    }
  }
};
</script>
<style scoped lang="scss">
.container {
  background-color: #090723;
  div {
    color: white;
  }

  .top-left {
    padding-left: 1rem;
    padding-top: 1rem;
  }

}
.chart {
  //height: 50vh;
  height: 400px;
}
</style>

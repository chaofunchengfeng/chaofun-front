<template>
  <div class="container">
    <div class="nav">
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" round>首页</el-button>
    </div>
    <div class="user-section" style="text-align: center;">
      <div class="header" v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId">
        <el-link @click="logout()" :underline="false">
          <svg-icon icon-class="logout" class-name="header-icon" />
          <span class="header-btn">退出登录</span>
        </el-link>
        <el-link @click="changeSetting()" :underline="false">
          <svg-icon icon-class="edit" class-name="header-icon" />
          <span class="header-btn">个人设置</span>
        </el-link>
        <el-link @click="toHistory()" :underline="false">
          <svg-icon icon-class="history" class-name="header-icon" />
          <span class="header-btn">历史记录</span>
        </el-link>
      </div>
      <div v-if="this.userProfile" class="user-profile">
        <div style="display: flex;">
          <div class="user-img">
            <img :src="imgOrigin + this.userProfile.userAO.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt="" />
          </div>
          <div class="user-info">
            <div class="nickname">{{ this.userProfile.userAO.userName }}</div>
            <div class="uid">uid: {{ this.userProfile.userAO.userId }}</div>
            <div v-if="isVip">
              <div class="vip">
                <svg-icon icon-class="vip" class-name="header-icon" />
                图寻会员
                <el-button type="warning" size="mini" round
                  v-if="this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId"
                  @click="$vip()">续费</el-button>
              </div>
              <div v-if="vipDue" class="duetime">过期时间：{{ vipDue }}</div>
            </div>
            <div v-else>
              <div class="vip-not">
                <svg-icon icon-class="vip" class-name="header-icon" />
                普通用户
                <el-button type="warning" size="mini" round
                  v-if="this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId"
                  @click="$vip()">开通会员</el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="ban" class="ban">封禁中</div>
        <div v-if="!this.userProfile || this.$store.state.user.userInfo.userId !== this.userProfile.userAO.userId"
          style="margin-top: 10px">
          <el-link v-if="checkFriend && !friend" @click="applyFriend" :underline="false">
            <svg-icon icon-class="add-friend" class-name="header-icon" />
            <span class="header-btn">添加好友</span>
          </el-link>
          <el-link v-if="checkFriend && friend" :underline="false" disabled style="color: #0E62C9;">
            <i class="el-icon-check"></i>
            <span class="header-btn">已加好友</span>
          </el-link>
          <el-link @click="openReportUserDialog" :underline="false" style="margin-left: 15px;">
            <i class="el-icon-warning-outline"></i>
            <span class="header-btn">举报用户</span>
          </el-link>
        </div>
      </div>
    </div>
    <div class="rank-section" v-if="this.userProfile">
      <table style="margin: 0 auto;text-align: left;">
        <tr>
          <td class="rank-title" style="text-align: center;">总场次</td>
          <td class="rank-title" style="padding-left: 20px;">分数：</td>
          <td class="rank-num" style="color: #D43030;">{{ this.userProfile.rating || '-' }}</td>
          <td class="rank-title" style="padding-left: 20px;">排名：</td>
          <td class="rank-num" style="color: #C47222;">{{ this.userProfile.rank || '-' }}</td>
        </tr>
        <tr>
          <td style="text-align: center;color: #00BAAD;font-size: 30px;font-weight: 900;">
            {{ this.userProfile.gameTimes || '-' }}</td>
          <td class="rank-title" style="padding-left: 20px;">最高分：</td>
          <td class="rank-num" style="color: #D43030;">{{ this.userProfile.maxRating || '-' }}</td>
          <td class="rank-title" style="padding-left: 20px;">最高排名：</td>
          <td class="rank-num" style="color: #C47222;">{{ this.userProfile.maxRanking || '-' }}</td>
        </tr>
      </table>
    </div>
    <div class="solo-section" v-if="this.userProfile">
      <div class="head">匹配Solo战绩</div>
      <el-row style="margin-top: 30px;">
        <el-col :span="8" :xs="24">
          <div class="win-title">胜率</div>
          <div class="win-rate" v-if="this.userProfile.soloTimes">{{ (this.userProfile.soloWin / this.userProfile.soloTimes
            * 100).toFixed(2) }}%</div>
          <div class="win-rate" v-else>-</div>
        </el-col>
        <el-col :span="8" :xs="24" class="solo-data">
          <div>
            <span class="solo-title">当前连胜</span>
            <span class="solo-num" style="color: #40B5C5;">{{ this.userProfile.winningStreak }}</span>
          </div>
          <div>
            <span class="solo-title">最长连胜</span>
            <span class="solo-num" style="color: #40B5C5;">{{ this.userProfile.longestWinningStreak }}</span>
          </div>
        </el-col>
        <el-col :span="8" :xs="24" class="solo-data">
          <div>
            <span class="solo-title">当前连败</span>
            <span class="solo-num" style="color: #D95A5A">{{ this.userProfile.loseStreak }}</span>
          </div>

          <div>
            <span class="solo-title">最长连败</span>
            <span class="solo-num" style="color: #D95A5A">{{ this.userProfile.longestLoseStreak }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="padding-left: 20px; padding-top: 20px; padding-right: 20px">
      <div style="font-size: 20px">
        分数走势：
      </div>
      <v-chart class="chart" :option="option" />
    </div>
    <div style="padding-left: 20px; padding-top: 20px; padding-right: 20px">
      <div style="font-size: 20px">
        游戏活跃：
      </div>
      <calendar-heatmap :locale="this.heatmapLocale" :values="this.activity" :end-date="this.endDate" tooltip-unit="活动" />
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
import { tuxunJump, tuxunOpen } from './common';

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
  data() {
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
        tooltip:{
          show:true
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      heatmapLocale:{
        days:['周一','周二','周三','周四','周五','周六','周日'],
        months:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        on:'~',
        less:'少',
        more:'多'
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
      api.getByPath('/api/v0/tuxun/user/checkBan', { userId: this.userId }).then(res => {
        if (res.data) {
          this.ban = true;
        }
      });
    },
    getUserProfile() {
      api.getByPath('/api/v0/tuxun/getProfile', { userId: this.userId }).then(res => {
        this.userProfile = res.data;
      });
    },
    getUserActivity() {
      api.getByPath('/api/v0/tuxun/getUserDailyActivity', { userId: this.userId }).then(res => {
        this.activity = res.data;
      });
    },
    getHistory() {
      api.getByPath('/api/v0/tuxun/getUserHistory', { userId: this.userId }).then(res => {
        this.historys = res.data;
        console.log(this.historys);
        var data = [];

        this.historys = this.historys.reverse();
        for (let i = 0; i < this.historys.length; i++) {
          var history = this.historys[i];
          data.push([history['gmt_create'], history['rating']]);
        }
        this.option.series = [{
          data: data,
          type: 'line',
          areaStyle: {},
          smooth: false
        }];
      });

    },
    toUser(item) {
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
      api.getByPath('/api/v0/tuxun/friend/check', { friend: this.userId }).then(res => {
        if (res.success) {
          this.checkFriend = true;
          this.friend = res.data;
        }
      });
    },
    checkVip() {
      if (this.$store.state.user.userInfo.userId == this.userId) {
        api.getByPath('/api/v0/tuxun/vip/check').then(res => {
          if (res.data) {
            this.isVip = true;
            this.vipDue = moment(res.data).format('YYYY年MM月DD日');
          }
        });
      } else {
        api.getByPath('/api/v0/tuxun/vip/checkIsVip', { userId: this.userId }).then(res => {
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
      api.getByPath('/api/v0/tuxun/friend/apply', { friend: this.userId }).then(res => {
        if (res.success) {
          this.checkFriend = true;
          this.friend = res.data;
          this.$toast('已发送申请');
        }
      });
    },
    toHistory() {
      tuxunJump('/tuxun/activities');
    },
    openReportUserDialog() {
      this.$confirm('恶意举报可能会被处以短期封禁处罚', '你确定要举报用户吗？', {
        confirmButtonText: '确定',
        callback: action => {
          if (action == 'confirm') {
            api.getByPath('/api/v0/tuxun/user/report', { target: this.userId }).then(res => {
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
  color: white;
  padding: 1rem;

  .nav {
    left: 1rem;
    top: 1rem;
    position: absolute;
  }

  .header {
    color: #A6A6A6;

    .header-icon {
      width: 1.2rem;
      height: 1.2rem;
      margin-left: 15px;
    }

    .header-btn {
      margin-left: 5px;
      font-size: 1.2rem;
      font-weight: 400;
    }
  }

  .user-profile {
    background: #CCCCCC21;
    width: fit-content;
    width: -moz-fit-content;
    text-align: left;
    margin: 50px auto;
    margin-bottom: 20px;
    padding: 20px 100px;
    border-radius: 10px;

    .user-img {
      img {
        border-radius: 5px;
      }
    }

    .ban {
      color: red;
      font-size: 22px;
      font-weight: 400;
      text-align: center;
    }

    .header-btn {
      margin-left: 5px;
    }

    .user-info {
      flex-grow: 1;
      padding-left: 15px;

      .nickname {
        font-size: 1.2rem;
        font-weight: 700;
        color: #E5E5E5;
      }

      .uid {
        font-size: 16px;
        font-weight: 400;
        color: #E5E5E5;
      }

      .vip {
        color: #FF8D1A;
        font-size: 18px;
        font-weight: 200;
      }

      .vip-not {
        color: #808080;
        font-size: 16px;
        font-weight: 200;
      }

      .duetime {
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF72;
        margin-top: 5px;
      }
    }
  }

  .rank-section {
    .rank-title {
      color: white;
      font-weight: 400;
    }

    .rank-num {
      font-weight: 900;
    }
  }

  .solo-section {
    background: #CCCCCC21;
    max-width: 60%;
    text-align: center;
    margin: 20px auto;
    padding: 20px 15px;
    border-radius: 10px;

    .head {
      width: 170px;
      border-bottom: solid;
      text-align: center;
      margin: 0 auto;
      color: #E5E5E5;
      font-size: 1.5rem;
      font-weight: 900;
    }

    .win-title {
      text-align: center;
      font-size: 1.4rem;
      font-weight: 400;
      color: white;
    }

    .win-rate {
      margin: 0px auto;
      margin-top: 10px;
      text-align: center;
      color: #00baad;
      font-weight: 900;
      border-radius: 50%;
      background-color: #CCCCCC26;
    }

    .solo-title {
      color: white;
      font-size: 1.3rem;
      font-weight: 200;
      vertical-align: middle;
    }

    .solo-num {
      margin-left: 20px;
      font-size: 1.5rem;
      font-weight: 900;
      vertical-align: middle;
    }
  }
}

.el-col {
  padding-bottom: 0px !important;
}

//PC
@media screen and (min-device-width: 992px) {
  .solo-data {
    margin-top: 30px;
    text-align: left;
  }

  .win-rate {
    width: 7rem;
    height: 7rem;
    font-size: 1.4rem;
    line-height: 7rem;
  }

  .rank-title {
    font-size: 1.1rem;
  }

  .rank-num {
    font-size: 1.2rem;
  }
}

//H5,Pad
@media screen and (max-device-width: 992px) {
  .user-section{
    .header{
      margin-top: 3.5rem;
      .header-icon {
        width: 1rem;
        height: 1rem;
        margin-left: 15px;
      }

      .header-btn {
        margin-left: 5px;
        font-size: 1rem;
        font-weight: 400;
      }
    }
    .user-profile {
      margin-top: 3rem;
      width: 100% !important;
      padding: 15px !important;
    }
  }

  .nickname {
    font-size: 1rem;
  }

  .rank-title {
    font-size: 0.9rem;
  }

  .rank-num {
    font-size: 1rem;
  }

  .solo-section {
    max-width: 100% !important;
  }

  .solo-data {
    text-align: center;
  }

  .solo-title {
    font-size: 1.1rem !important;
  }

  .solo-num {
    font-size: 1.3rem !important;
  }

  .win-rate {
    width: 7rem;
    height: 7rem;
    font-size: 1.4rem;
    line-height: 7rem;
  }
}

.chart {
  //height: 50vh;
  height: 400px;
}</style>

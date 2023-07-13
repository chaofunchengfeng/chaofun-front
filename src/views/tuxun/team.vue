<template>
  <div>
    <div class="game_container">
      <div class="back_home">
        <el-button @click="goHome" round>首页</el-button>
        <el-button v-if="matchTeamData && $store.state.user.userInfo.userId === matchTeamData.captain.userId" @click="disband" round> 解散队伍 </el-button>
        <el-button v-else @click="leave" round> 离开队伍 </el-button>
      </div>

      <div class="disband">
        <el-button class="button" type="primary" @click="copyInviterLink" round>分享链接</el-button>
<!--        <div style="height: 10px"></div>-->
<!--        <el-button class="button"  @click="inviteFriends" round>邀请好友</el-button>-->
        <!--      <el-button class="button" type="primary" @click="inviteFriends" round>Code加入</el-button>-->
      </div>

      <div v-if="matchTeamData && matchTeamData.status !== 'disband'" class="prepare">

        <div v-if="matchTeamData.status !== 'ongoing'">

          <div style="padding-top: 5rem">
            <div v-if="matchTeamData.status === 'wait_join'">
              <el-button  @click="startMatch" type="primary" size="small">开始匹配</el-button>
            </div>
            <div v-if="matchTeamData.status === 'match'">
<!--              <el-button  size="small">取消匹配</el-button>-->
              <div style="padding-top: 1rem">
                <circle2 style="margin: auto;width: 70px; height: 70px" class="loading_image" background="#F9BA02"></circle2>
              </div>
              <div style="padding-top: 1rem">
                正在匹配对手中，请稍候...
              </div>
            </div>

            <div v-if="matchTeamData.status === 'onging'">
                <el-button @click="gotoGame" round>正在对局...</el-button>
            </div>
          </div>

          <div class="party-name">
            {{matchTeamData.captain.userName}} 组建的队伍
          </div>

          <div class="player">
            <div style="display: flex; flex-flow: row wrap; justify-content: center; width: 100%" v-if="matchTeamData && matchTeamData.players && matchTeamData.players.length >= 1">
              <User v-for="(item, index) in matchTeamData.players" :key="index" :user="item" :teamData="matchTeamData"/>
            </div>
          </div>

        </div>
      </div>
      <div v-if="matchTeamData && matchTeamData.status === 'disband'" style="padding-top: 5rem; color: white; font-size: 20px">
          队伍已经解散
          <div>
            <el-button round @click="leaveAndGet">自己组建队伍</el-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
import User from './user.vue';
import {tuxunJump} from "./common";
import Matching from './Matching';
import {Circle2} from 'vue-loading-spinner';


export default {
  name: "team",
  components: {
    User,Matching,Circle2
  },
  data() {
    return {
      url: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/v0/tuxun`,
      matchTeamData: null
    }
  },
  created() {
    this.init();
  },
  methods: {

    init() {
      api.getByPath('/api/v0/tuxun/matchTeam/get').then(res => {
        if (res.success) {
          this.solveTeamData(res.data, null);
          this.initWS();
        } else if (res.errorCode == 'need_login') {
          this.$login({
            callBack: () => {
              this.$store.dispatch('user/getInfo');
            },
          });
        }
      });
    },

    solveTeamData(teamData, code) {

      if (!teamData) {
        return;
      }

      this.matchTeamData = teamData;

      if (code === 'start_game') {
        tuxunJump('/tuxun/solo_game?gameId=' + this.matchTeamData.gameId);
      }

      if (code === 'party_disband') {
        this.$toast('队伍已解散');
      }
    },

    initWS() {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onclose = this.wsOnClose;
    },

    wsOnMessage(e) {
      const data = JSON.parse(e.data);
      if (data.scope === 'tuxun_team') {
        this.solveTeamData(data.data.team, data.data.code);
      }
    },
    wsOnClose(e) {
      setTimeout(function () {
        this.initWS();
      }.bind(this), 1000);
      console.log('wsOnClose');
    },

    wsOnOpen(e) {
      console.log('wsOnOpen');
      // console.log(e);
      this.wsSend('{"scope": "tuxun", "data": {"type": "subscribe_team", "text": "' + this.matchTeamData.id + '"}}');
      // 每3秒发送一次心跳
      setInterval(() => {
        this.wsSend('{"scope": "heart_beat"}');
      }, 15000);
    },

    wsSend(data) {
      console.log('wsSend: ' + data);
      this.ws.send(data);
    },

    goHome() {
      tuxunJump('/tuxun/')
    },

    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },

    startMatch() {
      api.getByPath('/api/v0/tuxun/matchTeam/startMatch', {teamId: this.matchTeamData.id}).then(res => {
        this.solveTeamData(res.data, null)
      });
    },
    disband() {
      api.getByPath('/api/v0/tuxun/matchTeam/disband', {teamId: this.matchTeamData.id}).then(res => {
        this.goHome();
      });
    },
    leave() {
      api.getByPath('/api/v0/tuxun/matchTeam/leave', {teamId: this.matchTeamData.id}).then(res => {
        this.goHome();
      });
    },
    leaveAndGet() {
      api.getByPath('/api/v0/tuxun/matchTeam/leave', {teamId: this.matchTeamData.id}).then(res => {
        this.init();
      });
    },
    gotoGame() {
      tuxunJump('/tuxun/solo_game?gameId=' + this.matchTeamData.gameId);
    },

    copyInviterLink() {
      var input = document.createElement('input');
      input.setAttribute('value', 'https://tuxun.fun/team-join?teamId=' + this.matchTeamData.id);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast('复制邀请地址成功');
      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  touch-action: manipulation;
}
.back_home {
  position: absolute;
  padding-top: 1rem;
  padding-left: 1rem;
  z-index: 5000;
}

.game_container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color: #18182A;

  .disband {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .home_button {
    z-index: 10000;
    margin-top: 2rem;
    font-size: 16px;
  }

  .player {
    width: 60%;
    margin: auto;

    div {
      color: white;
    }

    .winner_title {
      color: gold;
      font-size: 3rem;
      margin-bottom: 1rem;;
    }

    .loser_title {
      color: silver;
      font-size: 3rem;
      margin-bottom: 1rem;;
    }
  }

  .prepare {
    padding-bottom: 10rem;

    div {
      color: white;
    }
    .party-name {
      padding-top: 1rem;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .header {
      padding-top: 1rem;
      color: white;
      font-size: 20px;
    }
  }
}
</style>

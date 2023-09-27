<template>
  <div class="game_container">
    <div class="back_home">
      <el-button v-if="!tuxunApp" @click="goHome" round>首页</el-button>
      <el-button v-if="partyData && $store.state.user.userInfo.userId === partyData.host.userId" @click="disband" round> 解散派对 </el-button>
      <el-button v-else @click="leave" round> 离开派对 </el-button>
    </div>

    <div class="disband">
      <el-button class="button" type="primary" @click="copyInviterLink" round>分享邀请</el-button>
      <div style="height: 10px"></div>
      <el-button class="button"  @click="inviteFriends" round>邀请好友</el-button>
<!--      <el-button class="button" type="primary" @click="inviteFriends" round>Code加入</el-button>-->
    </div>

    <div v-if="partyData" class="prepare">
      <div class="party-name">
        {{partyData.host.userName}} 的派对
      </div>

      <div class="header">
        {{getGameTypeName(partyData.gameType)}}
        <div style="font-size: 15px">
          <span>{{partyData.gameMapsName}}</span>
          <span v-if="!partyData.gameMove"> | 固定街景</span>
          <span v-if="partyData.gameMove"> | 移动街景</span>
          <span v-if="partyData.gamePan && partyData.gameZomme"> | 自由视角</span>
          <span v-if="!partyData.gamePan && !partyData.gameZoom"> | 固定视角</span>
        </div>
      </div>

      <div v-if="partyData.status !== 'ongoing'">
        <div v-if="partyData.gameType !== 'br'" class="vs">
          <div class="player">
            <div style="display: flex; flex-flow: row wrap; justify-content: center; width: 100%" v-if="partyData && partyData.teams && partyData.teams.length >= 1">
              <User v-for="(item, index) in partyData.teams[0].users" :key="index" :partyData="partyData" :user="item"/>
            </div>
            <div v-if="partyData && (!partyData.teams || partyData.teams.length == 0  || partyData.gameType === 'team')">
              <el-button @click="change2Player(0)" size="small">加入对决</el-button>
            </div>
          </div>
          <div>
            <img class="vs_img"  :src="this.imgOrigin + 'biz/1658807128256_91c9df63c2d144359005b6f504a96a81.png'"/>
            <div></div>
            <el-button @click="swapTeam"  type="primary" v-if="partyData.gameType==='team'" round>换队伍</el-button>
          </div>
          <div class="player">
            <div style="display: flex; flex-flow: row wrap;  justify-content: center; width: 100%" v-if="partyData && partyData.teams && partyData.teams.length >= 2">
              <User v-for="(item, index) in partyData.teams[1].users" :key="index" :partyData="partyData" :user="item"/>
            </div>
            <div v-if="partyData && (!partyData.teams || partyData.teams.length <= 1  || partyData.gameType === 'team')">
              <el-button @click="change2Player(1)" size="small">加入对决</el-button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="player">
            <div style="display: flex; flex-flow: row wrap; justify-content: center; width: 100%" v-if="partyData && partyData.teams && partyData.teams.length >= 1">
              <User v-for="(item, index) in partyData.teams" :key="index" :user="item.users[0]" :partyData="partyData"/>

            </div>
            <div style="padding-top: 1rem">
              <el-button @click="change2Player(0)" size="small">加入对决</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else >
        <div style="margin:5rem 0px">
          <el-button @click="gotoGame" round>正在对局...</el-button>
        </div>
      </div>

      <div class="start_game" v-if="status === 'ready' && this.partyData.gameType !== 'solo_match' && this.partyData.gameType !== 'battle_royale' && this.$store.state.user.userInfo.userId === partyData.host.userId">
        <el-button class="button" type="primary" round @click="start">开始图寻对决</el-button>
      </div>

      <div v-if="(partyData.gameType === 'solo' || partyData.gameType === 'solo_match') && partyData.status === 'wait_join'" class="wait_game_start">
        等待其他玩家加入....
      </div>

      <div v-if="(partyData.gameType === 'team') && partyData.status === 'wait_join'" class="wait_game_start">
        等待其他玩家加入或队伍至少有一人....
      </div>

      <div v-if="(partyData.gameType === 'br') && partyData.status === 'wait_join'" class="wait_game_start">
        淘汰赛至少有两人...
      </div>

      <div v-if="partyData.host && $store.state.user.userInfo.userId !== partyData.host.userId && partyData.status === 'ready' " class="wait_game_start">
        等待房主开始比赛...
      </div>

      <div class="wait_game_start">
        <div class="separate-line"></div>
        <div style="font-size: 24px">围观</div>
        <el-button @click="change2Onlooker" size="small">切换为围观</el-button>
        <div>
          <div class="player">
            <div style="display: flex; flex-flow: row wrap;  justify-content: center; width: 100%" v-if="partyData && partyData.onlookers">
              <User size="small" v-for="(item, index) in partyData.onlookers" :key="index" :partyData="partyData" :user="item"/>
            </div>
          </div>
        </div>
      </div>

      <div v-if=" partyData.gameMapsName " class="wait_game_start">
        <div class="separate-line"></div>
        <div style="padding-top: 10px; font-size: 24px">设置</div>
        <div  style="">
          <div style="font-size: 16px">
            类型： <span v-if="$store.state.user.userInfo.userId !== partyData.host.userId"> {{getGameTypeName(partyData.gameType)}} </span>
          </div>
          <div v-if="$store.state.user.userInfo.userId === partyData.host.userId" style="display: flex;   justify-content: center ">
            <div :class="partyData.gameType === 'solo' ? 'choose-type' : 'normal-type'" @click="changeGameType('solo')" >1v1对决</div>
            <div :class="partyData.gameType === 'team' ? 'choose-type' : 'normal-type'" @click="changeGameType('team')">组队对决</div>
            <div :class="partyData.gameType === 'br' ? 'choose-type' : 'normal-type'" @click="changeGameType('br')">淘汰赛</div>
          </div>
        </div>
        <div  style="padding-top: 2rem;">
          <div style="font-size: 16px">
            题库：{{partyData.gameMapsName}} - <span v-if="partyData.gameMove"> 移动 </span> <span v-else> 固定 </span>
          </div>
          <div>
            <el-button
                v-if="this.$store.state.user.userInfo.userId === this.partyData.host.userId"
                @click="showMapsSearch('noMove')"
                type="primary"
                style="margin-left: 10px"
                size="small"
            >切换题库</el-button>
          </div>
        </div>
        <div style="padding-top: 2rem;" v-if="!this.partyData.gameMove">
          视角：
          <span v-if="this.$store.state.user.userInfo.userId !== this.partyData.host.userId">
            <span v-if="this.free">
              自由视角
            </span>
            <span v-else>
              固定视角
            </span>
          </span>
          <div v-if="this.$store.state.user.userInfo.userId === this.partyData.host.userId">
            <div>
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
        </div>
        <div v-if="partyData && partyData.gameType !== 'br'" style="padding-top: 2rem; font-size: 16px">
          血量：<span v-if="this.$store.state.user.userInfo.userId !== this.partyData.host.userId"> {{this.health}} </span>
          <div></div>
          <el-input-number v-if="this.$store.state.user.userInfo.userId === this.partyData.host.userId" v-model="health" @change="changeHealth" :min=1000 :max=1000000 :step=1000 />
        </div>


        <div v-if="partyData" style="padding-top: 2rem; font-size: 16px">
          倒计时(秒)：<span v-if="this.$store.state.user.userInfo.userId !== this.partyData.host.userId">
          <span v-if='countDown === "first"'>首次确认后 </span>
          <span v-if='countDown === "start"'>轮次开始后 </span>
          {{this.countDownTime}} 秒</span>
          <div v-if="this.$store.state.user.userInfo.userId === this.partyData.host.userId">
            <el-radio @change="changeCountDownTime" v-model="countDown" label="first">首次确认后</el-radio>
            <el-radio @change="changeCountDownTime" v-model="countDown" label="start">轮次开始后</el-radio>
          </div>
          <el-input-number v-if="this.$store.state.user.userInfo.userId === this.partyData.host.userId" v-model="countDownTime" @change="changeCountDownTime" :min=5 :max=600 :step= 5 />
        </div>
      </div>
    </div>
    <tuxun-invite v-if="openInvite" style="z-index: 2000;" :close="closeInvite" :invite="inviteFriend"></tuxun-invite>
  </div>
</template>

<script>
import * as api from '../../api/api';
import {tuxunJump, tuxunOpen} from './common';
import User from './user.vue';
import TuxunInvite from './tuxun-invite'
export default {
  name: 'tuxun-party',
  data() {
    return {
      url: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/v0/tuxun`,
      status: 'wait',
      ws: null,
      partyData: null,
      free: true,
      openInvite: false,
      overflow: null,
      countDown: 'first',
      countDownTime: 15,
      health: 6000,
    };
  },
  components: {
    User,
    TuxunInvite
  },
  created() {
    if (!location.host.includes('tuxun.fun') && !location.host.includes('8099')) {
      window.location.href = window.location.href.replace(location.host + '/tuxun', 'tuxun.fun');
    }
    this.joinByParty();
  },
  methods: {
    initWS() {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onclose = this.wsOnClose;
    },

    wsOnOpen(e) {
      console.log('wsOnOpen');
      // console.log(e);
      this.wsSend('{"scope": "tuxun", "data": {"type": "subscribe_party", "text": "' + this.partyData.id + '"}}');
      // 每3秒发送一次心跳
      setInterval(() => {
        this.wsSend('{"scope": "heart_beat"}');
      }, 1000);
    },

    leave() {
      api.getByPath('/api/v0/tuxun/party/leave').then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/');
        }
      });
    },
    disband() {
      api.getByPath('/api/v0/tuxun/party/disband').then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/');
        }
      });
    },
    changeFree() {
      api.getByPath('/api/v0/tuxun/party/changeFree', {free: this.free}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data);
        }
      });
    },

    showMapsSearch()  {
      this.$mapsSearch(
          { callBack: (mapsId, mapsType) => {
              if (mapsType === 'move') {
                api.getByPath('/api/v0/tuxun/vip/check').then(res => {
                  if (res.data) {
                    this.free = true;
                    this.changeMaps(mapsId, mapsType);
                  } else {
                    this.$vip();
                  }
                });
              } else {
                this.changeMaps(mapsId, mapsType);
              }
            }
          });
    },

    getGameTypeName(gameType) {
      if (this.partyData.gameType === 'solo') {
        return '1v1对决';
      } else if (this.partyData.gameType === 'team') {
        return '组队赛';
      } else if (this.partyData.gameType === 'br') {
        return '淘汰赛';
      }
    },

    change2Onlooker() {
      api.getByPath('/api/v0/tuxun/party/change2Onlooker').then(res=>{
        this.solvePartyData(res.data);
      });
    },

    swapTeam() {
      api.getByPath('/api/v0/tuxun/party/swapTeam').then(res=>{
        this.solvePartyData(res.data);
      });
    },
    change2Player(teamIndex) {
      var teamId = null;
      // console.log(teamIndex);
      // console.log(this.partyData.teams);
      // console.log(this.partyData.teams[teamIndex]);
      // console.log(this.partyData.teams.length)
      if (this.partyData.teams && this.partyData.teams.length > teamIndex) {
        teamId = this.partyData.teams[teamIndex].id;
      }
      api.getByPath('/api/v0/tuxun/party/change2Player', {teamId: teamId}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data);
        }
      });
    },
    changeHealth() {
      api.getByPath('/api/v0/tuxun/party/changeHealth', {health: this.health}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data);
        }
      });
    },
    changeCountDown() {
      api.getByPath('/api/v0/tuxun/party/changeHealth', {health: this.health}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data);
        }
      });
    },
    changeGameType(type) {
      api.getByPath('/api/v0/tuxun/party/changeType', {type: type}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data);
        }
      });
    },
    changeMaps(mapsId, mapsType) {
      // this.$mapsSearch();
      api.getByPath('/api/v0/tuxun/party/changeMaps', {mapsId: mapsId, type: mapsType}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data);
        }
      });
    },

    changeCountDownTime() {
      api.getByPath('/api/v0/tuxun/party/changeCountDown', {countDown: this.countDown, roundTimerPeriod: this.countDownTime * 1000}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data);
        }
      });
    },

    wsSend(data) {
      console.log('wsSend: ' + data);
      this.ws.send(data);
    },

    wsOnMessage(e) {
      const data = JSON.parse(e.data);
      if (data.scope === 'tuxun_party') {
        this.solvePartyData(data.data.party, data.data.code);
      }
    },
    wsOnClose(e) {
      setTimeout(function () {
        this.initWS();
      }.bind(this), 1000);
      console.log('wsOnClose');
    },
    goHome() {
      tuxunJump('/tuxun/');
    },

    solvePartyData(partyData, code) {
      if (partyData === null) {
        return;
      }

      if (code === 'host_change_user_leave') {
        if (partyData.blockPlayerIds.includes(partyData.requestUserId)) {
          this.partyData == null;
          this.$toast('你已被踢出和禁止进入该派对');
        }
      }

      this.partyData = partyData;
      this.status = this.partyData.status;
      this.health = this.partyData.gameHealth;
      if (this.partyData.roundCountDown) {
        this.countDown = this.partyData.roundCountDown;
        this.countDownTime = this.partyData.roundTimerPeriod / 1000;
      } else {
        this.countDown = "first";
        this.countDownTime = 15;
      }
      if (!this.partyData.gamePan && !this.partyData.gameZoom) {
        this.free = false;
      } else {
        this.free = true;
      }
      if (code === 'start_game') {
        tuxunJump('/tuxun/solo_game?gameId=' + this.partyData.gameId);
      }
    },

    joinByParty() {
      api.getByPath('/api/v0/tuxun/party/joinByParty').then(res=>{
            if (res.success) {
              this.solvePartyData(res.data, null);
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


    getPartyInfo() {
      api.getByPath('/api/v0/tuxun/party/get').then(res=>{
        if (res.success) {
          this.solvePartyData(res.data, null);
        }
      });
    },

    start() {
      api.getByPath('/api/v0/tuxun/party/start').then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/solo_game?gameId=' + res.data.id);
        } else {
          this.getPartyInfo();
        }
      });
    },

    gotoGame() {
      tuxunJump('/tuxun/solo_game?gameId=' + this.partyData.gameId);
    },

    inviteFriends() {
      this.openInvite = true;
      this.overflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    },
    closeInvite() {
      this.openInvite = false;
      document.body.style.overflow = this.overflow;
    },
    inviteFriend(userId) {
      api.getByPath('/api/v0/tuxun/message/invite', {code: this.partyData.joinCode, friend: userId}).then(res => {
        if (res.success) {
          this.$toast('邀请成功');
        }
      });
    },

    copyInviterLink() {
      var input = document.createElement('input');
      input.setAttribute('value', 'https://tuxun.fun/join?code=' + this.partyData.joinCode);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast('复制邀请地址成功');
      return result;
    }
  }
};
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
  background-color:  $tuxunBackgroundColor;
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
    div{
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
      padding-top: 5rem;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .header {
      padding-top: 1rem;
      color: white;
      font-size: 20px;
    }

    .separate-line {
      margin: auto;
      margin-top: 2rem;
      margin-bottom: 2rem;
      width: 60%;
      height: 1px;
      background-color: grey;
    }

    .vs {
      padding-top: 3rem;
      display: block;
      width: 60%;
      justify-content: center;
      margin: auto;
      display: flex;

      .vs_img {
        width: 75px;
        height: 75px;
        margin: auto;
      }
    }

    .start_game {
      padding-top: 3rem;

      .button {
        height: 3rem;
        width: 10rem;
        font-size: 16px;
      }
    }

    .wait_game_title {
      padding-top: 3rem;
      font-size: 32px;
      font-weight: bold;
    }

    .wait_game_start {
      padding-top: 2rem;
      font-size: 16px;
      color: #FFFF00;
    }

    .choose-type {
      margin:0px 1rem;
      padding: 4px 8px;
      color: white;
      background-color: green;
      outline: 1px solid white;
    }

    .normal-type {
      cursor: pointer;
      margin:0px 1rem;
      padding: 4px 8px;
      color: white;
      outline: 1px solid white;
    }

    .wait_game_user {
      padding-top: 1rem;
      font-size: 16px;
      align-items: center;
    }

    .wait_game_number {
      font-size: 48px;
      color: white;
      padding-bottom: 1rem;
    }

    .wait_game_hint {
      font-size: 16px;
      color: grey;
    }

    .invite {
      margin: 2rem auto 0;
      //max-width: 90%;
      min-width: 35rem;

      .title {
        font-size: 20px;
        margin-bottom: 1rem;
      }

      input {
        width: 30rem;
        height: 3rem;
        background-color: #191A2E;
        max-width: 100%;
      }

      .button {
        font-size: 16px;
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  .game_container {
    .prepare {
      .separate-line {
        width: 80%;
      }

      .vs {
        width: 80%;

        .vs_img {
          width: 30px;
          height: 30px;
        }

      }

      .invite {
        width: 100%;
        min-width: 50%;
        max-width: 100%;

        .body {
          max-width: 100%;
        }
      }
    }

    .player {
      width: 80%;

      .user {
        .avatar {
          width: 50px;
          height: 50px;
        }
        .userName {
          font-size: 12px;
        }
      }
      .user-small {
        .avatar {
          width: 50px;
          height: 50px;
        }
        .userName {
          font-size: 8px;
        }
      }
    }
  }
}
</style>

<template>
  <div>
    <div class="game_container">
      <div class="back_home">
        <el-button @click="goHome" round>首页</el-button>
        <el-button v-if="matchTeamData && $store.state.user.userInfo.userId === matchTeamData.captain.userId" @click="disband" round> 解散派对 </el-button>
        <el-button v-else @click="leave" round> 离开队伍 </el-button>
      </div>

      <div class="disband">
        <el-button class="button" type="primary" @click="copyInviterLink" round>分享链接</el-button>
<!--        <div style="height: 10px"></div>-->
<!--        <el-button class="button"  @click="inviteFriends" round>邀请好友</el-button>-->
        <!--      <el-button class="button" type="primary" @click="inviteFriends" round>Code加入</el-button>-->
      </div>

      <div v-if="matchTeamData" class="prepare">
        <div class="party-name">
          {{matchTeamData.captain.userName}} 组建的队伍
        </div>

        <div v-if="matchTeamData.status !== 'ongoing'">
          <div class="player">
            <div style="display: flex; flex-flow: row wrap; justify-content: center; width: 100%" v-if="matchTeamData && matchTeamData.players && matchTeamData.players.length >= 1">
              <User v-for="(item, index) in matchTeamData.players" :key="index" :user="item" :teamData="matchTeamData"/>
            </div>
          </div>

          <div style="padding-top: 1rem">
            <el-button @click="startMatch" style="font-size: 34px" type="primary" size="small">开始匹配</el-button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
import User from './user.vue';

export default {
  name: "team",
  components: {
    User,
  },
  data() {
    return {
      matchTeamData: null
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/tuxun/matchTeam/get').then(res => {
        this.matchTeamData = res.data;
      });
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
      });

    },
    disband() {

    },
    leave() {

    },
    copyInviterLink() {
      var input = document.createElement('input');
      input.setAttribute('value', 'https://tuxun.fun/team?teamId=' + this.matchTeamData.id);
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
  }
}
</style>

<template>
  <div class="game-container">
    <div class="back_home" @click="goHome">
      <el-button round>首页</el-button>
      this.showMatch = true;
    </div>
    <div v-if="disband" class="disband">
      队伍已经解散
      <div>
        <el-button round @click="goTeam">自己组建队伍</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
import {tuxunJump} from './common';

export default {
  name: 'team-join',
  data() {
    return {
      joinCode: null,
      code: '',
      disband: false,
      block: false,

    };
  },
  mounted() {
      this.teamId= this.$route.query.teamId;
      this.joinById(this.teamId);
  },
  methods: {
    joinById(teamId) {
      api.getByPath('/api/v0/tuxun/matchTeam/join', {teamId: teamId}).then(res => {
        if (res.success) {
          tuxunJump('https://tuxun.fun/team');
        } else {
          if (res.errorCode == 'need_login') {
            this.$login({
              callBack: () => {
                this.$store.dispatch('user/getInfo');
              },
            });
          } else {
            this.disband = true;
          }
        }
      });
    },
    goHome() {
      tuxunJump('https://tuxun.fun/');
    },
    goTeam() {
      tuxunJump('https://tuxun.fun/team');
    },
  }
};
</script>

<style lang="scss" scoped>
.game-container {
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
  .disband {
    color: white;
    margin-top: 5rem;
    font-size: 16px;
  }
  .enter_code {
    margin: auto;
    margin-top: 5rem;
    width: 30%;
  }
}
//.el-input /deep/ input {text-align:center}
@media only screen and (max-width: 768px) {
.game-container {
  .enter_code {
    width: 80%;
  }
}
}
</style>

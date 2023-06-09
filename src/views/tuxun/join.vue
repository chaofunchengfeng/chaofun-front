<template>
  <div class="game-container">
    <div class="back_home" @click="goHome">
      <el-button round>首页</el-button>
    </div>
    <div v-if="joinCode && disband" class="disband">
      派对不存在或者已经解散
      <div>
        <el-button round @click="goParty">去派对首页</el-button>
      </div>
    </div>
    <div v-if="!joinCode">
      
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api';
import {tuxunJump} from './common';

export default {
  name: 'tuxun-join',
  data() {
    return {
      joinCode: null,
      disband: false,
    };
  },
  mounted() {
    if (this.$route.query.code) {
      this.joinCode = this.$route.query.code;
      this.joinByCode(this.$route.query.code);
    }
  },
  methods: {
    joinByCode(code) {
      this.doLoginStatus().then((res) => {
        if (res) {
          api.getByPath('/api/v0/tuxun/party/join', {joinCode: code}).then(res => {
            if (res.success) {
              tuxunJump('/tuxun/paidui');
            } else {
              this.disband = true;
            }
          });
        }
      });
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    goParty() {
      tuxunJump('/tuxun/paidui');
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
  background-color: #18182A;
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
}
</style>

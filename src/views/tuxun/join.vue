<template>
  <div class="game-container">
    <div class="back_home" @click="goHome">
      <el-button v-if="!tuxunApp" round>首页</el-button>
    </div>
    <div v-if="joinCode && disband" class="disband">
      派对不存在或者已经解散
      <div>
        <el-button round @click="goParty">去派对首页</el-button>
      </div>
    </div>
    <div v-if="joinCode && block" class="disband">
      你已经被移除和禁止加入该派对
      <div>
        <el-button round @click="goParty">去派对首页</el-button>
      </div>
    </div>
    <div v-if="!joinCode" class="enter_code">
      <div class="code_input">
        <el-input
            autofocus
            :autofocus="true"
            placeholder="派对码"
            v-model="code"
            style="text-align: center"
        >
        </el-input>
      </div>
      <el-button style="margin-top: 1rem" type="primary" @click="joinByCode(code)">加入</el-button>
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
      code: '',
      disband: false,
      block: false,

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
      code = code.replaceAll('https://tuxun.fun/join?code=', '')
      this.doLoginStatus().then((res) => {
        if (res) {
          api.getByPath('/api/v0/tuxun/party/join', {joinCode: code}).then(res => {
            if (res.success) {
              tuxunJump('/tuxun/party');
            } else if (res.errorCode === 'party_disband') {
              this.disband = true;
            } else if (res.errorCode === 'party_block') {
              this.block = true;
            }
          });
        }
      });
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    goParty() {
      tuxunJump('/tuxun/party');
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

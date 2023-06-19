<template>
<div class="container">
  <div class="choose-container">
    <el-button @click="toPano" style="margin-top: 1rem">街景审核 {{restPano}}</el-button>
    <div></div>
    <el-button @click="toWonders" style="margin-top: 1rem">街景奇观审核 {{restWonders}}</el-button>
    <div></div>
    <el-button @click="showBanUser" style="margin-top: 1rem">用户封禁</el-button>
    <el-dialog title="用户封禁" :visible.sync="banUserShow" :append-to-body="true">
      <el-input placeholder="uid" v-model="banUid"></el-input>

      <el-input style="padding-top: 1rem" placeholder="时间" v-model="time"></el-input>

      <div style="height: 1rem">单位：</div>
      <el-radio v-model="timeUnit" label="day">天</el-radio>
      <el-radio v-model="timeUnit" label="forever">永久</el-radio>

      <div style="height: 1rem">原因：</div>
      <el-radio v-model="reason" label="作弊">作弊</el-radio>
      <el-radio v-model="reason" label="恶意掉分">恶意掉分</el-radio>

      <div slot="footer" class="dialog-footer">
        <el-button @click="hideBanUserShow()">取 消</el-button>
        <el-button type="primary" @click="submitBan()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</div>
</template>

<script>
import {tuxunJump, tuxunOpen} from './common';
import {init} from '../../components/game/snake/snake3';
import * as api from '../../api/api';

export default {
  name: 'admin-console',
  data() {
    return {
      restPano: 0,
      restWonders: 0,
      banUserShow: false,
      banUid: '',
      timeUnit: 'day',
      time: null,
      reason: '作弊'

    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/tuxun/admin/getTotalUncheckWonders', {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          this.restWonders = res.data;
        }
      });
      api.getByPath('/api/v0/tuxun/admin/getTotalUncheckPano', {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          this.restPano = res.data;
        }
      });
    },
    toPano() {
      tuxunJump('/tuxun/pano-filter');
    },
    toWonders() {
      tuxunJump('/tuxun/wonders-filter');
    },
    submitBan() {
      api.getByPath('/api/v0/tuxun/user/ban', {userId: this.banUid, time: this.time, timeUnit: this.timeUnit, reason: this.reason}).then(res => {
        if (res.success) {
          this.$toast('封禁成功');
          this.banUserShow = false;
        }
      });
    },
    showBanUser() {
      this.banUserShow = true;
    },
    hideBanUserShow() {
      this.banUserShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>

.container {
  height: 100%;
  width: 100%;

  .choose-container {
    margin: auto;
    width: 30%;

    .input {
      width: 50%;
      //padding-top: 1rem;
      //max-width: 40%;
      //margin: auto;
    }
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .text-create, .img-create .click-create {
    cursor: pointer;

    &:hover {
      transform: scale(1.03);
    }
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .choose-container {
      width: 80%;
    }
  }
}

</style>

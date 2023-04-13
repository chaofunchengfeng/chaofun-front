<template>
  <div>
    <div style="align-items: center; text-align:center">
      <div style="padding-top: 100px; font-size: 20px;">
        想
      </div>
      <div style="padding-top: 100px; font-size: 20px;">
        的
      </div>
      <div style="padding-top: 100px; font-size: 20px;">
        美
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  name: 'RedPackt',
  components: {},

  data() {
    return {
      password: '',
      redPacket: null,
      showDialog: false,

    };
  },
  created() {

  },
  mounted() {

  },

  methods: {

    reinitData() {
      this.showDialog = false;
      this.redPacket = null;
    },

    dialogClosed() {
      this.reinitData();
    },

    toUser(userId) {
      if (userId) {
        try {
          window.flutter_inappwebview.callHandler('toAppUser', {userId: userId + ''});
        } catch (e) {
          window.open(location.origin + '/user/' + userId, '_blank');
        }
      }
    },

    getRedPacket() {
      api.getByPath('/api/v0/red_packet/get', {'password': this.password, 'type': 'password'}).then((res) => {
        // this.handleRedPacketData(res);
        if (res.success && res.data != null) {

          this.redPacket = res.data;

          // 兼容祝福语长度
          if (this.redPacket.blessing && this.redPacket.blessing.length > 14) {
            this.redPacket.blessing = this.redPacket.blessing.substr(0, 14);
          }

          //
          this.showDialog = true;

        } else {

          this.reinitData();

          if (res.errorMessage) {
            this.$toast(res.errorMessage);
          } else {
            this.$toast('没有这个红包');
          }
        }
      });
    },

    openRedPacket() {
      api.getByPath('/api/v0/red_packet/open', {'password': this.password, 'type': 'password'}).then((res) => {
        // this.handleRedPacketData(res);
        if (res.success && res.data != null) {

          this.redPacket = res.data;

          // 兼容祝福语长度
          if (this.redPacket.blessing && this.redPacket.blessing.length > 14) {
            this.redPacket.blessing = this.redPacket.blessing.substr(0, 14);
          }

          //
          this.showDialog = true;

        } else {
          // 先这样处理
          this.getRedPacket();
        }
      });
    },

    handleRedPacketData(res) {

    },

    inputEnter() {
      if(!this.$store.state.user.islogin) {
        this.showLogin();
        return;
      };
      this.getRedPacket();
    },

    history() {
      this.$toast('暂不支持');
    },

    create() {
      window.open('/webview/fbi/redPacket/create', '_blank');
    }
  }
};


</script>

<style lang="scss" scoped>

::v-deep .el-dialog-custom {
  box-shadow: unset;
  border: none;

  .el-dialog__header {
    background: #808080;
    height: 60px;

    .el-dialog__close {
      color: #aaa;
      font-size: 28px;
    }
  }

  .el-dialog__body {
    padding: 0px;
    align-items: center;
    text-align: center;
  }
}

</style>
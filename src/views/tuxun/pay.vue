<template>
  <div>
    <div style="width: 100%;">
      <div style="width: 100%; text-align: center; padding-top: 2rem; font-size: 24px">炒饭收银台</div>
      <div v-if="fee"  style="width: 100%; text-align: center; font-size: 32px;">¥ {{this.fee}}</div>
      <div v-if="desc" style="width: 100%; text-align: center; font-size: 24px">{{this.desc}}</div>
    </div>
<!--    <div v-if="showNeedWX" style="position: absolute; display: flex; top: 0px; width: 100%; height: 100%; background-color: white; justify-content: center">-->
<!--      <div style="margin: auto; font-size: 30px">-->
<!--        请使用微信扫码打开..-->
<!--      </div>-->
<!--    </div>-->
  </div>

</template>

<script>
import * as api from '@/api/api';
export default {
  name: 'tuxun-pay',
  data() {
    return {
      code: null,
      orderId: null,
      fee: null,
      desc: null,
      showNeedWX: false
    };
  },
  mounted() {
    this.orderId =  this.$route.query.orderNo;
    this.code =  this.$route.query.code;
    this.callPay();
  },
  methods: {
    onBridgeReady() {
      // this.$toast(123);
      api.getByPath('/api/v0/tuxun/vip/jsApiPay', {code: this.code, orderId: this.orderId}).then(res=>{
        this.fee = res.data.fee;
        this.desc = res.data.desc;
        if (res.success) {
          WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(res.data.callJson),
              function (res) {
                if (res.err_msg == 'get_brand_wcpay_request:ok') {
                  // 使用以上方式判断前端返回,微信团队郑重提示：
                  //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                }
              });
        }
      });
    },
    callPay() {
      // this.onBridgeReady();

      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
        console.log('undefined');
        this.showNeedWX = true;
      } else {
        this.onBridgeReady();
      }
    }
  }
};
</script>

<style scoped>

</style>

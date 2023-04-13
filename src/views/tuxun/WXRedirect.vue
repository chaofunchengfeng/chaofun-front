<template>
<div>

</div>
</template>

<script>
export default {
  name: 'WXRedirect',
  mounted() {
    var orderNo =  this.$route.query.orderNo;
    var encodeUrl = encodeURI('http://tuxun.fun/wxPay?orderNo=' + orderNo);
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx59fc2a25d80a5812&redirect_uri=' + encodeUrl +  '&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect';
  },
  methods: {

  }
};
</script>

<style scoped>

</style>

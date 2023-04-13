<template>
  <div >
    <div style="font-size: 32px; padding-left: 10px">兑换 {{getType()}}</div>
    <div class="bottom">
      <div>请输入收件信息(详细地址+电话号码+尺码(如下单TShirt))</div>
      <div>(下单后请关注菜鸟裹裹信息)</div>
      <el-input type="textarea" v-model="address" placeholder="请输入收件信息(详细地址+电话号码+尺码(如下单TShirt))"></el-input>
      <div @click="order" class="btns">下单</div>
    </div>
    <div>
      <div> 附：Tshirt 尺码表 </div>
      <img style="padding-right: 10px; padding-left: 10px; width: 100%" src="https://i.chao-fan.com/biz/1653661535749_34ceba8b87684ddeade0df1cd4213606.png">
    </div>
    <div>

    </div>
  </div>
</template>

<script>
  import * as api from '@/api/api';
  import {banlist, forumAddBan, postByPath} from '../../../api/api';

  export default {
    name: 'mod_manager',
    // components: { adminDashboard, editorDashboard },
    data() {
      return {
        type: '',
        address: '',
        canOrder: true,
      };
    },
    props: {

    },
    created() {
      this.type = this.$route.query.type;
    },

    mounted() {
    },

    methods: {
      getType() {
        if (this.type === 'cup') {
          return '马克杯 (1500fbi)';
        } else if (this.type == 'tshirt') {
          return 'Tshirt (7500fbi)';
        }
      },
      order() {
        if (this.canOrder === false) {
          this.$toast('请勿重复提交');
          return;
        }
        if (this.type == null || this.type === '') {
          this.$toast('兑换类型不能为空');
          return;
        } else if (this.address === '' || this.address === null) {
          this.$toast('地址不能为空');
          return;
        } else {
          this.canOrder = false;
          api.postByPath('/api/v0/gift/addOrder', { type: this.type, address: this.address}).then((res) => {
            if (res.success) {
              this.$toast('成功');
              this.address = '';
            } else {
              this.$toast(res.errorMessage);
            }
            this.canOrder = true;
          });
        }
      },

    }
  };

</script>

<style lang="scss" scoped>

  .bottom{
    left: 0;
    right: 0;
    padding: 4px 10px 10px;
    .btns{
      width: 80%;
      margin: 0 auto;
      line-height: 44px;
      background: #FF9300;
      color: #fff;
      border-radius: 30px;
      text-align: center;
      font-size: 16px;
    }
  }
  input{
    height: 44px;
    outline: none;
    border: 1px solid #ededed;
    background: #f9f9f9;
    font-size: 15px;
    padding-left: 10px;
    border-radius: 8px;
  }
</style>
<style lang="scss">
.el-message-box{
  width: 90vw;
  max-width: 400px;
}
</style>
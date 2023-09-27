<template>
 <div  v-if="show" class="cover">
    <div class="ycovers">
      <div class="ycontainer">
        <div style="font-size: 32px">续费/开通会员</div>
        <div style="font-size: 20px; color: #FF0037">国庆中秋长假，图寻会员史低, 买一送一</div>
        <div v-if="scene === 'due'" style="color: red">您的会员已过期，是否续费会员</div>
        <div v-if="scene === 'new'" style="color: red">新寻友，考不考虑会员呢？</div>
        <img @click="cancelVip" class="cancel" :src='cancelImg'/>
        <div class="vip-plans">
          <div @click="changeTo('student')" :class="{'card': choose !== 'student', 'choose-card': choose === 'student'}">
            <div style="font-size: 16px;">
              试用
            </div>
          </div>
          <div @click="changeTo('month')" :class="{'card': choose !== 'month', 'choose-card': choose === 'month'}">
            <div>
              <div style="font-size: 15px;">
                <span style="font-size: 10px; text-decoration: none">￥</span>
                <span style="text-decoration: line-through">19.98</span>
              </div>
              <div style="font-size: 26px; color: #FF0037">
                <span style="font-size: 10px;">￥</span>9.99
              </div>
              <div>
                一个月<span style="color: #FF0037">+一个月</span>
              </div>
              <div style="height: 10px"></div>
            </div>
          </div>
<!--          <div @click="changeTo('3month')" :class="{'card': choose !== '3month', 'choose-card': choose === '3month'}">-->
<!--            <div>-->
<!--              <div style="font-size: 15px;">-->
<!--                <span style="font-size: 10px; text-decoration: none">￥</span>-->
<!--                <span style="text-decoration: line-through">59.94</span>-->
<!--              </div>-->
<!--              <div style="font-size: 30px; color: #FF0037">-->
<!--                <span style="font-size: 10px;">￥</span>26.99-->
<!--              </div>-->
<!--              <div>-->
<!--                三个月<span style="color: #FF0037">+三个月</span>-->
<!--              </div>-->
<!--              <div style="height: 10px"></div>-->
<!--            </div>-->
<!--          </div>-->
          <div @click="changeTo('6month')" :class="{'card': choose !== '6month', 'choose-card': choose === '6month'}">
            <div>
              <div style="font-size: 15px;">
                <span style="font-size: 10px; text-decoration: none">￥</span>
                <span style="text-decoration: line-through">119.88</span>
              </div>
              <div style="font-size: 26px; color: #FF0037">
                <span style="font-size: 10px;">￥</span>44.99
              </div>
              <div>
                半年<span style="color: #FF0037">+半年</span>
              </div>
              <div style="height: 10px"></div>
            </div>
          </div>
          <div @click="changeTo('year')" :class="{'card': choose !== 'year', 'choose-card': choose === 'year'}">
            <div>
              <div style="font-size: 15px;">
                <span style="font-size: 10px; text-decoration: none">￥</span>
                <span style="text-decoration: line-through">239.76</span>
              </div>
              <div style="font-size: 26px; color: #FF0037">
                <span style="font-size: 10px;">￥</span>69.99
              </div>
              <div>
                一年<span style="color: #FF0037">+一年</span>
              </div>
              <div style="height: 10px"></div>
            </div>
          </div>


          <div @click="changeTo('3year')" :class="{'card': choose !== '3year', 'choose-card': choose === '3year'}">
            <div>
              <div style="font-size: 15px;">
                <span style="font-size: 10px; text-decoration: none">￥</span>
                <span style="text-decoration: line-through">719.28</span>
              </div>
              <div style="font-size: 26px; color: #FF0037">
                <span style="font-size: 10px;">￥</span>119.99
              </div>
              <div>
                三年<span style="color: #FF0037">+三年</span>
              </div>
              <div style="height: 10px"></div>
            </div>
          </div>

        </div>
        <div v-if="choose==='student'">
          <div>注：15分钟免费会员，可循环试用，建议学生使用</div>
<!--          <div v-if="this.totalTryTimes !== null">图寻已经被白嫖了 {{this.totalTryTimes}} 次，救救孩子吧</div>-->
        </div>
        <div v-if="choose !== 'student'">
          <div style="color: #FF0037">
            限时折扣,10月6日24点结束
          </div>
          <div>
            注：感谢探索者您的支持！
          </div>
        </div>

        <div style="padding-top: 10px; font-weight: bold; font-size: 16px">
          会员权益
        </div>

        <div>
          <div>
            - 可移动街景(每日挑战,匹配solo除外)
          </div>
          <div>
            - 题库
          </div>
          <div>
            - 街景奇观
          </div>
          <div>
            - 随机街景
          </div>
          <div>
            - 自建题库
          </div>
          <div>
            - 个人首页会员标识
          </div>
          <div>
            - 支持图寻坚持下去
          </div>
          <div>
            - 更多专属权益...
          </div>
        </div>
        <div @click="confirm" class="ylogin">确定</div>
<!--        <div>-->
          <div>
            如支付后未生效，请关注「炒饭社区」公众号反馈
          </div>
<!--        </div>-->
      </div>

    </div>

   <div v-if="payImageUrl" style="position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 10000; display: flex;   align-items: center; background: rgba(0,0,0,0.5);">
     <div style="background-color: white; margin: auto;">
       <div style="margin: 1rem; text-align: center; align-items: center">
         <img :src="imgOrigin + this.payImageUrl" style="width: 200px; height: 200px">
         <div>
           微信扫描二维码支付
         </div>
         <div v-if="ISPHONE">
           支持截图相册扫码支付
         </div>
         <div style="padding-top: 10px"></div>
         <el-button type="primary" @click="paySuccess">
           已完成支付
         </el-button>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import Vue from 'vue';
import * as api from '@/api/api';
 export default {
   name: 'vip-index',
   data(){
     return {
       cancelImg: require('@/assets/images/icon/cancel1.png'),
       show: false,
       pay: false,
       choose: 'month',
       orderId: null,
       totalTryTimes: null,
       payImageUrl: null,
     };
   },
   computed:{
   },
   props: {
   },
   created() {

   },
   mounted() {
     this.getTryTimes();
     console.log(this.scene);
   },
   methods: {
     cancelVip() {
       this.show = false;
     },

     changeTo(plan) {
       this.choose = plan;
     },

     getTryTimes() {
       api.getByPath('/api/v0/tuxun/vip/getTotalTry').then(res => {
         this.totalTryTimes = res.data;
       });
     },
     confirm() {
       if (this.choose === 'student') {
         api.getByPath('/api/v0/tuxun/vip/try').then(res=>{
           if (res.success) {
             this.$toast('开通试用成功！');
             this.show = false;
             setTimeout(() => {
               location.reload();
             }, 200 );
           }
         });
       } else {
         var period = '1month';
         if (this.choose === 'year') {
           period = '1year';
         }
         if (this.choose === '3year') {
           period = '3year';
         }
         if (this.choose === '3month') {
           period = '3month';
         }
         if (this.choose === '6month') {
           period = '6month';
         }
         api.getByPath('/api/v0/tuxun/vip/getJSPayUrl', {period: period}).then(res=>{
           if (res.success) {
             this.orderId = res.data.orderId;
             this.payImageUrl = res.data.qrCodeUrl;
           }
         });
       }
     },
     paySuccess() {
       api.getByPath('/api/v0/tuxun/vip/confirm', {orderId: this.orderId}).then(res=>{
       });

       this.show = false;
       setTimeout(() => {
         location.reload();
         }, 200 );
     }
   }
 };
</script>

<style type='text/scss' lang='scss' scoped>
  .ycovers{
  position: fixed;
  z-index: 2012;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;
  .ycontainer{
    background: #fff;
    width: 600px;
    max-width: 90%;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    min-height: 330px;
    .cancel{
      position: absolute;
      top: 14px;
      right: 14px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      z-index: 10;
    }
    h1{
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      color: #e23d0e;
      margin-bottom: 10px;
    }
    .vip-plans {
      display: flex;
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .vip-plans::-webkit-scrollbar {
      display: none;
    }

    .card {
      position: relative;
      display: flex;
      flex-shrink: 0;
      text-align: center;
      min-width: 100px;
      height: 100px;
      margin-right: 10px;
      justify-content: center;
      align-items: center;
      align-content: center;
      justify-content: center;
      text-align: center;
      background-color: #F5F5F5;
    }
    .choose-card {
      position: relative;
      display: flex;
      text-align: center;
      flex-shrink: 0;
      height: 100px;
      width: 100px;
      margin-right: 10px;
      justify-content: center;
      align-items: center;
      align-content: center;
      justify-content: center;
      text-align: center;
      //border-color: ;
      border: 1px solid #D1A874;
      background-color: #F5EEE4;
    }
    .tnames{
      display: flex;
      font-size: 16px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      line-height: 24px;
      div{
        // margin-right: 20px;
        // padding: 4px 8px;
        // background: #f7f7f7;
        cursor: pointer;
      }
      .tts:nth-child(1){
        padding-right: 20px;
        border-right: 1px solid #ddd;
      }
      .tts:nth-child(2){
        padding-left: 20px;
        padding-right: 20px;
      }
      .tts:nth-child(3){
        padding-left: 20px;
        border-left: 1px solid #ddd;
      }
      .tts_act{
        color: #e23d0e;
      }
    }
    input{
      height: 44px;
      outline: none;
      border: 1px solid #ededed;
      background: #f9f9f9;
      font-size: 15px;
      margin-top: 10px;
      width: 100%;
      padding-left: 10px;
      border-radius: 8px;
    }
    .remPassword{
      line-height: 30px;
      margin-top: 14px;
      font-size: 12px;
      input[type='checkbox']{
        width: 14px;
        height: 14px;
        margin-right: 6px;
        // vertical-align: baseline;
      }
    }
    .code_con{
      display: flex;
      justify-content: space-between;
      input{
        flex: 1;
        margin-right: 20px;
      }
      span{
        line-height: 40px;
        margin-top: 10px;
        text-align: center;
        flex: 0 0 100px;
        border: 1px solid #ddd;
        cursor: pointer;
        color: #666;
        border-radius: 8px;
        moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select:none;
        -khtml-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        user-select:none;
      }
    }
    .ylogin{
      background: #e23d0e;
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 44px;
      border-radius: 10px;
      margin-top: 34px;
      margin-bottom: 24px;
      cursor: pointer;
      moz-user-select: -moz-none;
      -moz-user-select: none;
      -o-user-select:none;
      -khtml-user-select:none;
      -webkit-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }
    p{
      font-size: 12px;
      text-align: center;
      span{
        color: #e23d0e;
        cursor: pointer;
      }
    }
  }
}
.phonever{
  .title{
    font-weight: bold;
    margin-top: 16px;
  }
}
.sliders{
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  .title{
    padding: 8px 4px 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .slid{
    // border: 1px solid #f1f1f1;
    padding: 4px;
    padding-bottom: 40px;
    .tclose{
      text-align: center;
      margin-top: 20px;
      position: absolute;
      bottom: 30px;
      left: 140px;
      cursor: pointer;
      font-size: 13px;
      color: #999;
    }
  }
}
.codes{
  width: 22px;
  vertical-align: middle;
}
iframe{
  width: 350px;
  height: 400px;
}

  @media only screen and (max-width: 768px) {
    .ycovers {
      .ycontainer{
        padding: 10px;
        width: 400px;
      }
    }
  }
</style>

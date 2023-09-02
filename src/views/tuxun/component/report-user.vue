<template>
  <div class="cover">
    <div class="ycovers">
      <div class="ycontainer">
        <div style="font-size: 32px">举报用户</div>
        <img @click="hide" class="cancel" :src='cancelImg'/>
        <div class="reasons">
          <el-radio v-model="reason" label="作弊">作弊</el-radio>
          <el-radio v-model="reason" label="头像违规">头像违规</el-radio>
          <el-radio v-model="reason" label="用户名违规">用户名违规</el-radio>
          <div class="buttons">
            <el-button @click="hide">取消</el-button>
            <el-button @click="report" type="primary">确认</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api';

export default {
  name: "report-user",
  data() {
    return {
      cancelImg: require('@/assets/images/icon/cancel1.png'),
      userId: null,
      reason: null,
    }
  },
  props: {
    show: {
      type: Boolean,
    },
    userId: {
      type: Number,
      default: null,
    }
  },
  created() {

  },
  methods: {
    init() {

    },
    report() {
      api.getByPath('/api/v0/tuxun/user/report', { target: this.userId, reason: this.reason}).then(res => {
        if (res.success) {
          this.$toast('举报成功！');
          this.hide();
        }
      });

    },
    hide() {
      this.$emit('hide'); // 触发自定义事件，并传递新的值
    }
  }
}
</script>

<style lang="scss" scoped>
.ycovers {
  position: fixed;
  z-index: 2012;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: black;

  .ycontainer {
    background: #fff;
    width: 500px;
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
    .reasons {
      display: flex;
      flex-wrap: wrap;
      font-size: 24px;
      margin-top: 2rem;
      .reason {
        border: 1px solid #c7ccd1;
        padding: 4px 8px;
        font-size: 20px;
        margin: 0 10px 10px 0;
        border-radius: 4px;
        cursor: pointer;
      }
    }
    .buttons {
      padding-top: 3rem;
    }

  }
}
</style>

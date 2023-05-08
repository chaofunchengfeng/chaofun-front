<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="container">
        <div class="title">设置版块 ICON</div>
        <div>
            <img v-if="forumInfo.imageName" @click="uploadImage" :src="imgOrigin + forumInfo.imageName" class="avatar">
        </div>
      <div class="title">设置版块描述</div>
      <div style="max-width:600px;margin-top:10px;">
          <el-input type="textarea" maxlength="56" v-model="desc" style="resize:none;height:64px !important;overflow:hidden;margin-bottom:20px;" placeholder="请设置版块介绍"></el-input>
        </div>
      <div class="bottom">
        是否允许匿名发帖
        <el-switch
            v-model="anonymity"
            @change="setAnonymity"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>

      <div class="bottom">
        是否允许众筹
        <el-switch
            v-model="donate"
            @change="setDonate"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>

      <div v-if="this.forumId==='84'" class="bottom">
        <div @click="toTuxun" class="btns">图寻审图</div>
      </div>

      <div class="bottom">
        <div @click="toSave" class="btns">保存ICON和描述</div>
      </div>

      <div class="bottom">
        <div @click="toAnalytics" class="btns">版块统计</div>
      </div>

      <div class="bottom">
        <div @click="toForumLog" class="btns">版块日志</div>
      </div>

      <div class="bottom">
        <div @click="toManageTag" class="btns">版块标签</div>
      </div>

      <div class="bottom">
        <div @click="toManageRule" class="btns">版块规范</div>
      </div>

      <div class="bottom">
        <div @click="toAward" class="btns">众筹奖励</div>
      </div>

      <div class="bottom">
        <div @click="toManageUserTag" class="btns">用户标签</div>
      </div>

      <div class="bottom">
        <div @click="toManagerBadge" class="btns">徽章管理</div>
      </div>

      <div class="bottom">
        <div @click="toNotify" class="btns">发送通知</div>
      </div>

      <div class="bottom">
        <div @click="toModManager" class="btns">管理版主</div>
      </div>

      <div class="bottom">
        <div @click="toBan" class="btns">用户封禁</div>
      </div>

      <div class="bottom">
        <div @click="toSensitiveWord" class="btns">敏感词管理</div>
      </div>

      <div class="bottom">
        <div @click="toAutoReplaySetting" class="btns">自动回复规则管理</div>
      </div>

      <div class="bottom">
        <div @click="toTableManager" class="btns">表格管理</div>
      </div>

    </div>
    <div v-if="this.displayAdd" class="ycovers ">
      <div class="ycontainer">
        <div style="">
          <div style="margin:10px 0px;display: flex; align-items: center">
            <div style="align-content: center">用户名：</div>
            <el-autocomplete
                v-model="state"
                :fetch-suggestions="querySearchAsync"
                placeholder="搜索用户名"
                @select="handleSelect"
                style="z-index: 100000"
            ></el-autocomplete>
          </div>
          <div style="margin:10px 0px; align-items: center">
            <div style="align-content: center">FBi 奖励：</div>
          </div>
          <div style="">
            <el-input-number v-model="fbi" :min=5 :step=5 />
          </div>

          <div style="margin:20px 0px;display: flex;">
            <el-button @click="toAddFbi" type="success">确认</el-button>
            <el-button @click="cancelAddFbi" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as api from '@/api/api';

export default {
  name: 'forum-setting',
  data() {
    return {
      state: '',
      anonymity: true,
      donate: false,
      displayAdd: false,
      userIdToAdd: null,
      params: {
        forumId: '',
      },
      forumId: '',
      imageUrl: '',
      filedata: {},
      desc: '',
      forumInfo: '',
      fbi: 5,
      modInfo: ''
    };
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'roles',
      'islogin'
    ])
  },
  mounted(){
     try{
          let self = this;
        window.setUploadImage = function (message) {
          self.$toast('ICON更新成功，点击保存生效');
          self.forumInfo.imageName = message;
        };
      }catch(e){
        console.warn(e);
      }
    if(document.body.clientWidth < 700){
      this.isPhone = true;
    }
    this.toPosition();
  },
  created() {
    this.forumId = this.$route.query.forumId;
    this.getForumInfo();
  },

  methods:{
    toBeContinue() {
      this.$toast('尽情期待：）');
    },

    toAddFbi() {
      this.displayAdd = false;
      api.getByPath('/api/v0/forum/awardFbi', {forumId: this.forumId, targetUserId: this.userIdToAdd, fbi: this.fbi}).then(res => {
        if (res.success) {
          this.userIdToAdd = null;
          this.fbi = 5;
          this.state = '';
        } else {
          this.$toast(res.errorMessage);
        }
      });
    },

    cancelAddFbi() {
      this.displayAdd = false;
    },
    handleSelect(item) {
      this.userIdToAdd = item.userId;
      console.log(item);
    },

    querySearchAsync(queryString, cb) {
      api.getSearchUser({'keyword': queryString, 'pageNum': 1}).then((res) => {
        let result = res.data.data.map(value => {
          value.value = value.userName;
          return value;
        });

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(result);
        }, 3000 * Math.random());
      });
    },

    toAutoReplaySetting() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://chao.fan/webview/forum/auto_replay' + '?forumId=' + this.forumId,
          title: '自动回复管理',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/auto_replay?forumId=' + this.forumId);
      }
    },
    toBan() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://chao.fan/webview/forum/ban_manager' + '?forumId=' + this.forumId,
          title: '用户封禁',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/ban_manager?forumId=' + this.forumId);
      }
    },

    toSensitiveWord() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://chao.fan/webview/forum/sensitive_word_manager' + '?forumId=' + this.forumId,
          title: '敏感词',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/sensitive_word_manager?forumId=' + this.forumId);
      }
    },

    toManagerBadge() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://chao.fan/webview/forum/badge' + '?forumId=' + this.forumId,
          title: '徽章管理',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/badge?forumId=' + this.forumId);
      }
    },

    toTableManager() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://chao.fan/webview/forum/table_manager' + '?forumId=' + this.forumId,
          title: '表格管理',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/table_manager?forumId=' + this.forumId);
      }
    },

    toTuxun() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + 'tuxunAdmin',
          title: '图寻审核',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/tuxunAdmin');
      }
    },
    toSave(){
        this.toSign();
    },

    toNotify() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/forum/notify' + '?forumId=' + this.forumId,
          title: '发送通知',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/notify?forumId=' + this.forumId);
      }
    },
    toManageTag() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/forum/tag' + '?forumId=' + this.forumId,
          title: '标签管理',
          showHeader: true
        });
} catch (e) {
        window.open(location.origin + '/webview/forum/tag?forumId=' + this.forumId);
      }
    },
    toManageUserTag() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/forum/user_tag' + '?forumId=' + this.forumId,
          title: '标签管理',
          showHeader: true
        });
} catch (e) {
        window.open(location.origin + '/webview/forum/user_tag?forumId=' + this.forumId);
      }
    },

    toManageRule() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/forum/rule' + '?forumId=' + this.forumId,
          title: '版块规范管理',
          showHeader: true
        });
} catch (e) {
        window.open(location.origin + '/webview/forum/rule?forumId=' + this.forumId);
      }
    },

    toAnalytics() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/forum/analytics' + '?forumId=' + this.forumId,
          title: '版块统计',
          showHeader: true
        });
} catch (e) {
        window.open(location.origin + '/webview/forum/analytics?forumId=' + this.forumId);
      }
    },

    toForumLog() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/forum/log?forumId=' + this.forumId,
          title: '版块日志',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/log?forumId=' + this.forumId);
      }
    },

    toModManager() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/forum/mod_manager' + '?forumId=' + this.forumId,
          title: '版主管理',
          showHeader: true
        });
      } catch (e) {
        window.open(location.origin + '/webview/forum/mod_manager?forumId=' + this.forumId);
      }
    },

    uploadImage(){

      window.flutter_inappwebview.callHandler('uploadImage').then(function(result) {

      });

    },

    toAward() {
      this.displayAdd = true;
    },

    getForumInfo() {

      api.getForumInfo({forumId: this.forumId}).then(res => {
        this.forumInfo = res.data;
        this.desc = this.forumInfo.desc;
      });

      api.getModInfo({forumId: this.forumId}).then(res => {
        this.modInfo = res.data;
      });

      api.getByPath('/api/v0/forum/getAnonymity',{forumId: this.forumId}).then( res => {
        this.anonymity = res.data;
      });

      api.getByPath('/api/v0/donate/isOpen',{forumId: this.forumId}).then( res => {
        this.donate = res.data;
      });
    },

    setAnonymity(value) {
      console.log(value);
      api.getByPath('/api/v0/forum/setAnonymity',{forumId: this.forumId, anonymity: value}).then( res => {
        this.getForumInfo();
      });
    },

    setDonate(value) {
      console.log(value);
      api.getByPath('/api/v0/donate/set',{forumId: this.forumId, donate: value}).then( res => {
        this.getForumInfo();
      });
    },

    toSign(){
      api.setForumDesc({forumId: this.forumId, desc: this.desc}).then(res=>{
        api.setForumIcon({forumId: this.forumId, imageName: this.forumInfo.imageName}).then(res=>{
            this.$toast('保存成功');
        });
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 178px;
    text-align: center;

  }
  .avatar {
    margin-bottom: 30px;
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 50%;
  }
  ::v-deep .el-upload{
      border: 1px dashed #999;
      border-radius: 10px;
  }
  .container{
      padding: 20px;
      padding-bottom: 100px;
      background: #fff;
      .title{
          font-size: 16px;
          margin-bottom: 8px;
          margin-top: 14px;
      }
      .tips{
          font-size: 14px;
          color: #666;
          margin-bottom: 2px;
      }
  }
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

.ycovers {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;

  .ycontainer {
    background: #fff;
    width: 400px;
    max-width: 90%;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    min-height: 200px;
  }
}
</style>

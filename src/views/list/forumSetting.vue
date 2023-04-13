<template>
  <div id="container" ref="container" :style="{ height: scrollHeight + 'px' }"
       class="dashboard-container container infinite-list">
    <div>
      <div style="height:50px;"></div>
      <div class="main_content">
        <div v-if="!ISPHONE" class="main_left"></div>
        <div class="main_center">
          <div class="grid-content" style="overflow:auto;width:777px;max-width:100%;margin:0 auto;">
            <el-tabs type="card">
              <el-tab-pane label="版块信息">
                <div class="title">设置版块 ICON</div>
                <div>
                  <el-upload :before-upload="beforeAvatarUpload" :data="filedata" :on-success="handleAvatarSuccess"
                             :show-file-list="false"
                             action="/api/upload_image" class="avatar-uploader"
                             name="file">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div class="title">设置版块描述</div>
                <div style="max-width:600px;margin-top:10px;">
                  <el-input v-model="desc" maxlength="56" placeholder="请设置版块介绍"
                            style="resize:none;height:100px !important;overflow:hidden;"
                            type="textarea"
                            @blur="toSign"></el-input>
                </div>
                <div class="title">匿名发帖</div>
                <div style="max-width:600px;margin-top:10px;">
                  <el-switch
                    v-model="anonymity"
                    active-color="#13ce66"
                    active-text="允许"
                    inactive-color="#ccc"
                    inactive-text="不允许"
                    @change="setAnonymity">
                  </el-switch>
                </div>

                <div class="title" style="margin-top: 20px;">众筹</div>
                <div style="max-width:600px;margin-top:10px;">
                  <el-switch
                    v-model="isOpenDonate"
                    active-color="#13ce66"
                    active-text="开启"
                    inactive-color="#ccc"
                    inactive-text="关闭"
                    @change="setDonateOpen">
                  </el-switch>
                </div>

              </el-tab-pane>
              <el-tab-pane :lazy=true label="版块统计">
                <analytics :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="版块标签">
                <forumTag :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="版块规范">
                <forumRule :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="用户标签">
                <userTag :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="徽章管理">
                <badge-manager :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="发送通知">
                <notify :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="管理版主">
                <ModManager :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="用户封禁">
                <ban-manager :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="敏感词管理">
                <sensitive-word :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="自动回复">
                <auto-reply :forum-id0="forumId" />
              </el-tab-pane>
              <el-tab-pane :lazy=true label="表格管理">
                <table-manager :forum-id0="forumId" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as api from '../../api/api';

import ListItem from '../../components/chaofan/ListItem.vue';
import loadText from '@/components/chaofan/loadText';
import analytics from '@/views/chaofun-webview/forum/analytics.vue';
import forumTag from '@/views/chaofun-webview/forum/tag.vue';
import forumRule from '@/views/chaofun-webview/forum/rule.vue';
import userTag from '@/views/chaofun-webview/forum/userTag.vue';
import notify from '@/views/chaofun-webview/forum/notify.vue';
import ModManager from '@/views/chaofun-webview/forum/ModManager.vue';
import BanManager from '@/views/chaofun-webview/forum/BanManager';
import SensitiveWord from '@/views/chaofun-webview/forum/SensitiveWord';
import TableManager from '@/views/chaofun-webview/forum/TableManager';
import AutoReply from '@/views/chaofun-webview/forum/AutoReply';
import badgeManager from '@/views/chaofun-webview/forum/BadgeManager';


// 版块设置
export default {
  name: 'user',
  data() {
    return {
      params: {
        forumId: ''
      },
      forumId: '',
      imageUrl: '',
      filedata: {},
      desc: '',
      forumInfo: '',
      anonymity: true,
      isOpenDonate: false
    };
  },
  components: {
    ListItem,
    loadText,
    analytics,
    forumTag,
    forumRule,
    userTag,
    notify,
    ModManager,
    BanManager,
    SensitiveWord,
    TableManager,
    AutoReply,
    badgeManager
  },
  watch: {},
  computed: {
    ...mapGetters([
      'roles',
      'islogin'
    ])
  },
  mounted() {
    if (document.body.clientWidth < 700) {
      this.isPhone = true;
    }
    this.toPosition();
  },
  created() {
    this.forumId = this.params.forumId;

    if (this.forumId === '' || this.forumId === undefined) {
      this.forumId = this.$route.path.split('/')[2];
    }
    this.getForumInfo();
    // console.log('a',this.$store.state.user.userInfo)
    // this.desc = this.$store.state.user.userInfo.desc;
    // this.imageUrl = this.imgOrigin+this.$store.state.user.userInfo.icon;

    // this.filedata.fileName = this.$store.state.user.userInfo.icon;
    // this.filedata.name = this.$store.state.user.userInfo.icon;
    // this.filedata.url = this.imgOrigin+this.$store.state.user.userInfo.icon;
  },

  methods: {
    getForumInfo() {
      api.getForumInfo({ forumId: this.forumId }).then(res => {
        this.forumInfo = res.data;
        this.desc = this.forumInfo.desc;
        this.imageUrl = this.imgOrigin + this.forumInfo.imageName;
      });

      //匿名发帖
      api.getByPath('/api/v0/forum/getAnonymity', { forumId: this.forumId }).then(res => {
        this.anonymity = res.data;
      });

      // 众筹开启
      this.getDonateOpen();
    },

    setAnonymity(value) {
      api.getByPath('/api/v0/forum/setAnonymity', { forumId: this.forumId, anonymity: value }).then(res => {
        this.getForumInfo();
      });
    },

    getDonateOpen() {
      api.isDonateOpen({ forumId: this.forumId }).then(res => {
        if (res && res.success) {
          this.isOpenDonate = res.data;
        }
      });
    },

    setDonateOpen(value) {
      api.setDonateFbi({
        forumId: this.forumId,
        donate: value
      }).then(res => {
        this.getDonateOpen();
      });
    },

    toSign() {

      api.setForumDesc({ forumId: this.forumId, desc: this.desc }).then(res => {
        if (res.data) {
          this.$toast('设置签名成功');
        } else {
          this.$toast('设置签名失败，您还不是管理员?');
        }
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(this.filedata);
      console.log(res);
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw);
        api.setForumIcon({ forumId: this.forumId, imageName: res.data }).then(res => {
          if (res.data) {
            this.$toast('设置版块 ICON 成功');
          } else {
            this.$toast('设置版块 ICON 失败，您还不是管理员?');
          }
        });
      } else if (res.errorCode == 'invalid_content') {
        // this.imageUrl = ''
        this.$toast(res.errorMessage);
      }

    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!');
        return false;
      }
      this.filedata.fileName = file.name;
      return true;
    }
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep .el-upload {
  border: 1px dashed #999;
  border-radius: 10px;
}

.container {
  background: #fff;

  .title {
    font-size: 18px;
    margin-bottom: 12px;
  }
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

</style>

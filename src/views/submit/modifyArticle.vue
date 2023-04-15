<template>
  <div id="container" ref="container" class="dashboard-container container">
    <el-container class="section-submit">
      <el-main>

        <!--  小标题  -->
        <el-container class="section-submit-header">
          <el-col>修改帖子</el-col>
        </el-container>

        <!-- 版块信息 -->
        <el-container>
          <div v-if="forum" class="section-submit-form" style="background: #f0f0f0;border: 1px solid #ddd;">
            <img v-if="forum.imageName" :src="imgOrigin+forum.imageName" alt=""/>
            <span style="padding-left: 15px;">{{ forum.name }}</span>
          </div>
        </el-container>

        <!-- 帖子 -->
        <el-form ref="form" :model="post">
          <div class="postbox">
            <el-radio-group v-model="type">
              <el-radio-button :disabled="type!=='image'" label="image">
                <i class="el-icon-picture-outline"></i> 图片/视频
              </el-radio-button>
              <el-radio-button :disabled="type!=='article'" label="article">
                <i class="el-icon-tickets"></i> 文章
              </el-radio-button>
              <el-radio-button :disabled="type!=='link'" label="link">
                <i class="el-icon-link"></i> 链接
              </el-radio-button>
              <el-radio-button :disabled="type!=='vote'" label="vote">
                <i class="el-icon-receiving"></i> 投票
              </el-radio-button>
            </el-radio-group>

            <div class="postbox-fields">

              <!--  标题 -->
              <el-row style="margin-bottom: 22px;">
                <el-input
                    ref="title"
                    v-model="post.title"
                    :disabled='true'
                    autosize
                    class="title"
                    type="textarea"
                />
              </el-row>

              <!--  文章 -->
              <el-row v-if="['article'].includes(type)">
                <el-form-item
                    prop="content"
                >
                  <editor ref="editor" :content="post.article"/>
                </el-form-item>
              </el-row>

              <!-- 图片 -->
              <el-row v-if="type === 'image'" class="image-box">
                <Uploader ref="uploader" v-model="ossNames" action="/api/upload_image"/>
              </el-row>

              <!-- 链接 -->
              <el-row v-if="type === 'link'">
                <el-form-item
                    :rules="[
                          { required: true, message: '请输入链接地址', trigger: 'blur' },
                          { type: 'url', message: '链接地址格式不正确', trigger: 'blur' },
                        ]"
                    prop="link"
                >
                  <el-input
                      v-model="post.link"
                      :rows="2"
                      placeholder="请输入链接地址"
                      resize="none"
                      type="textarea"
                      @input="getUrlTitle"
                  >
                  </el-input>
                </el-form-item>
              </el-row>

              <!-- 投票 -->
              <el-row v-if="type === 'vote'" class="vote-box">
                <div class="vote-control">
                  <draggable
                      v-model="post.options"
                      class="vote-sort-list"
                      ghost-class="ghost"
                      handle=".el-icon-rank"
                      @end="drag=false"
                      @start="drag=true"
                  >
                    <el-form-item
                        v-for="(option, index) in post.options"
                        :key="index"
                        :prop="`options.${index}.optionName`"
                    >
                      <el-input v-model="option.optionName" :placeholder="`选项 ${index + 1}`" class="vote-option">
                        <i slot="prepend" class="el-icon-rank"/>
                        <el-button v-if="index > 1" slot="suffix" icon="el-icon-delete-solid" type="text"
                                   @click.prevent="removeOption(index)"/>
                      </el-input>
                    </el-form-item>
                  </draggable>
                  <div class="option-control">
                    <el-button
                        round
                        @click="addOption"
                    >
                      新增选项
                    </el-button>
                  </div>
                </div>
                <div class="vote-tips">
                  <p><i class="el-icon-warning-outline"/> <span>发起投票建议</span></p>
                  <ol>
                    <li>投票选项简短明确</li>
                    <li>投票选项越多越准确</li>
                    <li>选择合适的投票时间（暂未开放）</li>
                    <li>创建投票后无法编辑投票</li>
                  </ol>
                </div>
              </el-row>


              <el-divider></el-divider>
            </div>

            <!-- 按钮 -->
            <div class="postbox-buttons">
              <el-button v-if="type==='article'" :disabled="userId!==post.userInfo.userId" :loading="loading"
                         :style="{background:(userId === post.userInfo.userId)?'':'#999'}"
                         round
                         style="border: none;"
                         type="primary"
                         @click="submit_0">
                修改{{ userId === post.userInfo.userId ? "" : "(非本人帖子，无法修改！)" }}
              </el-button>
              <el-button v-else :loading="loading" disabled round style="background: #999;border: none;" type="primary"
                         @click="submit">修改(暂不支持)
              </el-button>
            </div>
            <div class="postbox-rules">
              <p><i class="el-icon-warning-outline"/> 严禁发布色情、暴恐、赌博及其他违反网络安全法的内容，或涉嫌隐私或未经授权的私人图片及信息，如违规发布，请自行删除或管理员强制删除。
              </p>
            </div>
          </div>
        </el-form>
      </el-main>

      <!--  右侧边栏  -->
      <el-aside width="320px">

        <!--  版块规范  -->
        <el-card v-if="forum.id" class="aside-forum" shadow="never">
          <div class="forum-header">
            <img v-if="forum.imageName" :alt="forum.name" :src="imgOrigin+forum.imageName">
            <router-link :to="`/f/${forum.id}`">{{ forum.name }}</router-link>
          </div>
          <div class="forum-desc">
            {{ forum.desc }}
          </div>
          <div class="forum-statics">
            <div class="statics-box">
              <em>{{ forum.followers }}</em>
              <span>粉丝</span>
            </div>
            <div class="statics-box">
              <em>{{ forum.posts }}</em>
              <span>帖子</span>
            </div>
          </div>
          <div v-if="this.rules && this.rules.length !== 0">
            <p>
              <span>版块规范</span>
            </p>
            <ol>
              <li v-for="(item, index) in this.rules" :key="index">{{ item.rule }}</li>
            </ol>
          </div>
        </el-card>

        <!--  炒饭发帖规范  -->
        <el-card class="aside-rule" shadow="never">
          <p>
            <img :src="logo" alt=""/>
            <span>炒饭发帖规范</span>
          </p>
          <ol>
            <li>严禁发布色情、暴恐、赌博及其他违反网络安全法的内容</li>
            <li>严禁发布涉嫌隐私或未经授权的私人图片及信息</li>
            <li>如违规发布，请自行删除或管理员强制删除</li>
          </ol>
        </el-card>

        <!--  帮助  -->
        <el-card class="aside-help" shadow="never">
          <el-row :gutter="12">
            <el-col :span="12" class="help-item">
              <router-link to="/help/forumIntro">帮助文档</router-link>
            </el-col>
            <el-col :span="12" class="help-item">
              <router-link to="/forumRank">24小时版块排名</router-link>
              <router-link to="/userRank">24小时用户排名</router-link>
            </el-col>
          </el-row>
        </el-card>
      </el-aside>


    </el-container>
  </div>

</template>

<script>
import draggable from 'vuedraggable';
import Editor from '@/components/Submit/Editor';
import Uploader from '@/components/Submit/Uploader';

import {getForumRules, getPostInfo, getUrlTitle, modifyArticle} from '@/api/api';

import {logo} from '@/settings';

export default {
  name: 'modifyArticle',
  components: {
    Editor,
    draggable,
    Uploader,
  },
  data() {
    return {
      logo,
      userId: this.$store.state.user.userInfo.userId,
      postId: '',
      rules: [],
      type: '',
      forum: {},
      post: {},

      ossNames: [], // 图片
      loading: false, // 发布中
    };
  },
  created() {
    if (!this.userId) {
      this.$message.error('未登录，无法修改！');
      this.goToIndex();
      return;
    }
    this.postId = this.$route.params.postId;
    // 加载帖子信息、版块规则
    this.getPost().then(() => {
      this.getForumRules();
    });

  },

  methods: {

    async getPost() {
      if (this.postId) {
        const result = await getPostInfo({postId: this.postId});

        if (!result.success) {
          this.goToIndex();
          return;
        }

        this.post = result.data;
        this.forum = this.post.forum;
        this.type = this.post.type;

        // TODO
        // image、article需要特殊处理
        if ('article' === this.type) {
          setTimeout(() => {
            this.$refs.editor.set(this.post.article);
          }, 1);
        } else if ('image' === this.type) {
          setTimeout(() => {
            if (this.post.imageNums === 1) {
              this.ossNames.push(this.post.imageName);
              this.$refs.uploader.setFileList(this.imgOrigin, [this.post.imageName]);
            } else if (this.post.imageNums > 1) {
              this.ossNames.push(...this.post.images);
              this.$refs.uploader.setFileList(this.imgOrigin, this.post.images);
            } else {
              this.$message.error('未知错误，尝试联系下开发同学！');
              this.goToIndex();
              return;
            }
          }, 1);

        }

      }
    },

    goToIndex() {
      setTimeout(() => {
        this.$router.push({path: '/'});
      }, 1500);
    },

    async getForumRules() {
      if (this.forum.id) {
        const result = await getForumRules({forumId: this.forum.id});
        if (result.success) {
          this.rules = result.data;
        }
      }
    },

    // === 链接相关 ===
    // 通过URL获取链接标题
    async getUrlTitle() {
      if (this.post.title !== '') {
        return;
      }
      const result = await getUrlTitle({'url': this.post.link});
      if (result && result.data) {
        this.post.title = result.data;
      }
    },
    // === 投票相关 ===
    // 新增选项
    addOption() {
      if (this.post.options.length > 5) {
        this.$message.error('最多支持6个选项！');
        return;
      }
      this.post.options.push({
        optionName: '',
      });
    },
    // 移除选项
    removeOption(index) {
      if (index !== -1) {
        this.post.options.splice(index, 1);
      }
    },

    // === 提交 ===
    submit_0() {
      if (this.userId !== this.post.userInfo.userId) {
        this.$message.error('非本人帖子，无法修改！');
        return;
      }
      if ('article' !== this.type) {
        this.$message.error('暂不支持！');
        return;
      }

      let article = this.$refs.editor.get();

      this.loading = true;
      modifyArticle({
        postId: this.postId,
        article: article
      }).then(res => {
        this.loading = false;
        if (res.success) {
          this.$message.success('修改成功');
          setTimeout(() => {
            this.$router.push({path: '/p/' + res.data.postId});
          }, 1500);
        } else {
          this.$message.error('修改失败，尝试联系下开发同学！');
          return;
        }
      }).catch(err => {
        this.loading = false;
        this.$message.error('修改失败，尝试联系下开发同学！');
        return;
      });


    },
    submit() {
      if (['article'].includes(this.type)) {
        // 同步内容
        this.post.content = this.$refs.editor.get();
      }
      this.$refs.form.validate(result => {
        if (!result) {
          this.$message.error('选项未填写完整');
          return;
        }
        const {type, post} = this;
        if (type === 'image' && (!post.ossNames || post.ossNames.length < 1)) {
          this.$message.error('请上传至少一张图片或一个视频！');
          return;
        }
        this.doSubmit();
      });
    },
    // 提交操作
    async doSubmit() {
      this.loading = true;
      const loginStatus = await this.doLoginStatus();
      if (!loginStatus) {
        return;
      }
      const {type, post} = this;
      let result;
      // 公共参数
      const params = {
        forumId: post.forumId,
        title: post.title,
        anonymity: post.anonymity,
      };
      if (post.tagId) {
        params.tagId = post.tagId;
      }
      if (post.collectionId) {
        params.collectionId = post.collectionId;
      }
      try {
        // 图片/视频
        if (type === 'image') {
          if (post.ossNames.length === 1) {
            params.ossName = post.ossNames[0];
          } else {
            params.ossNames = post.ossNames.join(',');
          }
          result = await submitImage(params);
        } else if (type === 'article') {
          params.article = post.content;
          params.articleType = 'richtext';
          result = await submitArticle(params);
        } else if (type === 'link') {
          params.link = post.link;
          result = await submitLink(params);
        } else if (type === 'vote') {
          params.article = post.content;
          params.options = JSON.stringify(post.options);
          result = await submitVote(params);
        }
        if (!result || !result.success) {
          this.$message.error(result.errorMessage);
          this.loading = false;
          return;
        }
        this.loading = false;

        this.$message.success('修改成功');
        setTimeout(() => {
          this.$router.push({path: '/p/' + result.data.postId});
        }, 1500);
      } catch (error) {
        console.error(error);
        // 其他网络问题
        this.$message.error('修改失败，尝试联系下开发同学！');
      }
      this.loading = false;
    },

  }
};
</script>

<style lang='scss' scoped type='text/scss'>
.section-submit {
  //max-width: 1248px;
  padding: 60px 15px 60px 215px;
  margin: 0 auto;

  .section-submit-header {
    border-bottom: 1px solid #DCDFE6;
    margin-bottom: 10px;

    .el-col {
      padding: 0;
      font-size: 18px;
      font-weight: 500;
      line-height: 34px;
    }
  }

  .section-submit-form {
    position: relative;
    display: flex;
    box-sizing: border-box;
    min-width: 300px;
    width: auto;
    height: 40px;
    border-radius: 4px;
    transition: box-shadow .2s ease;
    box-shadow: 0 0 0 0 #fff;
    border: 1px solid #edeff1;
    background-color: #fff;
    align-items: center;
    padding: 0 8px;
    margin-bottom: 8px;

    img {
      margin: 0;
      height: 22px;
      width: 22px;
      font-size: 22px;
      line-height: 22px;
      border-radius: 9999px;
    }

  }

  .postbox {
    width: 100%;
    background: #FFF;
    overflow: hidden;
    border-radius: 10px;
    // padding-bottom: 20px;

    .el-radio-group {
      width: 100%;
      display: flex;

      label {
        flex: 1;

        ::v-deep .el-radio-button__inner {
          display: flex;
          flex: 1;
          width: 100%;
          box-sizing: border-box;
          padding: 15px 24px;
          outline: none;
          position: relative;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          border: none;
          background: transparent;
          border: 1px solid #DCDFE6;
          border-width: 0 1px 1px 0;
          align-items: center;
          justify-content: center;
          box-shadow: none;
          color: #606266;

          i {
            font-size: 20px;
            font-weight: 400;
            height: 20px;
            line-height: 20px;
            margin-right: 8px;
          }
        }

        &:hover {
          background-color: rgba(0, 121, 211, 0.05);

          ::v-deep .el-radio-button__inner {
            color: #606266;
          }
        }

        &:last-child {
          ::v-deep .el-radio-button__inner {
            border-width: 0 0 1px 0;
          }
        }

        &.is-active {
          ::v-deep .el-radio-button__inner {
            color: #16679f;
            background-color: rgba(0, 121, 211, 0.05);

            &::after {
              content: " ";
              box-sizing: border-box;
              background-color: #16679f;
              position: absolute;
              left: 0;
              right: 0;
              bottom: -1px;
              height: 2px;
            }
          }
        }
      }

    }
  }

  .postbox-fields {
    margin: 16px;

    .el-row {
      margin: 0;
    }

    .title {
      ::v-deep textarea {
        padding: 12px 8px;
        resize: none;
        box-sizing: border-box;
        overflow: hidden;
      }

      ::v-deep .el-input__count {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .5px;
        line-height: 12px;
        text-transform: uppercase;
        bottom: 12px;
        pointer-events: none;
        position: absolute;
        right: 12px;
        opacity: 0.65;
      }
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      margin-bottom: 20px;
    }

    ::v-deep .el-checkbox {
      position: relative;
      padding: 4px 16px;
      border: 1px solid;
      border-radius: 9999px;
      color: #606266;
      font-size: 14px;
      min-height: 32px;
      height: auto;
      min-width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      margin-right: 4px;

      .el-checkbox__inner {
        display: none;
      }

      .el-checkbox__label {
        padding-left: 0;
        display: flex;

        i {
          font-size: 20px;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
          margin-right: 8px;
        }
      }

      &.is-checked {
        background: #16679f;
        border-color: #16679f;

        .el-checkbox__label {
          color: #fff;
        }
      }
    }

    .el-divider {
      margin: 0;
    }

    .image-box {
      margin-bottom: 22px;
    }

    // 投票样式
    .vote-box {
      display: flex;
      flex-direction: row;
      border: 1px solid #DCDFE6;
      margin: 0 0 22px;
      padding: 8px 0;

      .vote-control {
        flex-grow: 1;
        width: 100%;

        .vote-sort-list {
          ::v-deep .el-form-item {
            margin-bottom: 0;
          }
        }

        .vote-option {
          display: flex;
          align-items: center;
          flex-direction: row;
          padding: 4px 0 4px 4px;
          position: relative;
          transition: opacity .2s, left .2s;

          ::v-deep .el-form-item__error {
            display: none;
          }

          ::v-deep .el-input-group__prepend {
            display: flex;
            fill: #5a5e66;
            height: 20px;
            width: 20px;
            font-size: 20px;
            margin-right: 4px;
            padding: 0;
            background: transparent;
            border: none;

            i {
              cursor: pointer;
            }
          }

          ::v-deep .el-input__suffix {
            i {
              font-size: 20px;
              color: #606266;
            }
          }
        }

        .option-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding-right: 20px;
          flex-direction: row;

          .el-button {
            margin-left: 26px;
            align-items: center;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            position: relative;
            text-align: center;
            width: auto;
            line-height: 20px;
            padding: 4px 16px;
            border: none;
            color: #16679f;
            font-weight: bold;
          }

          ::v-deep .el-form-item {
            display: flex;
            align-items: center;
            -ms-flex-direction: row;
            flex-direction: row;
            justify-content: center;
            margin: 0;

            label {
              font-weight: normal;
              line-height: 20px;
            }

            .el-form-item__content {
              line-height: 20px;
            }

            .el-select {
              position: relative;
              width: 60px;
              font-size: 12px;
              line-height: 20px;

              .el-input {
                .el-input__icon {
                  line-height: 20px;
                }

                input {
                  align-items: center;
                  display: flex;
                  flex-direction: row;
                  border: none;
                  padding: 0 30px 0 0;
                  color: #16679f;
                  height: 20px;
                  line-height: 20px;
                }
              }
            }
          }
        }
      }

      .vote-tips {
        flex-grow: 0;
        flex-shrink: 0;
        padding: 4px 0 4px 8px;
        width: 250px;

        p {
          margin-left: 5px;
          padding-bottom: 6px;
          font-size: 13px;
          display: flex;
          align-content: center;
          flex-direction: row;
          flex-grow: 0;

          i {
            font-size: 16px;
            padding: 2px;
            font-weight: 600;
          }

          span {
            line-height: 22px;
            padding-left: 4px;
          }
        }

        ol {
          padding: 0 24px;

          li {
            list-style: decimal outside;
            font-size: 11px;
            font-weight: 500;
            line-height: 15px;
            margin-bottom: 5px;
            padding-left: 6px;
          }
        }
      }
    }
  }

  .postbox-buttons {
    display: flex;
    margin: 0 16px 16px;
    flex-direction: row-reverse;
    text-transform: uppercase;

    .el-button {
      margin-left: 8px;

      &.el-button--primary {
        background-color: #16679f;
        border-color: #16679f;
      }
    }
  }

  .postbox-rules {
    display: none;
    background-color: #edeff1;
    padding: 8px 16px 21px;

    i {
      font-size: 18px;
      color: #fc471e;
    }
  }

  .el-aside {
    background: none;
    padding: 0;
    position: relative;

    .el-card {
      margin-top: 15px;
    }

    .aside-forum {
      ::v-deep .el-card__body {
        padding: 12px 12px;
      }

      .forum-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        img {
          display: block;
          border-radius: 9999px;
          box-sizing: border-box;
          height: 52px;
          width: 52px;
          font-size: 52px;
          line-height: 52px;
          margin-right: 8px;
        }

        a {
          color: #5a5e66;
          font-size: 20px;
        }

      }

      .forum-desc {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 21px;
        font-weight: 400;
        color: #606266;
      }

      ol {
        font-size: 12px;
        line-height: 18px;
        list-style: decimal;
        list-style-position: inside;

        li {
          border-bottom: 1px solid #DCDFE6;
          padding: 10px 6px;
          list-style: decimal;
          list-style-position: inside;
        }
      }

      .forum-statics {
        display: flex;
        margin-bottom: 8px;

        .statics-box {
          flex: auto;
          border-right: 1px solid #DCDFE6;
          padding: 8px 0 8px 12px;

          em {
            display: block;
            font-size: 16px;
            font-weight: 500;
            font-style: normal;
            line-height: 20px;
            color: #5a5e66;
          }

          span {
            display: block;
            font-size: 12px;
            font-weight: 500;
            font-style: normal;
            line-height: 16px;
            color: #5a5e66;
          }

          &:last-child {
            border: none;
          }
        }
      }
    }

    .aside-rule {
      ::v-deep .el-card__body {
        padding: 12px 12px;

        p {
          display: flex;
          justify-items: center;
          padding-bottom: 5px;
          border-bottom: 1px solid #DCDFE6;

          img {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }

          span {
            font-size: 16px;
            line-height: 40px;
          }
        }

        ol {
          font-size: 12px;
          line-height: 18px;
          list-style: decimal;
          list-style-position: inside;

          li {
            border-bottom: 1px solid #DCDFE6;
            padding: 10px 6px;
            list-style: decimal;
            list-style-position: inside;
          }
        }
      }
    }

    .aside-help {
      ::v-deep .el-card__body {
        padding: 12px 12px;

        .help-item {
          padding: 0 4px;

          a {
            display: block;
            color: #606266;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .section-submit {
    padding: 60px 24px;

    .el-aside {
      display: none;
    }

    .postbox-rules {
      display: flex;
    }
  }
}

@media (max-width: 600px) {
  .section-submit {
    padding: 60px 8px;

    .section-submit-form {
      min-width: 0;
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>
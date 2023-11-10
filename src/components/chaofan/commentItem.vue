<template>
  <div>
    <div v-for="(item,index) in treeData" :id="'commentItem_'+item.id" :key="index" class="comment_item">
      <div :class="['c_left',{'c_left2':ISPHONE}]">
        <div class="lay">
          <img v-if="item.vote != 1" alt="" src="../../assets/images/icon/up.png" @click.stop="doZanComment(1, item)" />
          <img v-if="item.vote == 1" alt="" src="../../assets/images/icon/up_active.png"
               @click.stop="doZanComment(1, item)" />
        </div>
        <div class="lay">
          <p>{{ item.ups - item.downs }}</p>
        </div>
        <div class="lay">
          <img v-if="item.vote != -1" alt="" src="../../assets/images/icon/down.png"
               @click.stop="doZanComment(2, item)" />
          <img v-if="item.vote == -1" alt="" src="../../assets/images/icon/down_active.png"
               @click.stop="doZanComment(2, item)" />
        </div>
      </div>
      <div class="c_content">
        <div :class="getCommentUserinfoClazz(item)">
          <img :src="imgOrigin+item.userInfo.icon+'?x-oss-process=image/resize,h_40/quality,q_75'"
               alt="" style="object-fit: cover;">
          <span class="username" @click.stop="toUser(item.userInfo)">{{ item.userInfo.userName }}</span>
          <span v-if="item.userInfo.userTag" class="tag"
                title="用户在版块的标签">{{ item.userInfo.userTag.data }}</span>
          <span v-if="humanizeTimeFormat" class="time" title="点击切换时间格式"
                @click="changeTimeFormat">{{ moment.duration(moment(item.gmtCreate) - moment()).humanize(true) }}</span>
          <span v-else class="time" title="点击切换时间格式"
                @click="changeTimeFormat">{{ moment(item.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss") }}</span>

          <!-- <div class="zan_shu" style="display:inline-block;padding-left:20px;"> <span>{{item.ups - item.downs}}个赞</span></div> -->
          <div v-if="item.forumAdminHighlight" class="zan_shu" style="display:inline-block;padding-left:20px;">
            版主高亮中
          </div>
          <div v-if="ISPHONE&&(!postInfo.disableComment||postInfo.forumAdmin)" class="zan_shu"
               style="display:inline-block;padding-left:20px;"
               @click="toReplay2(item)">回复
          </div>
          <div v-if="!ISPHONE&&(!postInfo.disableComment||postInfo.forumAdmin)" class="zan_shu"
               style="display:inline-block;padding-left:20px;"
               @click="toReplay(item)">回复
          </div>
          <div v-if="item.canDeleted" class="to_delete" @click="deleteComment(item)" @refreshDelete="refreshDelete">
            删除
          </div>
          <div v-if="item.forumAdmin&&item.forumAdminHighlight" class="to_delete" @click="unHighlightComment(item)">
            取消高亮
          </div>
          <div v-if="item.forumAdmin&&!item.forumAdminHighlight" class="to_delete" @click="highlightComment(item)">
            设为高亮
          </div>
          <div v-if="isShowCopyCommentLinkTmp" class="to_delete" @click="copyCommentLink(item)">复制链接</div>
          <div v-if="$store.state.user.islogin&&isShowReportCommentTmp&&userinfo.userId!=item.userInfo.userId"
               class="to_delete" @click="showReportDialog(item)">
            <i class="el-icon-warning-outline" style="margin-right: 3px;color:red;" /><span
            style="color: red;">举报</span>
          </div>
        </div>
        <div :style="getCommentContentStyle(item)" class="content">
          <p v-if="!item.atUsers" v-html="islink(item.text)"></p>
          <p v-if="item.atUsers" @click="clickComment($event)" v-html="doText(item)"></p>
          <span v-if="item.imageNames" class="comImgs">
                    <viewer ref="viewer" :images="doImgs(item.imageNames)" style="line-height: 0px">
                        <div v-for="(i,k) in item.imageNames.split(',')" :key="k">
                            <span class="aaa">
<!--                                【附图】-->
                              <img :data-source="imgOrigin+i"
                                   :src="imgOrigin+i+'?x-oss-process=image/resize,h_60/quality,q_75'"
                                   style="opacity:0;width:60px;height:60px">
                              <div :data-source="imgOrigin+i"
                                   :src="imgOrigin+i+'?x-oss-process=image/resize,h_60/quality,q_75'"
                                   :style="{'background-image':'url('+imgOrigin+i+')','background-size':'cover',width:'60px',height:'60px'}"></div>
                            </span>
                        </div>
                    </viewer>
            <!-- <a v-for="(i,k) in item.imageNames.split(',')" :key="k" :href="imgOrigin+i" target="_blank">【附图】</a> -->
                </span>
          <div v-if="item.audio">
            <audio
              :src="imgOrigin+item.audio"
              alt=""
              controls
              playsinline="true"
              webkit-playsinline="true"
              x-webkit-airplay="true"
              x5-video-orientation="h5"
              x5-video-player-fullscreen="true"
              x5-video-player-type="h5">
            </audio>
            <!-- <a v-for="(i,k) in item.imageNames.split(',')" :key="k" :href="imgOrigin+i" target="_blank">【附图】</a> -->
          </div>
        </div>
        <!-- <div v-if="item.type=='media'" class="comImgs">
            <img v-for="(i,k) in item.imageNames.split(',')" :key="k" :src="imgOrigin+i+''" alt="">
        </div> -->
        <!-- <div  v-if="item.type=='media'"  class="comImgs" >
            <a v-for="(i,k) in item.imageNames.split(',')" :key="k" :href="imgOrigin+i" target="_blank">[附图]</a>
        </div> -->
        <!-- {{replayItem}}{{item.id}} -->
        <div v-if="replayItem&&(replayItem.id==item.id)" class="replayInput">
          <div v-show="showAt" class="atuser">
            <div v-for="(it,ins) in atUsers" :key="ins" class="at_item" @click="chooseAt($event,it)">
              {{ it.userName }}
            </div>
          </div>
          <div v-if="replayItem" style="padding: 6px 0px;cursor:pointer;float:right;" @click="cancelReplay">取消回复
          </div>
          <el-input ref="subCommentInputMark" v-model="comment"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    :placeholder="replayItem?'我对'+replayItem.userInfo.userName+'说：'+'(Ctrl+V 可粘贴图片)':'发表你的想法'+'(Ctrl+V 可粘贴图片)'"
                    class="textarea" style="font-size:14px;"
                    type="textarea" v-on:blur="inputBlur"
                    v-on:focus="inputFocus"
                    @keyup.native="bindInput">
          </el-input>
          <div v-loading="imagesUploading" class="reply_button">
            <div v-if="images.length" class="subims">
              <a v-for="img in images" :key="img" :href="imgOrigin+img" target="_blank">[附图]</a>
            </div>
            <el-button v-if="replayItem&&(replayItem.id==item.id)" style="height:36px;" title="快捷键：Ctrl+Enter"
                       type="primary"
                       @click="toSub">回复
            </el-button>
            <el-upload
              ref="replyImageUpload"
              :before-upload="beforeAvatarUpload"
              :data="filedata"
              :limit="imagesLimit"
              :on-exceed="handleAvatarExceed"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              accept="image/*"
              action="/api/upload_image"
              class="avatar-uploader"
              multiple
              name="file"
              style="display:inline-block;"
            >
              <img alt=""
                   src="../../assets/images/icon/choose.png"
                   style="vertical-align:middle;margin-right:10px;cursor:pointer;">
            </el-upload>
            <div class="icons">
              <img alt=""
                   src="https://i.chao-fan.com/biz/1657171357596_51b6f962c13d4bbb855dc74a716a87d9.png"
                   @click="showIcons">
              <div class="emoji">
                <span v-for="(item,index) in icons" :key="index" @click="chooseEmoji(item)">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!withoutSubComment&&item.children&&item.children.length">
          <commentitem ref="subCommentItemMark"
                       :is-show-copy-comment-link="isShowCopyCommentLinkTmp"
                       :postInfo="{postOwnerUserId:postInfo.postOwnerUserId,isPostOwnerHighlight:postInfo.isPostOwnerHighlight}"
                       :showRep="showR" :treeData="item.children" @refreshComment="refreshComment"
                       @refreshDelete="refreshDelete"
                       @rep="rep" @toReplay2="toReplay2"></commentitem>
          <!-- <div  v-for="(item,index) in item.children" :key="index" class="comment_item">
              <div class="c_left">
                  <img @click.stop="doZanComment(1,item)" src="../../assets/images/icon/up.png" alt="">
                  <p></p>
                  <img @click.stop="doZanComment(2,item)" src="../../assets/images/icon/down.png" alt="">
              </div>
              <div class="c_content">
                  <div class="user_info">
                      <img :src="imgOrigin+item.userInfo.icon" alt="">
                      <span  @click.stop="toUser(item.userInfo)" class="username">{{item.userInfo.userName}}</span>
                      <span class="time">{{moment.duration(moment(item.gmtCreate) - moment()).humanize(true)}}</span>
                      <div class="zan_shu" style="display:inline-block;padding-left:20px;"> <span>{{item.ups - item.downs}}个赞</span></div>
                      <div @click="toReplay(item)" class="zan_shu" style="display:inline-block;padding-left:20px;">回复</div>
                  </div>
                  <div class="content">
                      {{item.text}}
                  </div>
              </div>
          </div> -->
        </div>

      </div>

    </div>

    <report-dialog v-if="isShowReportCommentTmp" ref="reportDialogMark" />

  </div>
</template>

<script>
import * as api from "../../api/api";
import moment from "moment";
import reportDialog from "@/components/report/report.vue";

export default {
  name: "commentitem",
  data() {
    return {

      showIcon: false,
      moment: moment,
      replayItem: null,
      showR: false,
      comment: "",
      userinfo: this.$store.state.user.userInfo,
      canSub: true,
      icons: [
        "😀", "😃", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "😍", "😘", "🤪", "😝", "👍", "🤝", "🙏", "💪", "👏", "✍️", "💔", "👮‍♂️", "☠️", "👽"
      ],
      images: [],
      filedata: {},
      imagesUploading: false,
      imagesNum: 0,
      imagesLimit: 9,

      atUsers: [],
      showAt: false,
      canSearch: true,
      curInput: "",
      ats: [],
      pointIndex: "",
      atIndex: "",
      searchkey: "",
      atUserName: [],
      __viewer: null,
      isShowCopyCommentLinkTmp: this.isShowCopyCommentLink,
      isShowReportCommentTmp: this.isShowReportComment
    };
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      }
    },
    showRep: {
      type: Boolean,
      default: true
    },
    postInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    withoutSubComment: {
      type: Boolean,
      default: false
    },
    isShowCopyCommentLink: {
      type: Boolean,
      default: false
    },
    isShowReportComment: {
      type: Boolean,
      default: false
    }
  },
  components: {
    reportDialog
  },
  created() {
  },
  mounted() {
    // 监听是否显示操作事件
    this.$EventBus.$on("isShowCopyCommentLink", (data) => {
      this.isShowCopyCommentLinkTmp = data;
    });
    // 监听是否显示举报事件
    this.$EventBus.$on("isShowReportComment", (data) => {
      this.isShowReportCommentTmp = data;
    });

  },
  watch: {
    showRep: function(val) {
      if (val === false) {
        this.replayItem = null;
      }
    }
  },
  methods: {

    // 这里需要递归判断
    getCommentInputFocused() {

      let re = null;
      let _this = this;

      // 当前评论框焦点情况
      if (this.$refs.subCommentInputMark) {
        this.$refs.subCommentInputMark.forEach(element => {
          if (element && element.focused) {
            re = _this;

          }

        });
      }

      // 子评论框焦点情况
      if (this.$refs.subCommentItemMark) {
        this.$refs.subCommentItemMark.forEach(element => {
          let re0 = element.getCommentInputFocused();
          if (re0) {
            re = re0;

          }
        });
      }

      return re;
    },

    getHighlightStatus(item) {
      if (item.isJumpHighlight) {
        // 跳转高亮
        return 3;
      } else if (item.forumAdminHighlight) {
        // 版主高亮
        return 1;
      } else if (this.postInfo.isPostOwnerHighlight && this.postInfo.postOwnerUserId == item.userInfo.userId) {
        // 楼主高亮
        return 2;
      }
      return 0;

    },
    getCommentContentStyle(item) {
      let highlightStatus = this.getHighlightStatus(item);
      if (highlightStatus == 3) {
        return "background: #FFE1F1;";
      } else if (highlightStatus == 1) {
        return "background: #b2e8d1;";
      } else if (highlightStatus == 2) {
        return "background: #BFDFFF;";
      }
      return "";
    },
    getCommentUserinfoClazz(item) {
      let highlightStatus = this.getHighlightStatus(item);
      if (highlightStatus == 3) {
        return "user_info_highlight_3";
      } else if (highlightStatus == 1) {
        return "user_info_highlight_1";
      } else if (highlightStatus == 2) {
        return "user_info_highlight_2";
      }
      return "user_info";
    },
    clickComment: function(event) {

      if (event.target.nodeName === "SPAN") {
        // 获取触发事件对象的属性
        let key = event.target.getAttribute("key");
        let name = event.target.getAttribute("name");
        this.toUser({ userId: key });
      }
    },
    islink(txtContent) {
      if (!txtContent) {
        return "";
      }
      var check_www = "w{3}" + "[^\\s]*";
      var check_http = "(https|http|ftp|rtsp|mms)://" + "[^(\\，|\\s|(\\u4E00-\\u9FFF)))]*";
      var strRegex = check_http;
      var httpReg = new RegExp(strRegex, "gi");
      var formatTxtContent = txtContent.replace(httpReg, function(httpText) {
        if (httpText.search("http") < 0 && httpText.search("HTTP") < 0) {
          return "<a class=\"link\" href=\"" + "http://" + httpText + "\" target=\"_blank\">" + httpText + "</a>";
        } else {
          return "<a class=\"link\" href=\"" + httpText + "\" target=\"_blank\">" + httpText + "</a>";
        }
      });
      return formatTxtContent;
    },
    doText(item) {
      var m = this.islink(item.text);
      if (item.atUsers && item.atUsers.length) {

        item.atUsers.forEach((it, ins) => {
          let b = it.userName;
          if (m.includes(it.userName)) {
            m = m.replace("@" + b, "<span key=\"" + it.userId + "\" class=\"light\" style=\"color:rgba(24, 144, 255,0.8);font-size:14px;\">@" + b + "</span>");
          }
        });

      }
      return m;
    },
    chooseAt(e, it) {
      // this.comment = this.comment+it.userName+' ';
      if (this.searchkey) {
        this.comment = this.comment.replace("@" + this.searchkey, "@" + it.userName + " ");
      } else {
        this.comment = this.comment + it.userName + " ";
      }
      this.searchkey = "";
      this.showAt = false;
      this.ats.push(it.userId);
      this.atUserName.push("@" + it.userName);
      console.log("this.atUserName", this.atUserName);
      console.log(this.$(this.curInput));
      this.$(this.curInput).focus();
      // this.curInput
    },
    bindInput(e) {
      console.log(e);
      // let last = e.slice(-1);
      // console.log(last);
      // document.getElementById('')
      let index = e.target.selectionStart;//光标位置
      this.pointIndex = index;
      if (this.comment[index - 1] != "@") {
        this.showAt = false;
      }
      if (this.comment.includes("@")) {
        this.curInput = e.target;
        let s = this.comment.slice(0, index);

        let i = s.lastIndexOf("@");
        // if(index==i){return false}
        let str = this.comment.slice(i + 1, index);
        let isHave = str.includes(" ");
        if (!isHave) {
          this.atIndex = i;
          let params = {
            keyword: str
          };
          this.searchkey = str;
          if (this.canSearch) {
            this.canSearch = false;
            api.searchUserForAt(params).then(res => {
              if (res.success && res.data.length) {

                this.canSearch = true;
                this.showAt = true;
                this.atUsers = res.data;
              } else {
                this.canSearch = true;
                this.showAt = false;
                this.atUsers = res.data;
              }
            }).catch((e) => {
              this.canSearch = true;
            });
          }
        }
        if (e.code == "Backspace" && this.atUserName.length) {
          this.atUserName.forEach((item, ins) => {
            if (item.includes("@" + str) && item.slice(0, -1) == "@" + str) {
              this.ats.splice(ins, 1);
              this.atUserName.splice(ins, 1);
              console.log(this.ats, this.atUserName);
            }
          });
        }
        console.log(str);
      }

    },
    doImgs(item) {
      var a = item.split(",");
      a.forEach(it => {
        it = this.imgOrigin + it;
      });
      this.is = a;
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.images.push(res.data);
      } else if (res.errorCode == "invalid_content") {
        // this.imageUrl = ''
        this.$toast(res.errorMessage);
      }
      this.imagesNum--;
      if (!this.imagesNum) {
        this.imagesUploading = false;
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        return false;
      }
      this.imagesNum++;
      this.imagesUploading = true;
      this.filedata.fileName = file.name;
      return true;
    },
    handleAvatarExceed(files, fileList) {
      this.$message.warning({
        message: `当前限制选择 ${this.imagesLimit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`,
        duration: 2500
      });
    },
    showIcons() {
      this.showIcon = true;
    },
    toReplay2(item) {
      this.$emit("toReplay2", item);
    },
    toReplay(item) {
      //    this.replayItem = null;
      if (this.replayItem === item) {
        return;
      }
      this.images = [];
      this.$set(this, "replayItem", item);
      // this.replayItem = item;
      this.$emit("rep", item, true);
      this.showR = false;
    },
    cancelReplay() {
      this.replayItem = null;
      this.$emit("rep", null, false);
    },
    rep(item, bool) {
      this.replayItem = item;
      this.showR = bool;
    },
    refreshComment(obj) {
      this.$emit("refreshComment", obj);
    },
    refreshDelete(item) {
      this.$emit("refreshDelete", item);
    },
    deleteComment(item) {
      this.$confirm("此操作将删除此评论, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "messageBox",
        type: "warning"
      }).then(() => {
        api.deleteComment({ commentId: item.id }).then(res => {
          if (res.success) {
            this.$toast("删除成功");
            this.refreshDelete(item);
            // this.treeData.splice(index,1);
          }
        });
      }).catch(() => {
      });

    },
    highlightComment(item) {
      api.highlightComment({ commentId: item.id }).then(res => {
        if (res.success) {
          this.$toast("高亮成功");
          item.forumAdminHighlight = true;
        }
      });
    },
    unHighlightComment(item) {
      api.unHighlightComment({ commentId: item.id }).then(res => {
        if (res.success) {
          this.$toast("取消高亮成功");
          item.forumAdminHighlight = false;
        }
      });
    },

    showReportDialog(item) {
      // this.$EventBus.$emit("reportDialog_data", {
      //   dialogVisible: true,
      //   type: 'comment',
      //   reportData: item
      // });
      this.$refs.reportDialogMark.init({
        dialogVisible: true,
        type: "comment",
        reportData: item
      });
    },

    copyCommentLink(item) {
      const url = "https://choa.fun/p/" + item.postId + "?commentId=" + item.id;
      this.copy2Clipboard(url);
      this.$toast("复制链接成功！");
    },
    copy2Clipboard(content) {
      let input = document.createElement("input");
      input.setAttribute("value", content);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    },
    toSub() {
      if (this.canSub) {
        this.doLoginStatus().then(res => {
          let comment = this.comment;
          if (res) {
            if (!this.comment && (!this.images || this.images == 0)) {
              this.$toast("内容为空, 请输入内容");
              return;
            }
            let reg = new RegExp(/@[^(\s)]+/g);
            let a = comment.match(reg);
            console.log(a);
            var ats = [];
            if (a) {
              a.forEach((item, index) => {
                if (this.atUserName.includes(item)) {
                  let i = this.atUserName.findIndex(it => it == item);
                  ats.push(this.ats[i]);
                }
              });
              console.log("atc", ats);
              console.log(this.ats);
              console.log(this.atUserName);
            }
            let params = {
              parentId: this.replayItem && this.replayItem.id ? this.replayItem.id : "",
              postId: this.replayItem.postId,
              comment: this.comment.replaceAll("\n", "\n<p></p>"),
              imageNames: this.images.join(","),
              ats: ats.join(",")
            };
            console.log(this.comment);
            this.canSub = false;
            api.addComments(params).then(res => {
              if (res.success) {
                this.$toast("评论成功");
                this.images = [];
                setTimeout(() => {
                  let obj = {
                    parentId: this.replayItem ? this.replayItem.id : 0,
                    text: this.comment,
                    type: "text",
                    downs: 0,
                    ups: 0,
                    userInfo: this.userinfo
                  };
                  this.$emit("refreshComment", res.data);
                  this.replayItem = null;
                  this.comment = "";
                  this.canSub = true;
                }, 1500);
              } else {
                this.$toast(res.errorMessage);
                this.canSub = true;
              }
            }).catch(err => {
              this.canSub = true;
              this.$toast("未知错误");
            });

          } else {
            console.log("未登录", res);
          }
        });
      } else {
        this.$toast("正在提交评论...");

      }
    },
    doZanComment(v, item) {
      if (v == 1) {
        // 在我评论的列表里item.vote传的是null
        if (!item.vote || item.vote == 0) {
          item.vote = 1;
          item.ups += 1;
        } else if (item.vote == -1) {
          item.vote = 1;
          item.ups += 2;
        } else {
          item.vote = 0;
          item.ups -= 1;
        }
        api.upvoteComment({ commentId: item.id }).then(res => {
        });
      } else {
        // 在我评论的列表里item.vote传的是null
        if (!item.vote || item.vote == 0) {
          item.vote = -1;
          item.ups -= 1;
        } else if (item.vote == 1) {
          item.vote = -1;
          item.ups -= 2;
        } else {
          item.vote = 0;
          item.ups += 1;
        }
        api.downvoteComment({ commentId: item.id }).then(res => {

        });
      }
    },
    chooseEmoji(item) {
      this.comment += item;
      this.showIcon = false;
    },
    toPaste(e) {
      var cbd = e.clipboardData;
      var ua = window.navigator.userAgent;
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" && cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" && ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
        return;
      }
      // for(var i = 0; i < cbd.items.length; i++) {
      var item = cbd.items[cbd.items.length - 1];
      if (item.kind == "file" && (/^image\/[a-z]*$/.test(item.type))) {
        var blob = item.getAsFile();
        if (blob.size === 0) {
          return;
        }
        this.$refs.replyImageUpload[0].$children[0].uploadFiles([blob]);
      }
      // }
    },
    inputFocus() {
      document.addEventListener("paste", this.toPaste);
    },
    inputBlur() {
      document.removeEventListener("paste", this.toPaste);
    },
    // 修改时间格式
    changeTimeFormat() {
      this.humanizeTimeFormat = !this.humanizeTimeFormat;
    }
  }
};
</script>

<style lang="scss" scoped type="text/scss">
::v-deep .el-loading-spinner {
  top: 10%;
}

.comment_item {
  padding-top: 4px;
  display: flex;
  border-top: 1px solid #f1f1f1;
  border-left: 1px solid #f1f1f1;
  padding: 10px 0 0px 0px !important;

  .c_left {
    flex: 0 0 40px;
    text-align: center;

    .lay {
      width: 40px;
      height: 16px;
      border: none;
    }

    img {
      width: 20px;
    }

    i {
      font-size: 18px;
      cursor: pointer;
    }
  }

  .c_left2 {
    flex: 0 0 24px;
  }

  .c_content {
    flex: 1;
    // overflow: hidden;
    .user_info {
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        border-radius: 50%;
        margin-right: 2px;
      }

      .username {
        color: #1890ff;
        cursor: pointer;
        margin-left: 6px;
        line-height: 24px;

        &:hover {
          text-decoration: underline;
        }
      }

      .time {
        padding-left: 15px;
        color: #999;
        font-size: 12px;
      }

      .zan_shu {
        color: #999;
        cursor: pointer;

        img {
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
      }

      .tag {
        font-size: 12px;
        background-color: #eee;
        color: #555;
        margin-left: 5px;
        padding: 2px 3px;
        border-radius: 2px;
      }
    }

    .user_info_highlight_1 {
      background: #b2e8d1;

      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        border-radius: 50%;
        margin-right: 2px;
      }

      .username {
        color: #1890ff;
        cursor: pointer;
        margin-left: 6px;
        line-height: 24px;

        &:hover {
          text-decoration: underline;
        }
      }

      .time {
        padding-left: 15px;
        color: #111;
        font-size: 12px;
      }

      .zan_shu {
        color: #111;
        cursor: pointer;

        img {
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
      }

      .tag {
        font-size: 12px;
        background-color: #DDFFEE;
        color: #555;
        margin-left: 5px;
        padding: 2px 3px;
        border-radius: 2px;
      }
    }

    .user_info_highlight_2 {
      background: #BFDFFF;

      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        border-radius: 50%;
        margin-right: 2px;
      }

      .username {
        color: #1890ff;
        cursor: pointer;
        margin-left: 6px;
        line-height: 24px;

        &:hover {
          text-decoration: underline;
        }
      }

      .time {
        padding-left: 15px;
        color: #555;
        font-size: 12px;
      }

      .zan_shu {
        color: #555;
        cursor: pointer;

        img {
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
      }

      .tag {
        font-size: 12px;
        background-color: #CCEEFF;
        color: #555;
        margin-left: 5px;
        padding: 2px 3px;
        border-radius: 2px;
      }
    }

    .user_info_highlight_3 {
      background: #FFE1F1;

      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        border-radius: 50%;
        margin-right: 2px;
      }

      .username {
        color: #1890ff;
        cursor: pointer;
        margin-left: 6px;
        line-height: 24px;

        &:hover {
          text-decoration: underline;
        }
      }

      .time {
        padding-left: 15px;
        color: #555;
        font-size: 12px;
      }

      .zan_shu {
        color: #555;
        cursor: pointer;

        img {
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
      }

      .tag {
        font-size: 12px;
        background-color: #fff1ff;
        color: #555;
        margin-left: 5px;
        padding: 2px 3px;
        border-radius: 2px;
      }
    }

    .content {
      font-size: 15px;
      padding: 4px 0;
      line-height: 24px;
      text-align: left;
      white-space: pre-wrap;
    }
  }
}

.replayInput {
  padding-bottom: 4px;
  position: relative;

  &::before {
    display: block;
    content: '';
    clear: both;
  }

  .textarea {
    resize: none;
    font-size: 16px;
  }

  .reply_button {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    padding: 20px 20px 0;

    .subims {
      position: absolute;
      left: 0;
      top: 20px;

      a {
        + a {
          margin-left: 6px;
        }
      }
    }

    .icons {
      padding: 4px 20px 0;
      text-align: right;
      height: 60px;

      &:hover {
        flex: 1;
      }

      &:hover .emoji {
        display: block;
      }

      & > img {
        width: 24px;
        height: 24px;
      }

      .emoji {
        line-height: 34px;
        padding: 10px !important;
        border: 1px solid #d1d1d1;
        background: #fff;
        display: none;
        text-align: left;

        span {
          font-size: 24px;
          padding: 2px;
          cursor: pointer;
        }
      }
    }
  }
}

.atuser {
  position: absolute;
  top: 70px;
  left: 50px;
  background: #fff;
  border: 1px solid #ddd;
  z-index: 10;
  padding: 10px 0;
  width: 100px;

  .at_item {
    padding: 0 10px;
    line-height: 28px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    &:hover {
      color: #ff9300;
      background: #eee;
    }
  }
}

.to_delete {
  float: right;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  margin-left: 13px;
}

.icons {
  text-align: right;
  height: 60px;

  &:hover .emoji {
    display: block;
  }
}

.emoji {
  // position: absolute;
  z-index: 1;
  top: 66px;
  left: 0;
  line-height: 34px;
  padding: 10px !important;
  border: 1px solid #d1d1d1;
  background: #fff;
  display: none;
  text-align: left;

  span {
    font-size: 24px;
    padding: 2px;
    cursor: pointer;
  }
}

.comImgs {
  padding-bottom: 10px !important;

  img {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    margin-right: 6px;
  }

  div {
    display: inline-block;
  }
}

.aaa {

  position: relative;
  //width: 50px;
  //height: 30px;
  // background: #ddd;
  display: inline-block;
  overflow: hidden;
  color: #1890ff;
  padding-right: 4px;
  padding-top: 2px;

  &:hover {
    color: red;

    .futu {
      opacity: 1;
      width: 150px;
      height: auto;
      left: 60px;
      top: 0;
    }
  }

  img {
    position: absolute;
    width: initial;
    height: initial;
    right: 10px;
    top: 0;
    bottom: 0;
    left: 10px;
    opacity: 0;
    z-index: 10;
  }
}

.time {
  cursor: pointer;
}

::v-deep .messageBox {
  width: 400px !important;
  max-width: 80vw !important;
  //width: auto !important;
}
</style>

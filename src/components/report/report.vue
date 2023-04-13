<template>
  <div>
    <el-dialog :append-to-body="true" :title="dialogTitle" :visible.sync="dialogVisible">

      <!--  内容  -->
      <div style="padding: 10px;">

        <h1 style="margin-top: 5px;margin-bottom: 5px;">举报内容：</h1>

        <!--  帖子  -->
        <div v-if="'post' === this.type">
          {{ reportData.userInfo.userName }} ：{{ reportData.title }}
          <noticeItemImages v-if="reportData.imageNums>0" ref="noticeItemImages"
                            :imageNames="reportData.imageNums===1?reportData.imageName:reportData.images.toString()"/>
        </div>

        <!--  评论  -->
        <div v-if="'comment' === this.type">
          {{ reportData.userInfo.userName }} ：{{ reportData.text }}
          <noticeItemImages ref="noticeItemImages" :imageNames="reportData.imageNames"/>
        </div>

        <h1 style="margin-top: 20px;margin-bottom: 5px;"><span>举报理由：</span><span style="color:red;">*</span></h1>
        <el-radio-group v-model="reportCause" size="small">
          <el-radio-button label="政治敏感">政治敏感</el-radio-button>
          <el-radio-button label="色情低俗">色情低俗</el-radio-button>
          <el-radio-button label="违法暴力">违法暴力</el-radio-button>
          <el-radio-button label="血腥恐怖">血腥恐怖</el-radio-button>
          <el-radio-button label="侮辱诽谤">侮辱诽谤</el-radio-button>
          <el-radio-button label="侵犯隐私">侵犯隐私</el-radio-button>
          <el-radio-button label="其它">其它</el-radio-button>
        </el-radio-group>

        <h1 style="margin-top: 20px;margin-bottom: 5px;">补充理由：</h1>
        <el-input v-model="reportText" :maxlength="100" placeholder="详细描述恶意行为"></el-input>

        <div style="text-align: center;margin-top: 20px;">
          <el-button type="primary" @click="onSubmitButtonClick">提交</el-button>
        </div>


      </div>

    </el-dialog>
  </div>
</template>

<script lang="js">
import noticeItemImages from '_c/chaofan/noticeItemImages';
import {reportPostComment} from '@/api/api.js';

export default {
  name: 'report',
  props: {},
  components: {
    noticeItemImages,
  },
  data() {
    return {
      reportCause: '政治敏感',
      reportText: '',

      dialogTitle: '举报',
      type: '',
      reportData: null,
      dialogVisible: false,
    };
  },
  created() {
    this.$EventBus.$on('reportDialog_data', (data) => {
      this.init(data);
    });
  },
  methods: {
    init(data) {
      this.type = data.type;

      if (!this.type || ('comment' !== this.type && 'post' !== this.type)) {
        return;
      }

      if ('comment' === this.type) {
        this.dialogTitle = '举报评论';
      } else {
        this.dialogTitle = '举报帖子';
      }

      //
      this.reportCause = '政治敏感';
      this.reportText = '';

      this.reportData = data.reportData;
      this.dialogVisible = data.dialogVisible;
    },

    onSubmitButtonClick() {

      let reportedId = '';
      if ('comment' === this.type) {
        reportedId = this.reportData.id;
      } else if ('post' === this.type) {
        reportedId = this.reportData.postId;
      } else {
        return;
      }

      reportPostComment({
        contentType: this.type,
        id: reportedId,
        reason: this.reportCause + ' ' + this.reportText,
      }).then(res => {
        if (res.success) {
          this.$toast('举报已提交！');
        }
        this.dialogVisible = false;
      });

    },

  },
  watch: {},

};
</script>

<style scoped>

::v-deep .el-dialog {
  width: 90vw;
  max-width: 550px;
}

::v-deep .el-dialog__headerbtn {
  top: 12px;
}

::v-deep .el-dialog__header {
  padding: 10px;
  background: #eee;
  text-align: center;
}

::v-deep .el-dialog__body {
  padding: 0;
}


</style>
<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack"  round>←返回</el-button>
      <el-button @click="$toast('开发中')"  round>管理投稿</el-button>
    </div>
    <div class="nav">上传投稿</div>
    <div  class="desc">目前只支持上传携带exif信息的图片
      <p>推荐上传自己旅行拍摄的照片（尽量不要是家周边的环境）</p>
      <p>iOS 通过浏览器上传会抹掉 exif 地理位置, Android 应该同理，可以发送到电脑再上传</p>
<!--      <p>国内坐标偏移的问题正在解决</p>-->
    </div>
    <div style="margin-top: 2rem">
      <el-upload
          :before-upload="beforeAvatarUpload"
          :data="filedata"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          action="/api/v0/finder/upload_image"
          class="avatar-uploader"
          name="file">
        <img v-if="image" :src="imgOrigin + image" class="avatar">
        <i style="border: 1px solid black;" v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <el-button style="margin-top: 2rem" @click="publish" type="primary">发布</el-button>
  </div>
</template>

<script>
import * as api from '@/api/api';
import {tuxunJump} from "./common";
export default {
  name: "finder-upload",
  data() {
    return {
      history: null,
      filedata: {},
      image: null,
      id: null,
    }
  },
  created() {
    this.history = history;
    this.filedata.id = this.$route.query.id;
    this.id = this.$route.query.id;
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/finder/get', {id: this.filedata.id}).then(res=>{
        if (res.success) {
          this.image = res.data.img;
        }
      });
    },

    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/');
      }
    },
    goHome() {
      tuxunJump('/tuxun/')
    },

    beforeAvatarUpload(file) {
      console.log(file);
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!');
        return false;
      }
      this.filedata.fileName = file.name;
      return true;
    },

    handleAvatarSuccess(res) {
      if (res.success) {
        this.image = res.data;
      } else {
        this.$toast(res.errorMessage);
      }
    },

    publish() {
      api.getByPath('/api/v0/finder/publish', {id: this.id}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/finder');
        }
      });
    }

  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: white;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  background-color: white;

  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}

.avatar {
  width: 300px;
  height: 150px;
  object-fit: fill;
}

.container{
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color: #090723;
  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }
  .desc {
    color: gray;
    padding-top: 1rem;
  }
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

}
</style>

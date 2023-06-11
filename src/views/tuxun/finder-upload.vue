<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack"  round>←返回</el-button>
      <el-button v-if="type==='modify'" @click="deleteImg" round>删除</el-button>
    </div>
    <div v-if=" type !=='modify' " class="nav">上传投稿</div>
    <div v-else class="nav">更新投稿</div>
    <div  v-if=" type !=='modify' "  class="desc">目前只支持上传携带exif信息的图片
      <p>推荐上传自己旅行拍摄的照片（尽量不要是家周边的环境）</p>
      <p>请勿上传含有政治军事敏感信息等违规内容，每个投稿都会经过审核，违者会被封号</p>
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
          :disabled="type==='manager'"
          class="avatar-uploader"
          name="file">
        <img v-if="image" :src="imgOrigin + image" class="avatar">
        <i style="border: 1px solid black;" v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div v-if="lat || lng" class="latlng">
      <div>
        <div class="desc">纬度(latitude):</div>
        <el-input v-model="lat"></el-input>
      </div>
      <div>
        <div class="desc">经度(longitude):</div>
        <el-input v-model="lng"></el-input>
      </div>
    </div>
    <el-button v-if="type==='modify'" style="margin-top: 2rem" @click="publish" type="primary">更新</el-button>
    <el-button v-else style="margin-top: 2rem" @click="publish" type="primary">发布</el-button>
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
      lat: null,
      lng: null,
      image: null,
      type: null,
      id: null,
    }
  },
  created() {
    this.history = history;
    this.filedata.id = this.$route.query.id;
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/finder/get', {id: this.filedata.id}).then(res=>{
        if (res.success) {
          this.image = res.data.img;
          this.lat = res.data.lat;
          this.lng = res.data.lng;
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
    deleteImg() {
      api.getByPath('/api/v0/tuxun/findeer/delete', {id: this.id}).then(res => {
        if (res.success) {
          this.$toast('删除成功');
        }
      });
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
        this.init();
      } else {
        this.$toast(res.errorMessage);
      }
    },

    publish() {
      api.getByPath('/api/v0/finder/publish', {id: this.id}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/finder?userId=' + res.data.userId);
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
  .latlng {
    margin: auto;
    width: 20%;
    .desc {
      text-align: left;
    }
  }

}

@media only screen and (max-width: 768px) {

}
</style>

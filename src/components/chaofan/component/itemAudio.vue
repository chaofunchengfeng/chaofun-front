<template>
 <div>  
    <div >
        <div :id="'audio' + item.postId" class="video">
            <audio :class="['compatibleStyle',isDetail?'video2':'']"
              webkit-playsinline="true"  
              x-webkit-airplay="true" 
              playsinline="true"  
              x5-video-player-type="h5" 
              x5-video-orientation="h5" 
              x5-video-player-fullscreen="true"
              controls
              :src="imgOrigin+item.audio"
              alt="">
            </audio>
            <!-- <img v-if="showCover" :class="[isDetail?'video2':'']" :src="item.cover" alt=""> -->
        </div>
    </div>
 </div>
</template>

<script>
import * as api from '@/api/api';
 export default {
   name: '',
   data(){
     return {
         showCover: false,
     };
   },
   props: {
       item: {
           type: Object,
           default(){
               return {};
           }
       },
       isDetail: {
         type: Boolean,
         default: false
       },
   },
   components: {

   },
   created() {
   },
   mounted() {

  },
  destroyed() {

  },
   methods: {
    toDetail(){
      if(!this.isDetail){
        this.$emit('toDetail',this.item);
      }
    },
   }
 };
</script>

<style type='text/scss' lang='scss' scoped>
.item_video{
  position: relative;
  .title{
    padding: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
  }
  .video{
    text-align: center;
    // width: 640px;
    max-height: 512px;
    overflow-y: hidden;
    position: relative;
    video{
      width: 100%;
      height: 300px;
      background: #000;
      margin: 0 auto;
    }
    .video2{
        height: 512px;
    }
  }
}

@media screen and (max-width: 700px) {
    .item_video{
      .title{
        padding: 0 0 10px 0;
        font-size: 16px;
        font-weight: 600;
      }
      .video{
        text-align: center;
        // width: 640px;
        max-height: 512px;
        height: 230px;
        overflow-y: hidden;
        video{
          width: 100%;
          height: 230px;
          background: #000;
          margin: 0 auto;
          display: inline-block;
        }
        .video2{
            height: 230px;
        }
      }
    }
}
.compatibleStyle {
    backface-visibility:hidden;
    -webkit-backface-visibility:hidden; /* Chrome 和 Safari */
    -moz-backface-visibility:hidden;  /* Firefox */
    -ms-backface-visibility:hidden;  /* Internet Explorer */
    -webkit-perspective: 0;
    -webkit-transform: translate3d(0,0,0);
    visibility:visible;
}
</style>

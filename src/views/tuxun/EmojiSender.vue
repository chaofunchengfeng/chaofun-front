<template>
  <div class="emojo_sender">
    <div class="button">
      <el-button type="cancel" @click="hide" round>
        取消发送
      </el-button>
    </div>
    <div class="grid_main">
      <div v-for="(emoji, index) in emojis" class="emoji" @click="sendEmoji(emoji.id)">
        <img class="emoji_img" :src='"https://i.chao-fan.com/" + emoji.image + "?x-oss-process=image/resize,h_120"' alt="">
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api';

export default {
  name: 'EmojiSender',
  data() {
    return {
      emojis: []
    }
  },
  props: {
    gameId: String,
  },
  mounted() {
    this.getEmojis();
  },
  methods: {
    getEmojis() {
      api.getByPath('/api/v0/tuxun/solo/listEmojis').then(res=>{
        if (res.success) {
          this.emojis = res.data;
        }
      });
    },
    hide() {
      this.$emit('hide');
    },

    sendEmoji(emojiId) {
      this.hide();
      api.getByPath('/api/v0/tuxun/solo/sendEmoji', {gameId: this.gameId, emojiId: emojiId}).then(res=>{
        if (res.success) {
          this.$toast('发送成功');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>

.emojo_sender {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  justify-content: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
  .button {
    padding-top: 2.5rem;
    padding-bottom: 2rem ;
  }
  .grid_main {
    margin: auto;
    width: 50%;
    display: grid;
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
    grid-template-columns: repeat(5, 1fr);
    .emoji {
      margin: auto;
      width: 66px;
      height: 66px;
      justify-content: center;
      align-items: center;
      align-content: center;
      justify-content: center;
      text-align: center;
      .emoji_img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .emojo_sender {
    .grid_main {
      width: 80%;
      grid-template-columns: repeat(5, 1fr);
      .emoji {
        width: 40px;
        height: 40px;
      }
    }
  }
}

</style>

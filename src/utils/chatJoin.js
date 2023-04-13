import { startSingleChat } from '@/api/api';
import Vue from 'vue';

export function startSingle(userId) {
  startSingleChat({
    targetUserId: userId
  }).then(res => {
    if (res) {
      if (res.data) {
        localStorage.setItem('chao.fun.chat.newSingleChatChannel', JSON.stringify(res.data));
        window.open('/chat?id=' + res.data.id, '_blank');
      } else {
        Vue.prototype.$toast(res.errorMessage);
      }
    }
  });
}





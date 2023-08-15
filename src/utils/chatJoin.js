import { startSingleChat } from "@/api/api";
import Vue from "vue";

export function startSingle(userId) {
  startSingleChat({
    targetUserId: userId
  }).then(res => {
    if (res) {
      if (res.data) {
        localStorage.setItem("chao.fun.chat.newSingleChatChannel", JSON.stringify(res.data));

        // fix:safari无法打开新标签页的问题
        setTimeout(() => {
          window.open("/chat?id=" + res.data.id, "_blank");
        }, 20);

      } else {
        Vue.prototype.$toast(res.errorMessage);
      }
    }
  });
}





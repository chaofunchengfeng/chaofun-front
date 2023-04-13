<template>
  <div style="padding-left:10px; padding-right: 10px">
    <div style="text-align: center; width: 100%; font-weight: bold; font-size: 20px; color: #FF9300">FBi 历史</div>
    <div style="text-align: center; width: 100%">近200条记录</div>

    <div :style="{height: scrollerHeight}"
         style="margin-top: 10px;text-align: center;" class="selectDisable">

      <el-table :data="history" :highlight-current-row="true" :stripe="true"
                height="100%" style="width: 100%;max-width: 600px;margin: auto;">
        <el-table-column align="center" label="时间" prop="dateStr" width="110"></el-table-column>
        <el-table-column align="center" label="行为" prop="reasonStr"></el-table-column>
        <el-table-column align="center" label="收支">
          <template slot-scope="item">
            <span :style="{color:item.row.isIncome?'':'red'}">{{ item.row.valueStr }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" header-align="center" label="余额" prop="rest" width="60"></el-table-column>
      </el-table>

    </div>

  </div>
</template>

<script>

import moment from 'moment';

import * as api from '@/api/api';

export default {
  name: 'FBiHistory',
  data() {
    return {
      history: [],
      moment: moment,
    };
  },

  mounted() {
    api.getByPath('/api/v0/fbi/history', null).then((res) => {
      // log(res);
      if (res.success) {

        // 数据处理
        res.data.forEach((row) => {
          row.dateStr = moment(row.date).format('MM-DD HH:mm');
          row.reasonStr = this.getReason(row.reason);
          if (row.value < 0) {
            row.valueStr = '' + row.value;
            row.isIncome = false;
          } else {
            row.valueStr = '+' + row.value;
            row.isIncome = true;
          }
        });

        this.history = res.data;

      } else {
        this.$toast(res.errorMessage);
      }
    });
  },

  computed: {
    scrollerHeight: function () {
      return (window.innerHeight - 100) + 'px';
    }
  },

  methods: {

    getReason(reason) {
      if (reason === 'comment') {
        return '评论';
      }
      if (reason === 'admin') {
        return '管理员操作';
      }
      if (reason === 'sub_comment') {
        return '子评论';
      }
      if (reason === 'be_comment') {
        return '被评论';
      }
      if (reason === 'secret') {
        return '秘密花园';
      }
      if (reason === 'badge') {
        return '徽章';
      }
      if (reason === 'crazy_friday') {
        return '星期五登录';
      }

      if (reason === 'inviter') {
        return '邀请用户';
      }

      if (reason === 'button_game_pay') {
        return '春节小游戏点击';
      }

      if (reason === 'button_game_get') {
        return '春节小游戏获奖';
      }

      if (reason === 'send_red_packet') {
        return '发送红包';
      }

      if (reason === 'get_red_packet') {
        return '领取红包';
      }

      if (reason === 'red_packet_expire') {
        return '红包过期退回';
      }

      if (reason === 'get_fbi_gift') {
        return 'FBi 兑换礼品';

      }

      if (reason === 'convertCup') {
        return 'FBi 兑换杯子';
      }

      if (reason === 'convertTshirt') {
        return 'FBi 兑换T恤';
      }

      if (reason === 'convertPillow') {
        return 'FBi 兑换枕头';
      }

      if (reason === 'tuxunCountryStreakSkip') {
        return '图寻消费';
      }

      if (reason === 'report') {
        return '有效举报';
      }

      if (reason === 'report_ignore') {
        return '过滤举报';
      }

      if (reason === 'tuxun_award') {
        return '图寻Solo邀请奖励';
      }

      if (reason === 'tuxun_filter') {
        return '图寻图片过滤';
      }


      if (reason === 'report_solve') {
        return '举报处理';
      }

      if (reason === 'be_thx') {
        return '被感谢';
      }

      if (reason === 'thx') {
        return '感谢赠与';
      }

      // 兼容
      if (reason === 'donate_fbi' || reason === 'donate fbi for forum') {
        return '版块众筹';
      }

      if (reason === 'lottery') {
        return '抽奖';
      }

      if (reason === 'win_lottery') {
        return '抽奖奖励';
      }

      if (reason === 'manager') {
        return '版块奖励';
      }

      if (reason.startsWith('punish_politic')) {
        return '处罚：政治';
      }

      if (reason.startsWith('punish_not_friendly')) {
        return '处罚：不友善';
      }


      if (reason.startsWith('punish')) {
        return '处罚';
      }
      return reason;

    }
  }

};
</script>

<style scoped>

.selectDisable{
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}

</style>

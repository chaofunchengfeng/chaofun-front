<template>
  <div class="selectDisable">

    <el-button @click="clearFilter" style="margin-top: 10px;">清除所有过滤器</el-button>

    <el-table ref="filterTable" :data="historyList" :highlight-current-row="true" height="calc(90vh - 100px)" stripe>

      <el-table-column align="center" header-align="center" label="时间" prop="dateTimeStr"
                       width="80"></el-table-column>

      <el-table-column align="center" header-align="center" label="操作人" prop="userName" width="100"></el-table-column>

      <el-table-column :filter-method="filterType" :filters="[{ text: '捐赠', value: 'donate' }, { text: '版块奖励', value: 'manager' }, { text: '授予徽章', value: 'badge' }]" align="center" header-align="center" label="行为" prop="typeStr" width="60"></el-table-column>

      <el-table-column :filter-method="filterFbi" :filters="[{ text: '收入', value: 'income' }, { text: '支出', value: 'spend' }]" align="right" header-align="right"
                       label="收支"
                       width="60">
        <template slot-scope="item">
          <span :class="item.row.fbiClass">{{ item.row.fbiStr }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" header-align="right" label="余额" prop="remain" width="60"></el-table-column>

      <el-table-column width="20"></el-table-column>

      <el-table-column align="left" header-align="left" label="备注" prop="reasonStr" width="240"></el-table-column>


    </el-table>

  </div>
</template>

<script>
import { getDonateHistory } from '@/api/api.js';

export default {
  name: 'donateHistory',
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      historyList: []
    };
  },
  mounted() {
    this.donateHistory();
  },

  created() {
    Date.prototype.format = function(fmt) {
      const o = {
        'M+': this.getMonth() + 1,                 //月
        'd+': this.getDate(),                    //日
        'h+': this.getHours(),                   //时
        'm+': this.getMinutes(),                 //分
        's+': this.getSeconds()                 //秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    };
  },

  methods: {

    donateHistory() {
      getDonateHistory({ forumId: this.forumId }).then(res => {
        if (res.success) {

          res.data.forEach(item => {
            item.dateTimeStr = this.getDateTimeStr(item);
            item.typeStr = this.getTypeStr(item);
            item.fbiStr = this.getFbiStr(item);
            item.fbiClass = this.getFbiClass(item);
            item.reasonStr = this.getReasonStr(item);
          });

          this.historyList = res.data;
        }
      });
    },

    filterFbi(value, row) {
      return row.type === value;
    },

    filterType(value, row) {
      return row.subType === value;
    },

    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },

    getReasonStr(item) {
      let subType = item.subType;

      if ('donate' === subType) {
        if (item.reason) {
          return '捐赠留言：' + item.reason;
        } else {
          return '';
        }

      } else if ('manager' === subType) {
        return '奖励给 【' + item.targetUserName + '】';
      } else if ('badge' === subType) {
        return '向 【' + item.targetUserName + '】 授予 【' + item.badgeName + '】 徽章';
      }
      return subType;
    },

    getDateTimeStr(item) {
      let time = item.time;
      if (!time) {
        return '';
      }
      const date = new Date(time);
      return date.format('MM-dd hh:mm');
    },

    getTypeStr(item) {
      let subType = item.subType;

      if ('donate' === subType) {
        return '捐赠';
      } else if ('manager' === subType) {
        return '版块奖励';
      } else if ('badge' === subType) {
        return '授予徽章';
      }
      return subType;
    },

    getFbiStr(item) {
      let type = item.type;
      let fbi = item.fbi;

      if ('income' === type) {
        return '+' + fbi;
      } else if ('spend' === type) {
        return '-' + fbi;
      }
      return '' + fbi;
    },

    getFbiClass(item) {
      let type = item.type;

      // if ("income" === type) {
      //   return "fbi-income";
      // } else

      if ('spend' === type) {
        return 'fbi-spend';
      }
      return '';
    }

  }

};
</script>

<style lang="scss" scoped>

//.fbi-income {
//  color: #333;
//}

.fbi-spend {
  color: red;
}

.selectDisable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

::v-deep .el-table .cell {
  padding: 0 !important;
}

</style>
<template>
  <div v-if="uaResult">
    <div>实时分析近100场积分比赛</div>
    <div>用户名: {{uaResult.userName}}</div>
    <div>uid: {{uaResult.userId}}</div>
    <div>solo 次数: {{uaResult.gameCount}}</div>
    <div>总轮次: {{uaResult.roundCount}}</div>
    <div>5k: {{uaResult.score5000}}</div>
    <div>4990: {{uaResult.score4990}}</div>
    <div>平均分: {{uaResult.mean.toFixed(2)}}</div>
    <div>方差: {{uaResult.variance.toFixed(2)}}</div>
    <div>分数分布：</div>
    <v-chart style="height: 200px; width: 100vw" :option="option"></v-chart>
  </div>
</template>

<script>
import * as api from '../../api/api';
import VChart, { THEME_KEY } from 'vue-echarts';
import { CalendarHeatmap } from 'vue-calendar-heatmap';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart} from 'echarts/charts';
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);



// use([
//   CanvasRenderer,
//   LineChart,
//   TitleComponent,
//   TooltipComponent,
//   LegendComponent,
//   GridComponent
// ]);


export default {
  name: "user-analysis",
  components: {
    VChart
  },
  data() {
    return {
      uaResult: null,
      userId: null,
      option: {
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value'
        },
        tooltip:{
          show:true
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      },
    }
  },
  created() {
    this.userId = this.$route.query.userId;
    this.init();
  },
  methods: {
    init() {
      api.getByPath('/api/v0/tuxun/UA/getUserAnalysis', {userId: this.userId}).then(res => {
        if (res.success) {
          this.uaResult = res.data;
          var data = [];
          for (let i = 0; i < res.data.scoreBucketList.length; i++) {
            var scoreBucket = res.data.scoreBucketList[i];
            data.push([scoreBucket['scoreMin'].toString() + "-" + scoreBucket['scoreMax'].toString(), scoreBucket['count']]);
          }

          this.option.series = [{
            data: data,
            type: 'bar',
            areaStyle: {},
            smooth: false
          }];

        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

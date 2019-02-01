<template>
  <v-card class="echarts">
    <ECharts class="chart" :options="option" :loading="!dataUpToDate" auto-resize/>
  </v-card>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts";
import { BLUE_LIGHT, BLUE_DARK, BLACK } from "../../../colors.js";

export default {
  name: "ChartHeatmapTweetFrequency",
  components: {
    ECharts
  },
  props: {},
  data: () => ({
    loading: true,
    option: {
      title: {
        text: "Tweet Frequency per Day and Hour",
        top: "0",
        left: "center",
        right: "center"
      },
      tooltip: {
        position: "top"
      },
      animation: false,
      grid: {
        top: "40",
        height: "60%",
        y: "10%"
      },
      xAxis: {
        type: "category",
        data: [
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00"
        ],
        // data: ['12am', '1am', '2am', '3am', '4am', '5am',
        //        '6am', '7am', '8am', '9am', '10am', '11am',
        //        '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
        //        '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: "category",
        data: [
          "Sunday",
          "Saturday",
          "Friday",
          "Thursday",
          "Wednesday",
          "Tuesday",
          "Monday"
        ],
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        inRange: {
          color: [BLUE_LIGHT, BLUE_DARK] //From smaller to bigger value ->
        }
      },
      series: [
        {
          name: "Punch Card",
          type: "heatmap",
          data: [],
          label: {
            normal: {
              show: true
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: BLACK
            }
          }
        }
      ]
    }
  }),
  methods: {
    loadChartData(tweets) {
      if (tweets) {
        let chartDict = {};
        // init charDict
        for (let day = 0; day < 7; day++) {
          chartDict[day] = chartDict[day] || {};
          for (let hour = 0; hour < 24; hour++) {
            chartDict[day][hour] = 0;
          }
        }

        // count absolute numbers
        tweets.forEach(tweet => {
          if (tweet.created_at_full) {
            let date = new Date(tweet.created_at_full);
            let day = this.convertJSDayToChartDay(date.getDay());
            let hour = date.getHours();
            chartDict[day][hour] = ++chartDict[day][hour];
          }
        });

        let data = [];
        let max = 0;
        Object.keys(chartDict).forEach(function(day) {
          Object.keys(chartDict[day]).forEach(function(hour) {
            let val = chartDict[day][hour];
            data.push([parseInt(day), parseInt(hour), val]);
            if (val > max) {
              max = val;
            }
          });
        });

        data = data.map(function(item) {
          return [item[1], item[0], item[2] || "-"];
        });

        this.option.series[0].data = data;
        this.option.visualMap.max = max;
        this.loading = false;
      }
    },
    convertJSDayToChartDay(day) {
      switch (day) {
        case 0:
          return 0;
        case 1:
          return 6;
        case 2:
          return 5;
        case 3:
          return 4;
        case 4:
          return 3;
        case 5:
          return 2;
        case 6:
          return 1;
      }
    }
  },
  computed: {
    dataUpToDate() {
      if (this.$store.state.dataUpToDate) {
        this.loadChartData(this.$store.state.filteredTweets);
      }
      return this.$store.state.dataUpToDate;
    }
  }
};
</script>

<style lang="scss" scoped>
.echarts {
  min-height: 250px;
  height: 100%;
  width: 100%;
  .chart {
    height: 100%;
    width: 100%;
  }
}
</style>

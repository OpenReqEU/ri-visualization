<template>
  <v-layout>
    <v-card class="echarts">
      <ECharts class="chart" :options="line" auto-resize />
    </v-card>
  </v-layout>
</template>
<script>
import ECharts from "vue-echarts";
import "echarts";
import moment from "moment";
import "moment/locale/de";
import { FILTER_FOR_TOPIC } from "./../../../dataFilter";

moment.locale("en");
export default {
  name: "TrendMultiline",
  props: {
    feedbackCategory: {
      type: String,
      default: "problem_report",
      required: true
    },
    topic: {
      type: String,
      default: "",
      required: false
    }
  },
  components: {
    ECharts
  },
  data: () => ({
    line: {},
    dateYesterday: parseInt(
      moment()
        .subtract(1, "day")
        .format("YYYYMMDD")
    ),
    dateLastWeek: parseInt(
      moment()
        .subtract(1, "week")
        .format("YYYYMMDD")
    ),
    dateLastMonth: parseInt(
      moment()
        .subtract(1, "month")
        .format("YYYYMMDD")
    )
  }),
  methods: {
    resetChart() {
      this.line = {
        title: {
          text: "Trend of " + this.getFeedbackCategoryName(),
          left: "center",
          right: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "20%",
          bottom: "10%",
          left: "5%",
          right: "5%",
          containLabel: true
        },
        legend: {
          type: "scroll",
          show: true,
          top: 25,
          selectedMode: false,
          data: []
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: "counts",
          type: "value",
          boundaryGap: true,
          alignWithLabel: true,
          nameLocation: "center",
          min: 0,
          minInterval: 1,
          nameTextStyle: {
            padding: 5,
            fontSize: 15
          }
        },
        series: [
          {
            name: this.getFeedbackCategoryName() + " count",
            type: "line",
            symbolSize: 5,
            data: []
          }
        ]
      };
    },
    loadData(tweets) {
      this.resetChart();
      this.loadChartData(tweets);
    },
    loadChartData(tweets) {
      let self = this;

      if (this.topic !== "") {
        this.title = this.topic;
        tweets = tweets.filter(FILTER_FOR_TOPIC(this.topic));
      }

      let accounts = new Set();
      tweets.forEach(tweet => {
        accounts.add(tweet.in_reply_to_screen_name);
      });

      this.line.legend.data = Array.from(accounts);
      let chartData = [];
      Array.from(accounts).forEach(function(account, index) {
        // initialize vars
        let total = 0;
        let yesterdayCategoryTotal = 0;
        let lastWeekCategoryTotal = 0;
        let lastMonthCategoryTotal = 0;

        tweets.forEach(tweet => {
          if (tweet.in_reply_to_screen_name !== account) {
            return;
          }
          let tweetIsCategoryCount =
            tweet.tweet_class === self.feedbackCategory ? 1 : 0;

          if (tweet.created_at < self.dateYesterday) {
            yesterdayCategoryTotal += tweetIsCategoryCount;
          }
          if (tweet.created_at < self.dateLastWeek) {
            lastWeekCategoryTotal += tweetIsCategoryCount;
          }
          if (tweet.created_at < self.dateLastMonth) {
            lastMonthCategoryTotal += tweetIsCategoryCount;
          }
          total += tweetIsCategoryCount;
        });

        chartData.push({
          name: account,
          type: "line",
          data: [
            lastMonthCategoryTotal,
            lastWeekCategoryTotal,
            yesterdayCategoryTotal,
            total
          ]
        });
      });

      this.fillChartWithData(chartData);
    },
    fillChartWithData(chartData) {
      let self = this;
      if (chartData.length > 0) {
        this.line.xAxis.data = [
          "last month",
          "last week",
          "yesterday",
          "today"
        ];

        let maxValue = 0;
        chartData.forEach(function(o, index) {
          let sentimentAvgPerDay = [];
          self.line.series[index] = {
            name: o.name,
            type: o.type,
            smooth: true,
            data: o.data
          };

          let localMaxValue = Math.max.apply(Math, o.data);
          if (localMaxValue > maxValue) {
            maxValue = localMaxValue;
          }
        });

        self.styleChart(maxValue);
      }
    },
    styleChart(val) {
      // use max value to set the padding for the y-axis label
      if (val < 10) {
        this.line.yAxis.nameTextStyle.padding = 5;
      } else if (val < 100) {
        this.line.yAxis.nameTextStyle.padding = 12;
      } else if (val < 1000) {
        this.line.yAxis.nameTextStyle.padding = 20;
      } else {
        this.line.yAxis.nameTextStyle.padding = 25;
      }
    },
    getFeedbackCategoryName() {
      let self = this;
      if (self.feedbackCategory === "problem_report") {
        return "Problem Reports";
      } else if (self.feedbackCategory === "inquiry") {
        return "Inquiries";
      } else if (self.feedbackCategory === "problem_report") {
        return "Irrelevant Tweets";
      }
    }
  },
  mounted() {
    this.loadData([...this.$store.getters.filteredTweets]);
    this.$store.watch(
      (state, getters) => getters.filteredTweets,
      (newValue, oldValue) => {
        this.loadData([...newValue]);
      }
    );
  }
};
</script>

<style lang="scss" scoped>
.echarts {
  min-height: 250px;
  max-height: 300px;
  height: 100%;
  width: 100%;
  .chart {
    width: 100%;
    height: 85%;
  }
}
</style>

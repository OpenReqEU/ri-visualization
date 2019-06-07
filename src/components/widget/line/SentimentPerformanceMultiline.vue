<template>
  <v-layout>
    <v-date-picker
      v-if="customFromDateActive"
      v-model="datePickerFrom"
      no-title
      @change="datePicker()"
    ></v-date-picker>
    <v-date-picker v-if="customToDateActive" v-model="datePickerTo" no-title @change="datePicker()"></v-date-picker>
    <v-spacer/>
    <v-card class="echarts">
      <ECharts class="chart" :options="line" :loading="!dataUpToDate" auto-resize/>
    </v-card>
  </v-layout>
</template>
<script>
import ECharts from "vue-echarts";
import "echarts";
import moment from "moment";
import "moment/locale/de";
import { ITEM_STYLE_LINE_BLUE } from "../../../colors.js";

moment.locale("en");
export default {
  name: "ClassFrequencyDistribution",
  components: {
    ECharts
  },
  props: {},
  data: () => ({
    startDate: 0,
    endDate: 0,
    customFromDateActive: false,
    customToDateActive: false,
    datePickerFrom: null,
    datePickerTo: null,
    ignoreNeutralTweets: false,
    line: {}
  }),
  methods: {
    resetChart() {
      this.line = {
        title: {
          text: "Sentiment Trend (-5 very negative, +5 very positive)",
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
          data: []
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: "Average Sentiment",
          min: -5,
          max: 5,
          interval: 1,
          type: "value",
          nameLocation: "center",
          nameTextStyle: {
            padding: 10,
            fontSize: 15
          }
        },
        series: [
          {
            name: "sentiment score",
            type: "line",
            symbolSize: 5,
            smooth: true,
            itemStyle: ITEM_STYLE_LINE_BLUE,
            lineStyle: ITEM_STYLE_LINE_BLUE,
            data: []
          }
        ]
      };
    },
    postedInTimeframe(tweet) {
      return (
        tweet.created_at >= this.startDate && tweet.created_at <= this.endDate
      );
    },
    loadData(tweets) {
      this.startDate = this.getEarliestTweetDate(tweets);
      this.endDate = this.getFormattedDate(1, "days");

      tweets = tweets.filter(this.postedInTimeframe);
      this.resetChart();
      this.loadChartData(tweets);
    },
    loadChartData(tweets) {
      let self = this;

      let accounts = new Set();
      tweets.forEach(tweet => {
        accounts.add(tweet.in_reply_to_screen_name);
      });

      this.line.legend.data = Array.from(accounts);

      let chartData = [];
      Array.from(accounts).forEach(function(account, index) {
        // initialize vars
        let dictTweetSentimentPerDay = {};
        let now = moment(self.startDate, "YYYYMMDD");
        let until = moment(self.endDate, "YYYYMMDD");
        for (now; now.isBefore(until); now.add(1, "days")) {
          dictTweetSentimentPerDay[now.format("YYYYMMDD")] = {
            count: 0,
            senitmentSum: 0,
            sentimentAvg: 0
          };
        }
        tweets.forEach(tweet => {
          if (tweet.in_reply_to_screen_name !== account) {
            return;
          }
          let date = tweet.created_at;
          dictTweetSentimentPerDay[date] = {
            count:
              date in dictTweetSentimentPerDay
                ? ++dictTweetSentimentPerDay[date].count
                : 0,
            senitmentSum:
              date in dictTweetSentimentPerDay
                ? dictTweetSentimentPerDay[date].senitmentSum +
                  tweet.sentiment_score
                : tweet.sentiment_score,
            sentimentAvg:
              date in dictTweetSentimentPerDay
                ? dictTweetSentimentPerDay[date].senitmentSum /
                  dictTweetSentimentPerDay[date].count
                : 0
          };
        });

        chartData.push({
          name: account,
          type: "line",
          stack: "all",
          rawData: dictTweetSentimentPerDay,
          data: []
        });
      });

      this.fillChartWithData(chartData);
    },
    fillChartWithData(chartData) {
      let self = this;
      if (chartData.length > 0) {
        // dynamically create the xAxis labels
        let xAxisLabels = [];
        let dateRange = [];
        chartData.forEach(o => {
          dateRange = dateRange.concat(Object.keys(o.rawData));
        });
        dateRange = [...new Set(dateRange)];
        dateRange = dateRange.sort((a, b) => a - b);
        dateRange.forEach(date => {
          xAxisLabels.push(moment(date, "YYYYMMDD").format("DD.MM"));
        });

        this.line.xAxis.data = xAxisLabels;

        chartData.forEach(function(o, index) {
          let sentimentAvgPerDay = [];
          Object.keys(o.rawData).forEach(function(date) {
            sentimentAvgPerDay.push(o.rawData[date].sentimentAvg);
          });
          self.line.series[index] = {
            name: o.name,
            type: o.type,
            stack: o.stack,
            data: sentimentAvgPerDay
          };
        });
      }
    },
    getEarliestTweetDate(tweets) {
      let earliestDate = Number.MAX_SAFE_INTEGER;
      tweets.forEach(tweet => {
        earliestDate =
          tweet.created_at < earliestDate ? tweet.created_at : earliestDate;
      });

      return earliestDate;
    },
    getFormattedDate(amount, unit) {
      return moment()
        .subtract(amount, unit)
        .format("YYYYMMDD");
    }
  },
  mounted() {
    this.startDate = moment()
      .subtract(7, "days")
      .format("YYYYMMDD");
    this.endDate = moment()
      .subtract(1, "days")
      .format("YYYYMMDD");
    this.loadData(this.$store.state.filteredTweets);
  },
  computed: {
    dataUpToDate() {
      if (this.$store.state.dataUpToDate) {
        this.loadData(this.$store.state.filteredTweets);
      }
      return this.$store.state.dataUpToDate;
    }
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
.timeframe {
  padding: 0px 0px 20px 30px;
  margin: 0px 0px 0px 0px;
}
.switch {
  padding: 0px 0px 20px 0px;
  margin: 0px 0px 0px 0px;
}
</style>

<template>
  <v-layout>
    <v-card class="echarts">
      <ECharts class="chart" :options="bar" :loading="!dataUpToDate" auto-resize/>
    </v-card>
  </v-layout>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts";
import moment from "moment";
import "moment/locale/de";
import { ITEM_STYLE_BAR_BLUE } from "../../../colors.js";

export default {
  name: "ClassFrequencyDistribution",
  components: {
    ECharts
  },
  props: {},
  data: () => ({
    startDate: 0,
    endDate: 0,
    bar: {}
  }),
  methods: {
    resetChart() {
      this.bar = {
        title: {
          text: "Number of Tweets per Category",
          left: "center",
          right: "center"
        },
        toolbox: {
          showTitle: false,
          feature: {
            magicType: {
              type: ["tiled", "stack"]
            }
          }
        },
        grid: {
          top: "25%",
          bottom: "15%",
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
          data: ["problem report", "inquiry", "irrelevant"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "Sales",
            type: "bar",
            data: ["problem report", "inquiry", "irrelevant"],
            itemStyle: ITEM_STYLE_BAR_BLUE,
            label: {
              normal: {
                show: true
              }
            }
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
      if (tweets) {
        let accounts = new Set();
        tweets.forEach(tweet => {
          accounts.add(tweet.in_reply_to_screen_name);
        });

        this.bar.legend.data = Array.from(accounts);

        let chartData = [];
        Array.from(accounts).forEach(function(account, index) {
          let dataProblemReports = 0;
          let dataInquiries = 0;
          let dataIrrelevant = 0;
          tweets.forEach(function(tweet) {
            if (tweet.in_reply_to_screen_name !== account) {
              return;
            }
            switch (tweet.tweet_class) {
              case "problem_report":
                dataProblemReports++;
                break;
              case "inquiry":
                dataInquiries++;
                break;
              case "irrelevant":
                dataIrrelevant++;
                break;
            }
          });
          self.bar.series[index] = {
            name: account,
            type: "bar",
            stack: "all ",
            data: [dataProblemReports, dataInquiries, dataIrrelevant]
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
  },
  watch: {
    selectedTimeFrame() {
      switch (this.selectedTimeFrame) {
        case this.timeframes[0]:
          this.startDate = moment()
            .subtract(7, "days")
            .format("YYYYMMDD");
          this.endDate = moment()
            .subtract(1, "days")
            .format("YYYYMMDD");
          break;
        case this.timeframes[1]:
          this.startDate = moment()
            .subtract(30, "days")
            .format("YYYYMMDD");
          this.endDate = moment()
            .subtract(1, "days")
            .format("YYYYMMDD");
          break;
        case this.timeframes[2]:
          this.startDate = moment()
            .subtract(90, "days")
            .format("YYYYMMDD");
          this.endDate = moment()
            .subtract(1, "days")
            .format("YYYYMMDD");
          break;
        case this.timeframes[3]:
          this.startDate = moment()
            .subtract(moment().dayOfYear() - 1, "days")
            .format("YYYYMMDD");
          this.endDate = moment()
            .subtract(1, "days")
            .format("YYYYMMDD");
          break;
        case this.timeframes[4]:
          this.startDate = 0;
          this.endDate = moment()
            .subtract(1, "days")
            .format("YYYYMMDD");
          break;
        case this.timeframes[5]:
          this.customFromDateActive = true;
          break;
        case this.timeframes[6]:
          this.customToDateActive = true;
          break;
        default:
          this.selectedTimeFrame = this.timeframes[0];
          this.startDate = moment()
            .subtract(7, "days")
            .format("YYYYMMDD");
          this.endDate = moment()
            .subtract(1, "days")
            .format("YYYYMMDD");
      }

      this.loadData(this.$store.state.filteredTweets);
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
    // height: 70%;
    height: 85%;
  }
}
.timeframe {
  padding: 0px 0px 0px 30px;
  margin: 0px 0px 0px 0px;
  width: 25%;
}
</style>

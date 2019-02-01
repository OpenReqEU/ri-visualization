<template>
  <v-card class="echarts">
    <ECharts
      :options="bar"
      :loading="!dataUpToDate"
      auto-resize
    />
  </v-card>
</template>

<script>
  import ECharts from 'vue-echarts';
  import 'echarts';
  import {
    ITEM_STYLE_BAR_SENTIMENT_NEG,
    ITEM_STYLE_BAR_SENTIMENT_NEU,
    ITEM_STYLE_BAR_SENTIMENT_POS
  } from '../../colors.js';

  export default {
    name: 'ChartClassDistribution',
    components: {
      ECharts
    },
    props: {},
    data: () => ({
      bar: {
        title: {
          text: 'Number of Tweets per Sentiment and Category',
          left: 'center',
          right: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
            shadowStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 5,
              opacity: 0.4
            },
            backgroundColor: 'rgba(50,50,50,0.4)'
          }
        },
        legend: {
          data: ['Negative', 'Neutral', 'Positive'],
          orient: 'horizontal',
          top:'15%'
        },
        grid: {
          top: '25%',
          bottom: '15%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Problem Reports', 'Inquiry', 'Irrelevant'],
          axisLabel: {
            fontSize: 10
          }
        },
        yAxis: {
          name: 'Number of Tweets',
          type: 'value',
          scale: true,
          nameLocation: 'center',
          nameTextStyle: {
            padding: 20,
            fontSize: 10
          },
          min: 0
        },
        series: [
          {
            name: 'Negative',
            data: [0, 0, 0],
            type: 'bar',
            stack: 'sentiment',
            label: {
              normal: {
                show: false,
                color: 'rgb(0, 0, 0)',
              },
            },
            itemStyle: ITEM_STYLE_BAR_SENTIMENT_NEG,
          },
          {
            name: 'Neutral',
            data: [0, 0, 0],
            type: 'bar',
            stack: 'sentiment',
            label: {
              normal: {
                show: false,
                color: 'rgb(0, 0, 0)',
              }
            },
            itemStyle: ITEM_STYLE_BAR_SENTIMENT_NEU,
          },
          {
            name: 'Positive',
            data: [0, 0, 0],
            type: 'bar',
            stack: 'sentiment',
            label: {
              normal: {
                show: false,
                color: 'rgb(0, 0, 0)',
              }
            },
            itemStyle: ITEM_STYLE_BAR_SENTIMENT_POS,
          }
        ],
      }
    }),
    methods: {
      loadChartData(tweets) {
        if (tweets) {
          let chartData = {
            'problem_report': {'NEUTRAL': 0, 'NEGATIVE': 0, 'POSTIVE': 0},
            'inquiry': {'NEUTRAL': 0, 'NEGATIVE': 0, 'POSTIVE': 0},
            'irrelevant': {'NEUTRAL': 0, 'NEGATIVE': 0, 'POSTIVE': 0}
          };
          tweets.forEach(function (tweet) {
            chartData[tweet.tweet_class][tweet.sentiment] = ++chartData[tweet.tweet_class][tweet.sentiment];
          });
          this.bar.series[0].data = [
            chartData['problem_report']['NEGATIVE'],
            chartData['inquiry']['NEGATIVE'],
            chartData['irrelevant']['NEGATIVE']
          ]; // negative values
          this.bar.series[1].data = [
            chartData['problem_report']['NEUTRAL'],
            chartData['inquiry']['NEUTRAL'],
            chartData['irrelevant']['NEUTRAL']
          ]; // neutral values
          this.bar.series[2].data = [
            chartData['problem_report']['POSTIVE'],
            chartData['inquiry']['POSTIVE'],
            chartData['irrelevant']['POSTIVE']
          ]; // positive values
        }
      }
    },
    computed: {
      dataUpToDate() {
        if(this.$store.state.dataUpToDate) {
          this.loadChartData(this.$store.state.filteredTweets)
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

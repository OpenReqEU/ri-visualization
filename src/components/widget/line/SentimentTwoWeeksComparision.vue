<template>
  <v-card class="echarts">
    <ECharts
      class="chart"
      :options="line"
      :loading="loading"
      auto-resize
    />
  </v-card>
</template>
<script>
  import ECharts from 'vue-echarts';
  import 'echarts';
  import moment from 'moment';
  import 'moment/locale/de'
  import {ITEM_STYLE_LINE_BLUE, ITEM_STYLE_LINE_ORANGE} from '../../../colors.js';

  moment.locale('en');
  export default {
    name: 'ClassFrequencyDistribution',
    components: {
      ECharts
    },
    props: {},
    data: () => ({
      twitterAccount: 'Tre_It',
      loading: false,
      line: {
        title: {
          text: 'Sentiment Weekly Performance Comparision',
          left: 'center',
          right: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '10%',
          data: ['current week', 'last week']
        },
        grid: {
          top: '20%',
          bottom: '10%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        },
        yAxis: {
          name: 'Average Sentiment',
          min: -5,
          max: 5,
          interval: 1,
          type: 'value',
          nameLocation: 'center',
          nameTextStyle: {
            padding: 10,
            fontSize: 10
          }
        },
        series: [
          {
            name: 'last week',
            type: 'line',
            symbolSize: 10,
            smooth: true,
            itemStyle: ITEM_STYLE_LINE_ORANGE,
            lineStyle: ITEM_STYLE_LINE_ORANGE,
            data: []
          },
          {
            name: 'current week',
            type: 'line',
            symbolSize: 10,
            smooth: true,
            itemStyle: ITEM_STYLE_LINE_BLUE,
            lineStyle: ITEM_STYLE_LINE_BLUE,
            data: []
          }
        ]
      }
    }),
    methods: {
      /**
       * Calculates the days of the week from today backwards.
       * @returns {*[]} daysOfTheWeek A list of abbreviated days of the week ending with today.
       */
      fromToday() {
        let daysOfTheWeek = [];
        for (let i = 0; i < 7; i++) {
          daysOfTheWeek.push(moment(-i).subtract(i, 'days').format('ddd'));
        }
        return daysOfTheWeek.reverse();
      },
      loadChartData(tweets) {
        if (tweets[this.twitterAccount].length === 0) {
          return
        }

        let previousWeekStart = this.getFormattedDateAsInt(-13);
        let previousWeekEnd = this.getFormattedDateAsInt(-7);

        let currentWeekStart = this.getFormattedDateAsInt(-6);
        let currentWeekEnd = this.getFormattedDateAsInt(0);

        let dataSentimentPreviousWeek = [];
        let dataSentimentCurrentWeek = [];

        let dictPrevWeek = {};
        let dictCurrWeek = {};
        tweets[this.twitterAccount].forEach(function (tweet) {
          let date = tweet.created_at;
          if (date >= previousWeekStart && date <= previousWeekEnd) {
            dictPrevWeek[date] = {
              count: date in dictPrevWeek ? ++dictPrevWeek[date].count : 0,
              sum: date in dictPrevWeek ? dictPrevWeek[date].sum + tweet.sentiment_score : tweet.sentiment_score
            };
          } else if (date >= currentWeekStart && date <= currentWeekEnd) {
            dictCurrWeek[date] = {
              count: date in dictCurrWeek ? ++dictCurrWeek[date].count : 0,
              sum: date in dictCurrWeek ? dictCurrWeek[date].sum + tweet.sentiment_score : tweet.sentiment_score
            };
          }
        });

        Object.keys(dictPrevWeek).forEach(function (key) {
          dataSentimentPreviousWeek.push(dictPrevWeek[key].sum / dictPrevWeek[key].count)
        });
        this.line.series[0].data = dataSentimentPreviousWeek;

        Object.keys(dictCurrWeek).forEach(function (key) {
          dataSentimentCurrentWeek.push(dictCurrWeek[key].sum / dictCurrWeek[key].count)
        });
        this.line.series[1].data = dataSentimentCurrentWeek

        this.line.xAxis.data = this.fromToday();
      },
      getFormattedDateAsInt(count) {
        let date = new Date();
        date.setDate(date.getDate() - -count);

        let year = date.getFullYear();
        let month = `${date.getMonth() + 1}`.padStart(2, 0);
        let day = `${date.getDate()}`.padStart(2, 0);
        return parseInt(year + month + day)
      }
    },
    mounted() {
      this.$store.dispatch('setToolbarHeader', 'Sentiment Overview');
      this.loadChartData(this.$store.getters.getTweets);
      this.fromToday();
    }
  }
</script>
<style lang="scss" scoped>
.echarts {
  min-height: 250px;
  height: 100%;
  width: 100%;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>

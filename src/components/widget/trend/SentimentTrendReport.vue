<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <span class="grey--text">Average Sentiment</span>
        <div class="headline text-uppercase">{{polarity[0]}} - {{polarity[1]}}</div>
      </div>
    </v-card-title>

    <v-divider horizontal></v-divider>

    <v-card-actions>
      <v-layout align-center justify-center column fill-height>
        <v-flex xs12>
          <span class="grey--text text-uppercase">yesterday</span>
        </v-flex>
        <v-layout align-center justify-center row fill-height class="text-uppercase headline">
          <v-icon v-if="yesterdayDifference > 0" large color="green">arrow_drop_up</v-icon>
          <v-icon v-else-if="yesterdayDifference < 0" large color="red">arrow_drop_down</v-icon>
          <v-icon v-else large color="black">remove</v-icon>
          <span>{{yesterdayDifference}}</span>
        </v-layout>
        <v-flex xs12>
          <span>{{yesterdaySentiment}}</span>
        </v-flex>
      </v-layout>

      <v-divider vertical></v-divider>

      <v-layout align-center justify-center column fill-height>
        <v-flex xs12>
          <span class="grey--text text-uppercase">LAST WEEK</span>
        </v-flex>
        <v-layout align-center justify-center row fill-height class="text-uppercase headline">
          <v-icon v-if="lastWeekDifference > 0" large color="green">arrow_drop_up</v-icon>
          <v-icon v-else-if="lastWeekDifference < 0" large color="red">arrow_drop_down</v-icon>
          <v-icon v-else large color="black">remove</v-icon>
          <span>{{lastWeekDifference}}</span>
        </v-layout>
        <v-flex xs12>
          <span>{{lastWeekSentiment}}</span>
        </v-flex>
      </v-layout>

      <v-divider vertical></v-divider>

      <v-layout align-center justify-center column fill-height>
        <v-flex xs12>
          <span class="grey--text text-uppercase">LAST MONTH</span>
        </v-flex>
        <v-layout align-center justify-center row fill-height class="text-uppercase headline">
          <v-icon v-if="lastMonthDifference > 0" large color="green">arrow_drop_up</v-icon>
          <v-icon v-else-if="lastMonthDifference < 0" large color="red">arrow_drop_down</v-icon>
          <v-icon v-else large color="black">remove</v-icon>
          <span>{{lastMonthDifference}}</span>
        </v-layout>
        <v-flex xs12>
          <span>{{lastMonthSentiment}}</span>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";
import math from "mathjs";
import * as ss from "simple-statistics";

export default {
  name: "SentimentTrendReport",
  components: {},
  data: () => ({
    polarity: [],
    totalSentiment: 0,
    yesterdayDifference: 0,
    yesterdaySentiment: 0,
    lastWeekDifference: 0,
    lastWeekSentiment: 0,
    lastMonthDifference: 0,
    lastMonthSentiment: 0,
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
  mounted() {
    this.loadChartData([...this.$store.getters.filteredTweets]);
    this.$store.watch(
      (state, getters) => getters.filteredTweets,
      (newValue, oldValue) => {
        this.loadChartData([...newValue]);
      }
    );
  },
  methods: {
    calculatePolarity(sentimentScore) {
      let polarity = "neutral";
      if (sentimentScore >= -1 && sentimentScore <= 1) {
        polarity = "neutral";
      } else if (sentimentScore > 1) {
        polarity = "positive";
      } else if (sentimentScore < -1) {
        polarity = "negative";
      }
      return [sentimentScore, polarity];
    },
    loadChartData(tweets) {
      this.polarity = [];
      this.totalSentiment = 0;
      this.yesterdayDifference = 0;
      this.yesterdaySentiment = 0;
      this.lastWeekDifference = 0;
      this.lastWeekSentiment = 0;
      this.lastMonthDifference = 0;
      this.lastMonthSentiment = 0;

      if (tweets != null && tweets.length > 1) {
        let sentimentTotal = [];
        let sentimentYesterday = [];
        let sentimentLastWeek = [];
        let sentimentLastMonth = [];
        tweets.forEach((tweet, index) => {
          let sentimentScore = tweet.sentiment_score;
          if (sentimentScore === undefined) {
            return;
          }
          let createdAt = tweet.created_at;
          if (createdAt < this.dateLastMonth) {
            sentimentLastMonth.push(sentimentScore);
          }
          if (createdAt < this.dateLastWeek) {
            sentimentLastWeek.push(sentimentScore);
          }
          if (createdAt < this.dateYesterday) {
            sentimentYesterday.push(sentimentScore);
          }
          sentimentTotal.push(sentimentScore);
        });

        let totalArithmeticMean =
          sentimentTotal.length > 0
            ? math.round(ss.mean(sentimentTotal), 2)
            : 0;
        let yesterdayArithmeticMean =
          sentimentYesterday.length > 0
            ? math.round(ss.mean(sentimentYesterday), 2)
            : 0;
        let lastWeekArithmeticMean =
          sentimentLastWeek.length > 0
            ? math.round(ss.mean(sentimentLastWeek), 2)
            : 0;
        let lastMonthArithmeticMean =
          sentimentLastMonth.length > 0
            ? math.round(ss.mean(sentimentLastMonth), 2)
            : 0;

        let yesterdayDifference = math.round(
          totalArithmeticMean - yesterdayArithmeticMean,
          2
        );
        let lastWeekDifference = math.round(
          totalArithmeticMean - lastWeekArithmeticMean,
          2
        );
        let lastMonthDifference = math.round(
          totalArithmeticMean - lastMonthArithmeticMean,
          2
        );

        this.totalSentiment = totalArithmeticMean;
        this.yesterdaySentiment = yesterdayArithmeticMean;
        this.lastWeekSentiment = lastWeekArithmeticMean;
        this.lastMonthSentiment = lastMonthArithmeticMean;

        this.yesterdayDifference = yesterdayDifference;
        this.lastWeekDifference = lastWeekDifference;
        this.lastMonthDifference = lastMonthDifference;
        this.polarity = this.calculatePolarity(this.totalSentiment);
      }
    }
  }
};
</script>

<style scoped>
.total-sentiment {
  float: left;
}
</style>

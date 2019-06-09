<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <span class="grey--text">Total {{getTweetCategoryName()}}</span>
        <div class="headline text-uppercase">{{total}}</div>
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
          <span>{{yesterdayCategoryTotal}}</span>
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
          <span>{{lastWeekCategoryTotal}}</span>
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
          <span>{{lastMonthCategoryTotal}}</span>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  name: "ClassificationTrendReport",
  props: {
    tweetCategory: {
      type: String,
      default: "problem_report",
      required: true
    }
  },
  data: () => ({
    polarity: [],
    total: 0,
    yesterdayDifference: 0,
    yesterdayCategoryTotal: 0,
    lastWeekDifference: 0,
    lastWeekCategoryTotal: 0,
    lastMonthDifference: 0,
    lastMonthCategoryTotal: 0,
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
    loadChartData(tweets) {
      this.total = 0;
      this.yesterdayCategoryTotal = 0;
      this.lastWeekCategoryTotal = 0;
      this.lastMonthCategoryTotal = 0;

      this.yesterdayDifference = 0;
      this.lastWeekDifference = 0;
      this.lastMonthDifference = 0;

      if (tweets != null && tweets.length > 1) {
        let self = this;
        tweets.forEach((tweet, index) => {
          let tweetIsCategoryCount =
            tweet.tweet_class === self.tweetCategory ? 1 : 0;

          if (tweet.created_at < this.dateYesterday) {
            this.yesterdayCategoryTotal += tweetIsCategoryCount;
          }
          if (tweet.created_at < this.dateLastWeek) {
            this.lastWeekCategoryTotal += tweetIsCategoryCount;
          }
          if (tweet.created_at < this.dateLastMonth) {
            this.lastMonthCategoryTotal += tweetIsCategoryCount;
          }
          this.total += tweetIsCategoryCount;
        });

        this.yesterdayDifference = this.total - this.yesterdayCategoryTotal;
        this.lastWeekDifference = this.total - this.lastWeekCategoryTotal;
        this.lastMonthDifference = this.total - this.lastMonthCategoryTotal;
      }
    },
    getTweetCategoryName() {
      let self = this;
      if (self.tweetCategory === "problem_report") {
        return "Problem Reports";
      } else if (self.tweetCategory === "inquiry") {
        return "Inquiries";
      } else if (self.tweetCategory === "problem_report") {
        return "Irrelevant Tweets";
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

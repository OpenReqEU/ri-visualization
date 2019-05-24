<template>
  <v-card v-if="dataUpToDate">
    <v-card-title primary-title>
      <div>
        <span class="grey--text">Total {{getTweetCategoryName()}}</span>
        <div class="headline text-uppercase">{{total}}</div>
      </div>
    </v-card-title>

    <v-divider horizontal></v-divider>

    <v-card-actions>
      <!--<v-divider vertical></v-divider>-->

      <v-layout align-center justify-center column fill-height>
        <v-flex xs12>
          <span class="grey--text text-uppercase">yesterday</span>
        </v-flex>
        <v-flex xs12>
          <span class="text-uppercase headline">{{yesterdayCategoryTotal}}</span>
        </v-flex>
        <v-layout align-center justify-center row fill-height>
          <v-icon v-if="yesterdayDifference > 0" large color="green">arrow_drop_up</v-icon>
          <v-icon v-else-if="yesterdayDifference < 0" large color="red">arrow_drop_down</v-icon>
          <v-icon v-else large color="black">remove</v-icon>
          <span>{{yesterdayDifference}}</span>
        </v-layout>
      </v-layout>

      <v-divider vertical></v-divider>

      <v-layout align-center justify-center column fill-height>
        <v-flex xs12>
          <span class="grey--text text-uppercase">LAST WEEK</span>
        </v-flex>
        <v-flex xs12>
          <span class="text-uppercase headline">{{lastWeekCategoryTotal}}</span>
        </v-flex>
        <v-layout align-center justify-center row fill-height>
          <v-icon v-if="lastWeekDifference > 0" large color="green">arrow_drop_up</v-icon>
          <v-icon v-else-if="lastWeekDifference < 0" large color="red">arrow_drop_down</v-icon>
          <v-icon v-else large color="black">remove</v-icon>
          <span>{{lastWeekDifference}}</span>
        </v-layout>
      </v-layout>

      <v-divider vertical></v-divider>

      <v-layout align-center justify-center column fill-height>
        <v-flex xs12>
          <span class="grey--text text-uppercase">LAST MONTH</span>
        </v-flex>
        <v-flex xs12>
          <span class="text-uppercase headline">{{lastMonthCategoryTotal}}</span>
        </v-flex>
        <v-layout align-center justify-center row fill-height>
          <v-icon v-if="lastMonthDifference > 0" large color="green">arrow_drop_up</v-icon>
          <v-icon v-else-if="lastMonthDifference < 0" large color="red">arrow_drop_down</v-icon>
          <v-icon v-else large color="black">remove</v-icon>
          <span>{{lastMonthDifference}}</span>
        </v-layout>
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
    lastMonthCategoryTotal: 0
  }),
  computed: {
    dataUpToDate() {
      if (this.$store.getters.dataUpToDate) {
        this.loadChartData(this.$store.getters.filteredTweets);
      }
      return this.$store.getters.dataUpToDate;
    }
  },
  methods: {
    loadChartData(tweets) {
      if (tweets != null && tweets.length > 1) {
        let self = this;
        let yesterday = parseInt(
          moment()
            .subtract(1, "day")
            .format("YYYYMMDD")
        );
        let lastWeek = parseInt(
          moment()
            .subtract(1, "week")
            .format("YYYYMMDD")
        );
        let lastMonth = parseInt(
          moment()
            .subtract(1, "month")
            .format("YYYYMMDD")
        );

        let total = 0;
        let categoryYesterday = 0;
        let categoryLastWeek = 0;
        let categoryLastMonth = 0;
        tweets.forEach((tweet, index) => {
          let tweetIsCategoryCount =
            tweet.tweet_class === self.tweetCategory ? 1 : 0;

          if (tweet.created_at <= yesterday) {
            categoryYesterday += tweetIsCategoryCount;
          }
          if (tweet.created_at <= lastWeek) {
            categoryLastWeek += tweetIsCategoryCount;
          }
          if (tweet.created_at <= lastMonth) {
            categoryLastMonth += tweetIsCategoryCount;
          }
          total += tweetIsCategoryCount;
        });

        this.total = total;
        this.yesterdayCategoryTotal = categoryYesterday;
        this.lastWeekCategoryTotal = categoryLastWeek;
        this.lastMonthCategoryTotal = categoryLastMonth;

        this.yesterdayDifference = total - categoryYesterday;
        this.lastWeekDifference = total - categoryLastWeek;
        this.lastMonthDifference = total - categoryLastMonth;
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

<template>
  <v-container>
    <v-layout row>
      <filter-tool-bar/>
    </v-layout>
    <v-spacer/>
    <v-layout row wrap>
      <v-flex xs12 md6 left-half-row-widget class="row">
        <sentiment-performance-multiline/>
      </v-flex>
      <v-flex xs12 md6 class="row">
        <class-frequency-distribution-multibar/>
      </v-flex>
      <v-flex xs12 class="row">
        <competitor-two-category-comparison/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { ACTION_SET_TOOLBAR_HEADER } from "./../store/types.js";
import FilterToolBar from "./toolbar/FilterToolBar";
import SentimentPerformanceMultiline from "./widget/line/SentimentPerformanceMultiline";
import ClassFrequencyDistributionMultibar from "./widget/bar/ClassFrequencyDistributionMultibar";
import CompetitorTwoCategoryComparison from "./widget/table/CompetitorTwoCategoryComparison";

const PROBLEM_REPORTS = "problem_reports";
const INQUIRIES = "inquiries";
const ACCOUNT = "account";
const TOTAL = "total";
const YESTERDAY = "yesterday";
const WEEK = "week";
const MONTH = "month";

export default {
  components: {
    "filter-tool-bar": FilterToolBar,
    SentimentPerformanceMultiline,
    ClassFrequencyDistributionMultibar,
    CompetitorTwoCategoryComparison
  },
  data() {
    return {
      erros: [],
      tooblarTitle: "Competitor Comparison"
    };
  },
  mounted() {
    this.$store.dispatch(ACTION_SET_TOOLBAR_HEADER, this.tooblarTitle);
  }
};
</script>

<style scoped>
table.v-table tbody tr,
table.v-table tbody td,
table.v-table tbody th {
  min-height: 50px;
  height: 50px;
  max-height: 50px;
}
.row {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
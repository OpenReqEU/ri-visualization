<template>
  <v-container>
    <v-layout row>
      <filter-tool-bar></filter-tool-bar>
    </v-layout>

    <v-layout row full-row-widget>
      <v-flex xs12>
        <heatmap-class-frequency/>
      </v-flex>
    </v-layout>

    <div v-if="$vuetify.breakpoint.smAndUp">
      <v-layout row full-row-widget>
        <v-flex xs4 md6 left-half-row-widget>
          <classification-trend-report tweetCategory="problem_report"/>
        </v-flex>
        <v-flex xs4 md6 left-half-row-widget>
          <classification-trend-report tweetCategory="inquiry"/>
        </v-flex>
        <v-flex xs4 md6 right-half-row-widget>
          <sentiment-trend-report/>
        </v-flex>
      </v-layout>

      <v-layout row full-row-widget>
        <v-flex xs6 left-half-row-widget>
          <class-frequency-distribution/>
        </v-flex>
        <v-flex xs6 right-half-row-widget>
          <sentiment-performance/>
        </v-flex>
      </v-layout>
    </div>
    <div v-else>
      <v-flex xs12 full-row-widget>
        <classification-trend-report tweetCategory="problem_report"/>
      </v-flex>
      <v-flex xs12 full-row-widget>
        <classification-trend-report tweetCategory="inquiry"/>
      </v-flex>
      <v-flex xs12 full-row-widget>
        <sentiment-trend-report/>
      </v-flex>
      <v-flex xs12 full-row-widget>
        <class-frequency-distribution/>
      </v-flex>
      <v-flex xs12 full-row-widget>
        <sentiment-performance/>
      </v-flex>
    </div>
  </v-container>
</template>
<script>
import FilterToolBar from "./toolbar/FilterToolBar";
import ClassFrequencyDistribution from "./widget/bar/ClassFrequencyDistribution";
import SentimentPerformance from "./widget/line/SentimentPerformance";
import HeatmapClassFrequency from "./widget/heatmap/HeatmapClassFrequency";
import SentimentTrendReport from "./widget/trend/SentimentTrendReport";
import ClassificationTrendReport from "./widget/trend/ClassificationTrendReport";
export default {
  name: "DashboardHome",
  components: {
    FilterToolBar,
    SentimentPerformance,
    ClassFrequencyDistribution,
    HeatmapClassFrequency,
    SentimentTrendReport,
    ClassificationTrendReport
  },
  mounted() {
    this.$store.dispatch("setToolbarHeader", "Dashboard");
  }
};
</script>



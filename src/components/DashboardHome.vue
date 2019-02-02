<template>
  <v-container>
    <v-layout id="v-step-1" row>
      <filter-tool-bar></filter-tool-bar>
    </v-layout>

    <v-layout  id="v-step-2" row full-row-widget>
      <v-flex xs12>
        <heatmap-class-frequency/>
      </v-flex>
    </v-layout>

    <div v-if="$vuetify.breakpoint.smAndUp">
      <v-layout id="v-step-5" row full-row-widget>
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

      <v-layout row full-row-widget >
        <v-flex id="v-step-3" xs6 left-half-row-widget>
          <class-frequency-distribution/>
        </v-flex>
        <v-flex id="v-step-4" xs6 right-half-row-widget>
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
      <v-flex id="v-step-3" xs12 full-row-widget>
        <class-frequency-distribution/>
      </v-flex>
      <v-flex id="v-step-4" xs12 full-row-widget>
        <sentiment-performance/>
      </v-flex>
    </div>
    <v-tour name="dashboardTour" :steps="steps"></v-tour>
  </v-container>
</template>
<script>
import FilterToolBar from './toolbar/FilterToolBar'
import ClassFrequencyDistribution from './widget/bar/ClassFrequencyDistribution'
import SentimentPerformance from './widget/line/SentimentPerformance'
import HeatmapClassFrequency from './widget/heatmap/HeatmapClassFrequency'
import SentimentTrendReport from './widget/trend/SentimentTrendReport'
import ClassificationTrendReport from './widget/trend/ClassificationTrendReport'
export default {
  name: 'DashboardHome',
  components: {
    FilterToolBar,
    SentimentPerformance,
    ClassFrequencyDistribution,
    HeatmapClassFrequency,
    SentimentTrendReport,
    ClassificationTrendReport
  },
  data () {
    return {
      steps: [
        {
          target: '#v-step-0',  // We're using document.querySelector() under the hood
          content: `Welcome to the tutorial of the<br><strong>Requirements Intelligence</strong><br><br>This is the menu. Here, you switch between the different views. Each view serves a single purpose.`,
          params: {
              placement: 'bottom'
            }
        },
        {
          target: '#v-step-1',  // We're using document.querySelector() under the hood
          content: `This is the <strong>Filter</strong>. Depending on the view, you have either the option to 1st switch between the Twitter accounts, 2nd select a start date from when you want to see tweets, and third, the date until which tweets should be included. Some view support all three options.`
        },
        {
          target: '#v-step-2',  // We're using document.querySelector() under the hood
          content: `This is heatmap shows at which day and daytime WindTre customers write informative tweets (problem reports, inquiries, or feature requests).`,
          params: {
              placement: 'left'
            }
        },
        {
          target: '#v-step-3',  // We're using document.querySelector() under the hood
          content: `The bar chart shows the number of tweets per tweet category.`,
          params: {
              placement: 'left'
            }
        },
        {
          target: '#v-step-4',  // We're using document.querySelector() under the hood
          content: `The line chart compares the average sentiment of this week with the previous week. In case of, e.g., breakdowns of the mobile network, you can see how fast you recover from negative tweets.`,
          params: {
              placement: 'right'
            }
        },
        {
          target: '#v-step-5',  // We're using document.querySelector() under the hood
          content: `These reports compare the tweets regarding the <strong>number of problem reports</strong>, <strong>number of inquiries</strong>, and the <strong>average sentiment</strong> to different dates (yesterday, last week, last month).`,
          params: {
              placement: 'top'
            }
        },
      ]
    }
  },
  mounted() {
    this.$store.dispatch('setToolbarHeader', 'Dashboard');
    if(this.$store.state.showTutorial) {
      this.$tours['dashboardTour'].start()
    }
  }
}
</script>



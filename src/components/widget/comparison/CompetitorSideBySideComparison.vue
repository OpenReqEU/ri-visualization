<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title class="header ma-0 pa-0">
          <div class="headline title black--text justify-center">{{getTitle()}}</div>
          <v-spacer />
          <v-layout row class="icon-spacer" align-center justify-end>
            <v-btn-toggle v-model="viewType" mandatory>
              <v-btn small>
                <v-icon>table_chart</v-icon>
              </v-btn>
              <v-btn small>
                <v-icon>show_chart</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-layout>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex xs12 v-if="viewType==1">
      <v-layout row wrap>
        <v-flex xs12 md6 left-half-row-widget>
          <trend-multiline left-half-row-widget feedbackCategory="problem_report" :topic="topic" />
        </v-flex>
        <v-flex xs12 md6>
          <trend-multiline feedbackCategory="inquiry" :topic="topic" />
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 v-else>
      <competitor-table />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "CompetitorSideBySideComparison",
  components: {
    "trend-multiline": () => import("./../line/TrendMultiline"),
    "competitor-table": () =>
      import("./../table/CompetitorTwoCategoryComparison")
  },
  props: {
    topic: {
      type: String,
      default: "",
      required: false
    }
  },
  data() {
    return {
      viewType: "table",
      title: "Overall"
    };
  },
  methods: {
    getTitle() {
      if (this.topic === "") {
        return "overall";
      } else {
        return this.topic;
      }
    }
  }
};
</script>

<style scoped>
.header {
  background-color: rgba(0, 189, 187, 0.35);
}
.title {
  padding-left: 20px;
}
.icon-spacer {
  padding: 3px;
}
</style>
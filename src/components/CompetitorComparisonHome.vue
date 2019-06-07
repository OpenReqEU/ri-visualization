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
        <v-card>
          <v-data-table v-if="dataUpToDate" :headers="headersTop" :items="data" hide-actions>
            <template slot="headerCell" slot-scope="props">
              <div slot="activator" class="headline black--text">{{ props.header.text }}</div>
            </template>
            <template slot="items" slot-scope="props">
              <td>
                <v-data-table
                  :headers="tableHeadersProblemReports"
                  :items="props.item.problem_reports"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">
                      <b>{{ props.item.account }}</b>
                    </td>
                    <td class="text-xs-right">{{ props.item.yesterday }}</td>
                    <td class="text-xs-right">{{ props.item.week }}</td>
                    <td class="text-xs-right">{{ props.item.month }}</td>
                  </template>
                </v-data-table>
              </td>
              <td>
                <v-data-table
                  :headers="tableHeadersInquiries"
                  :items="props.item.inquiries"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">
                      <b>{{ props.item.account }}</b>
                    </td>
                    <td class="text-xs-right">{{ props.item.yesterday }}</td>
                    <td class="text-xs-right">{{ props.item.week }}</td>
                    <td class="text-xs-right">{{ props.item.month }}</td>
                  </template>
                </v-data-table>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
import "moment/locale/de";
import {
  POST_TWEET_LABEL_ENDPOINT,
  POST_TWEET_LABEL_PAYLOAD,
  POST_TWEET_LABEL_BACKUP_ENDPOINT,
  POST_TWEET_LABEL_BACKUP_PAYLOAD
} from "./../RESTconf.js";
import {
  ACTION_SET_TOOLBAR_HEADER,
  ACTION_UPDATE_TWEET
} from "./../store/types.js";
import FilterToolBar from "./toolbar/FilterToolBar";
import SentimentPerformanceMultiline from "./widget/line/SentimentPerformanceMultiline";
import ClassFrequencyDistributionMultibar from "./widget/bar/ClassFrequencyDistributionMultibar";
import { ITEM_STYLE_BAR_BLUE } from "../colors";

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
    ClassFrequencyDistributionMultibar
  },
  data() {
    return {
      headersTop: [
        {
          text: "Problem Reports (since)",
          value: "problem_reports",
          sortable: false
        },
        {
          text: "Inquiries (since)",
          value: "inquiries",
          sortable: false
        }
      ],
      tableHeadersProblemReports: [
        {
          text: "Account",
          align: "left",
          sortable: true,
          value: "account"
        },
        {
          text: "Yesterday",
          align: "center",
          sortable: true,
          value: "problem_report_yesterday"
        },
        {
          text: "Last Week",
          align: "center",
          sortable: true,
          value: "problem_report_week"
        },
        {
          text: "Last Month",
          align: "center",
          sortable: true,
          value: "problem_report_month"
        }
      ],
      tableHeadersInquiries: [
        {
          text: "Account",
          align: "left",
          sortable: true,
          value: "account"
        },
        {
          text: "Yesterday",
          align: "center",
          sortable: true,
          value: "inquiries_yesterday"
        },
        {
          text: "Last Week",
          align: "center",
          sortable: true,
          value: "inquiries_week"
        },
        {
          text: "Last Month",
          align: "center",
          sortable: true,
          value: "inquiries_month"
        }
      ],
      erros: [],
      tooblarTitle: "Competitor Comparison",
      data: [],
      dataProblemReports: [],
      dataInquiries: [],
      dataTopics: {},
      backgroundColor: ITEM_STYLE_BAR_BLUE,
      topics: this.$store.getters.accessKeyConfiguration.topics,
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
    };
  },
  methods: {
    setup(tweets) {
      this.data = [];

      this.dataProblemReports = [];
      this.dataInquiries = [];
      this.dataTopics = {};
      // set top level keys
      this.topics.forEach(topic => {
        this.dataTopics[topic] = {};
      });
      let accounts = new Set();
      tweets.forEach(tweet => {
        accounts.add(tweet.in_reply_to_screen_name);
      });

      let tmpData = [];
      // create sub objects for each account and init values
      Array.from(accounts).forEach(account => {
        // add companies to the problem report data
        tmpData.push({
          [ACCOUNT]: account,
          [PROBLEM_REPORTS]: {
            [TOTAL]: 0,
            [YESTERDAY]: 0,
            [WEEK]: 0,
            [MONTH]: 0
          },
          [INQUIRIES]: {
            [TOTAL]: 0,
            [YESTERDAY]: 0,
            [WEEK]: 0,
            [MONTH]: 0
          }
        });

        // add companies to the topic based data
        for (var topic in this.dataTopics) {
          this.dataTopics[topic] = this.twitterAccounts;
        }
      });

      return tmpData;
    },
    loadData(tweets) {
      let tmpData = this.setup(tweets);
      tweets.forEach(tweet => {
        if (tweet.tweet_class === "problem_report") {
          this.addToData(tmpData, PROBLEM_REPORTS, tweet);
        } else if (tweet.tweet_class === "inquiry") {
          this.addToData(tmpData, INQUIRIES, tweet);
        }
      });
      this.calculateTrends(tmpData, PROBLEM_REPORTS);
      this.calculateTrends(tmpData, INQUIRIES);
      this.prepareDataObject(tmpData);
    },
    addToData(source, target, tweet) {
      var account = tweet.in_reply_to_screen_name;
      for (let i of source.keys()) {
        if (source[i][ACCOUNT] == account) {
          source[i][target][TOTAL] += 1;

          if (tweet.created_at <= this.dateYesterday) {
            source[i][target][YESTERDAY] += 1;
          }
          if (tweet.created_at <= this.dateLastWeek) {
            source[i][target][WEEK] += 1;
          }
          if (tweet.created_at <= this.dateLastMonth) {
            source[i][target][MONTH] += 1;
          }
        }
      }
    },
    calculateTrends(source, target) {
      for (let i of source.keys()) {
        source[i][target][YESTERDAY] =
          source[i][target][TOTAL] - source[i][target][YESTERDAY];
        source[i][target][WEEK] =
          source[i][target][TOTAL] - source[i][target][WEEK];
        source[i][target][MONTH] =
          source[i][target][TOTAL] - source[i][target][MONTH];
      }
    },
    flattenDataObject() {
      let flattenedDataArr = [];
      for (let i of this.data.keys()) {
        let flattenedData = {
          account: this.data[i][ACCOUNT],
          total_prob: this.data[i][PROBLEM_REPORTS][TOTAL],
          yesterday_prob: this.data[i][PROBLEM_REPORTS][YESTERDAY],
          week_prob: this.data[i][PROBLEM_REPORTS][WEEK],
          month_prob: this.data[i][PROBLEM_REPORTS][MONTH],
          total_inq: this.data[i][INQUIRIES][TOTAL],
          yesterday_inq: this.data[i][INQUIRIES][YESTERDAY],
          week_inq: this.data[i][INQUIRIES][WEEK],
          month_inq: this.data[i][INQUIRIES][MONTH]
        };
        flattenedDataArr.push(flattenedData);
      }
      this.data = flattenedDataArr;
    },
    prepareDataObject(tmpData) {
      let problemReportsData = [];
      let inquiriesData = [];
      for (let i of tmpData.keys()) {
        problemReportsData.push({
          account: tmpData[i][ACCOUNT],
          total: tmpData[i][PROBLEM_REPORTS][TOTAL],
          yesterday: tmpData[i][PROBLEM_REPORTS][YESTERDAY],
          week: tmpData[i][PROBLEM_REPORTS][WEEK],
          month: tmpData[i][PROBLEM_REPORTS][MONTH]
        });
        inquiriesData.push({
          account: tmpData[i][ACCOUNT],
          total: tmpData[i][INQUIRIES][TOTAL],
          yesterday: tmpData[i][INQUIRIES][YESTERDAY],
          week: tmpData[i][INQUIRIES][WEEK],
          month: tmpData[i][INQUIRIES][MONTH]
        });
      }
      let preparedData = [];
      preparedData[0] = { [PROBLEM_REPORTS]: problemReportsData };
      preparedData[1] = { [INQUIRIES]: inquiriesData };
      // this.data = preparedData;
      this.data = [
        {
          [PROBLEM_REPORTS]: problemReportsData,
          [INQUIRIES]: inquiriesData
        }
      ];
    }
  },
  mounted() {
    this.loadData(this.$store.getters.filteredTweets);
    this.$store.dispatch(ACTION_SET_TOOLBAR_HEADER, this.tooblarTitle);
  },
  computed: {
    dataUpToDate() {
      if (this.$store.getters.dataUpToDate) {
        this.loadData(this.$store.getters.filteredTweets);
      }
      return this.$store.getters.dataUpToDate;
    }
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
.column-colored {
  background-color: rgba(0, 189, 187, 0.35);
}
</style>
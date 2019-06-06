<template>
  <v-container>
    <v-layout row>
      <filter-tool-bar/>
    </v-layout>
    <v-spacer/>
    <v-layout row wrap>
      <v-flex xs12 class="row">
        <v-card>
          <v-card-title class="headline mb-1">Problem Reports</v-card-title>
          <v-data-table
            v-if="dataUpToDate"
            :headers="tableHeaders"
            :items="dataProblemReports"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">{{ props.item.account }}</td>
                <td class="text-xs-right">{{ props.item.total }}</td>
                <td class="text-xs-right">{{ props.item.yesterday }}</td>
                <td class="text-xs-right">{{ props.item.week }}</td>
                <td class="text-xs-right">{{ props.item.month }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-spacer/>
      <v-flex xs12 class="row">
        <v-card>
          <v-card-title class="headline mb-1">Inquiries</v-card-title>
          <v-data-table
            v-if="dataUpToDate"
            :headers="tableHeaders"
            :items="dataInquiries"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">{{ props.item.account }}</td>
                <td class="text-xs-right">{{ props.item.total }}</td>
                <td class="text-xs-right">{{ props.item.yesterday }}</td>
                <td class="text-xs-right">{{ props.item.week }}</td>
                <td class="text-xs-right">{{ props.item.month }}</td>
              </tr>
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

const ACCOUNT = "account";
const TOTAL = "total";
const YESTERDAY = "yesterday";
const WEEK = "week";
const MONTH = "month";

export default {
  components: {
    "filter-tool-bar": FilterToolBar
  },
  data() {
    return {
      tableHeaders: [
        {
          text: "Account",
          align: "left",
          sortable: true,
          value: "account"
        },
        {
          text: "Total",
          align: "center",
          sortable: true,
          value: "total"
        },
        {
          text: "Since Yesterday",
          align: "center",
          sortable: true,
          value: "yesterday"
        },
        {
          text: "Since Last Week",
          align: "center",
          sortable: true,
          value: "week"
        },
        {
          text: "Since Last Month",
          align: "center",
          sortable: true,
          value: "month"
        }
      ],
      erros: [],
      tooblarTitle: "Competitor Comparison",
      dataProblemReports: [],
      dataInquiries: [],
      dataTopics: {},
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
      (this.dataProblemReports = []),
        (this.dataInquiries = []),
        (this.dataTopics = {}),
        // set top level keys
        this.topics.forEach(topic => {
          this.dataTopics[topic] = {};
        });
      let accounts = new Set();
      tweets.forEach(tweet => {
        accounts.add(tweet.in_reply_to_screen_name);
      });
      // create sub objects for each account and init values
      Array.from(accounts).forEach(account => {
        // add companies to the problem report data
        this.dataProblemReports.push({
          [ACCOUNT]: account,
          [TOTAL]: 0,
          [YESTERDAY]: 0,
          [WEEK]: 0,
          [MONTH]: 0
        });

        // add companies to the inquiry data
        this.dataInquiries.push({
          [ACCOUNT]: account,
          [TOTAL]: 0,
          [YESTERDAY]: 0,
          [WEEK]: 0,
          [MONTH]: 0
        });

        // add companies to the topic based data
        for (var topic in this.dataTopics) {
          this.dataTopics[topic] = this.twitterAccounts;
        }
      });
    },
    loadData(tweets) {
      this.setup(tweets);
      tweets.forEach(tweet => {
        if (tweet.tweet_class === "problem_report") {
          this.addToData(this.dataProblemReports, tweet);
        } else if (tweet.tweet_class === "inquiry") {
          this.addToData(this.dataInquiries, tweet);
        }
      });
      this.calculateTrends(this.dataProblemReports);
      this.calculateTrends(this.dataInquiries);
    },
    addToData(source, tweet) {
      var account = tweet.in_reply_to_screen_name;
      for (let i of source.keys()) {
        if (source[i][ACCOUNT] == account) {
          source[i][TOTAL] += 1;

          if (tweet.created_at <= this.dateYesterday) {
            source[i][YESTERDAY] += 1;
          }
          if (tweet.created_at <= this.dateLastWeek) {
            source[i][WEEK] += 1;
          }
          if (tweet.created_at <= this.dateLastMonth) {
            source[i][MONTH] += 1;
          }
        }
      }
    },
    calculateTrends(source) {
      for (let i of source.keys()) {
        source[i][YESTERDAY] = source[i][TOTAL] - source[i][YESTERDAY];
        source[i][WEEK] = source[i][TOTAL] - source[i][WEEK];
        source[i][MONTH] = source[i][TOTAL] - source[i][MONTH];
      }
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
  margin-bottom: 20px;
}
</style>
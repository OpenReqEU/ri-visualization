<template>
  <v-container>
    <v-layout row>
      <filter-tool-bar/>
    </v-layout>
    <v-card>
      <v-layout row full-row-widget align-center>
        <v-flex xs2 justify-center>
          <div>Problem problemReports</div>
        </v-flex>
        <v-flex xs9 offset-xs1>
          <v-data-table
            v-if="dataUpToDate"
            :headers="tableHeaders"
            :items="dataProblemReports"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item }}</td>
                <td>{{ }}</td>
                <td>{{ }}</td>
                <td>{{ }}</td>
                <td>{{ }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card>
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
export default {
  components: {
    FilterToolBar
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
          align: "right",
          sortable: true,
          value: "total"
        },
        {
          text: "Since Yesterday",
          align: "right",
          sortable: true,
          value: "classifier_certainty"
        },
        {
          text: "Since Last Week",
          align: "right",
          sortable: true,
          value: "classifier_certainty"
        },
        {
          text: "Since Last Month",
          align: "right",
          sortable: true,
          value: "classifier_certainty"
        }
      ],
      erros: [],
      tooblarTitle: "Competitor Comparison",
      dataProblemReports: [],
      dataInquiries: [],
      dataTopics: {}
    };
  },
  methods: {
    setup() {
      // set top level keys
      const topics = this.$store.getters.accessKeyConfiguration.topics;
      topics.forEach(topic => {
        this.dataTopics[topic] = {};
      });
      console.log(this.dataTopics);

      // create sub-maps for each account
      const twitterAccounts = this.$store.getters
        .accessKeyConfigurationTwitterAccounts;
      twitterAccounts.forEach(account => {
        // add companies to the problem report data
        this.dataProblemReports = twitterAccounts;

        // add companies to the inquiry data
        this.dataInquiries = twitterAccounts;

        // add companies to the topic based data
        for (var topic in this.dataTopics) {
          this.dataTopics[topic] = twitterAccounts;
        }
      });
      console.log(this.dataTopics);
    },
    loadData(tweets) {
      // this.data = [];
    }
  },
  mounted() {
    this.setup();
    this.loadData(this.$store.state.filteredTweets);
    this.$store.dispatch(ACTION_SET_TOOLBAR_HEADER, this.tooblarTitle);
  },
  computed: {
    dataUpToDate() {
      if (this.$store.state.dataUpToDate) {
        this.loadData(this.$store.state.filteredTweets);
      }
      return this.$store.state.dataUpToDate;
    }
  }
};
</script>

<style scoped>
.header {
  margin-top: 20px;
}
.card-title-text {
  font-size: 2em;
  text-align: center;
}
table.v-table tbody tr,
table.v-table tbody td,
table.v-table tbody th {
  min-height: 50px;
  height: 50px;
  max-height: 50px;
}
.row-item {
  margin: 15px 10px 15px 10px;
}
.row-header {
  margin: 15px 10px 35px 10px;
  position: "fixed";
}
.action-left {
  margin-right: 5px;
}
.action-right {
  margin-left: 5px;
}
h1 {
  text-align: center;
}
.list-enter,
.list-leave-to {
  transition: all 0.5s;
  opacity: 0;
}
.backgroundcolor-red {
  background-color: rgba(255, 0, 0, 0.04);
}
.backgroundcolor-yellow {
  background-color: rgba(255, 249, 196, 0.5);
}
.backgroundcolor-grey {
  background-color: rgba(238, 238, 238, 0.04);
}
.spacing {
  padding-top: 0px;
}
.pointer {
  cursor: pointer;
}
.toggle-effect {
  background-color: #bdbdbd !important;
}
.anti-margin {
  margin-bottom: 0px !important;
}
</style>
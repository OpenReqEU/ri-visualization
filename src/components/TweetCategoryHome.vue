<template>
  <v-container>
    <v-layout row>
      <filter-tool-bar/>
    </v-layout>
    <v-card flat class="header">
      <v-card-title>
        <h1>{{ cardTableTitle }}</h1>
        <v-spacer/>
        <v-text-field
          v-model="searchQuery"
          append-icon="search"
          label="search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
    </v-card>
    <v-data-table 
      v-if="dataUpToDate"
      :headers="tableHeaders" 
      :items="data" 
      :search="searchQuery" 
      :pagination.sync="pagination" >
      <template slot="items" slot-scope="props">
        <tr>
          <td style="text-align:'center'">{{ getFormattedDate(props.item.created_at) }}</td>
          <td class="issue-title-value">{{ props.item.text }}</td>
          <td class="issue-action">
            <v-layout
              row
              v-if="(props.item.classifier_certainty < 70) || props.item.classifier_certainty === undefined"
            >
              <v-layout row v-if="props.item.label_status!=='wrong'">
                <v-layout>
                  <v-btn
                    small
                    outline
                    block
                    color="success"
                    class="action-left"
                    @click="labelTweetAs({
                      origin: tweetCategory, 
                      index: props.index, 
                      label: tweetCategory,
                      tweet: props.item
                  })"
                  >
                    <v-icon>done</v-icon>
                  </v-btn>
                  <v-btn
                    small
                    outline
                    block
                    color="error"
                    class="action-right"
                    @click="wrongLabel(props.index, props.item.status_id)"
                  >
                    <v-icon>clear</v-icon>
                  </v-btn>
                </v-layout>
              </v-layout>
              <v-layout row v-else>
                <v-layout>
                  <v-btn
                    small
                    outline
                    block
                    color="error"
                    class="action-left"
                    @click="labelTweetAs({
                      origin: tweetCategory, 
                      index: props.index, 
                      label: tweetCategory==='problem_report' ? 'inquiry' : 'problem_report',
                      tweet: props.item
                  })"
                  >inquiry</v-btn>
                  <v-btn
                    small
                    outline
                    block
                    color="error"
                    class="action-left"
                    @click="labelTweetAs({
                      origin: tweetCategory, 
                      index: props.index, 
                      label: 'irrelevant',
                      tweet: props.item
                  })"
                  >irrelevant</v-btn>
                </v-layout>
              </v-layout>
            </v-layout>
          </td>
        </tr>
      </template>
    </v-data-table>
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
      key: this.$route.path,
      tweetCategory: "",
      pagination: {
        sortBy: "created_at",
        descending: true
      },
      tableHeaders: [
        {
          text: "Date",
          align: "center",
          sortable: true,
          value: "created_at",
          width: "10%"
        },
        {
          text: "Tweet",
          align: "left",
          sortable: true,
          value: "text",
          width: "80%"
        },
        {
          text: "Action",
          align: "center",
          sortable: false,
          value: "text",
          width: "10%"
        }
      ],
      erros: [],
      tooblarTitle: "",
      cardTableTitle: "",
      data: [],
      searchQuery: ""
    };
  },
  methods: {
    setup() {
      let currentPath = this.$route.path;
      if (currentPath === "/problemReports") {
        this.tooblarTitle = "Problem Reports";
        this.cardTableTitle = "Problem Reports";
        this.tweetCategory = "problem_report";
      } else if (currentPath === "/inquiries") {
        this.tooblarTitle = "inquiries";
        this.cardTableTitle = "Inquiries";
        this.tweetCategory = "inquiry";
      }
    },
    loadData(tweets, tweetCategory) {
      //Sorted by creation date
      tweets = tweets.sort((val1, val2) => {
        return val1.created_at - val2.created_at;
      });
      this.data = [];

      tweets.forEach(tweet => {
        if (tweet.tweet_class === tweetCategory) {
          this.data.push(tweet);
        }
      });
      
      // Update UI
      this.data.splice(0, 0);
    },
    getFormattedDate(date) {
      return moment(date, "YYYYMMDD").format("DD.MM.YYYY");
    },
    labelTweetAs(labelObject) {
      let payload = {
        status_id: labelObject.tweet.status_id,
        label: labelObject.label,
        text: labelObject.tweet.text,
        date: moment().format("YYYYMMDD"),
        previous_label: this.tweetCategory
      };
      axios
        .post(POST_TWEET_LABEL_ENDPOINT(), POST_TWEET_LABEL_PAYLOAD(payload))
        .then()
        .catch(e => {
          this.errors.push(e);
        });

      // send the label to the backupserver if configured.
      if (POST_TWEET_LABEL_BACKUP_ENDPOINT() != null) {
        axios
          .post(
            POST_TWEET_LABEL_BACKUP_ENDPOINT(),
            POST_TWEET_LABEL_BACKUP_PAYLOAD(payload)
          )
          .then()
          .catch(e => {
            this.errors.push(e);
          });
      }

      // remove the label option for the labeled tweet and update the UI
      labelObject.tweet.classifier_certainty = 100;
      this.$store.dispatch(ACTION_UPDATE_TWEET, labelObject.tweet);

      // Update UI
      this.data.splice(0, 0);
    },
    wrongLabel(index, statusID) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].status_id === statusID) {
          this.data[i].label_status = "wrong";
          break;
        }
      }

      // Update UI
      this.data.splice(0, 0);
    }
  },
  mounted() {
    this.setup();
    this.loadData(this.$store.state.filteredTweets, this.tweetCategory);
    this.$store.dispatch(ACTION_SET_TOOLBAR_HEADER, this.tooblarTitle);
  },
  computed: {
    dataUpToDate() {
      if (this.$store.state.dataUpToDate) {
        this.loadData(this.$store.state.filteredTweets, this.tweetCategory);
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
</style>

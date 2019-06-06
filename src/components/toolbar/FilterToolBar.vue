<template>
  <v-toolbar :color="color" height="75">
    <v-layout row wrap>
      <v-flex xs5>
        <v-select
          :menu-props="{maxWidth:'300'}"
          v-model="selectedTwitterAccounts"
          :items="twitterAccounts"
          label="Twitter Accounts"
          multiple
        >
          <template v-slot:prepend-item>
            <v-list-tile ripple @click="toggle">
              <v-list-tile-action>
                <v-icon
                  :color="selectedTwitterAccounts.length > 0 ? 'indigo darken-4' : ''"
                >{{ icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Select All</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider class="mt-2"></v-divider>
          </template>
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index <= 2" small color="black" outline>
              <span>{{ item }}</span>
            </v-chip>
            <span
              v-if="index === 3"
              class="black--text caption"
            >(+{{ selectedTwitterAccounts.length - 3 }} others)</span>
          </template>
        </v-select>
      </v-flex>

      <v-flex xs3 offset-xs1>
        <v-menu
          v-if="showDateFilter()"
          :close-on-content-click="false"
          v-model="modelFromDateMenu"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            class="date-text"
            slot="activator"
            v-model="modelFromDateText"
            value="modelFromDateText"
            label="From:"
            persistent-hint
            prepend-icon="event"
            readonly
            clearable
            @input="clearDateFrom"
          ></v-text-field>
          <v-date-picker
            v-model="dateFrom"
            no-title
            @input="modelFromDateMenu = false"
            @change="filterTweets"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <!-- <v-spacer></!-->

      <v-flex xs3>
        <v-menu
          v-if="showDateFilter()"
          :close-on-content-click="false"
          v-model="modelToDateMenu"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="modelToDateText"
            label="To:"
            persistent-hint
            prepend-icon="event"
            readonly
            clearable
            @input="clearDateTo"
          ></v-text-field>
          <v-date-picker
            v-model="dateTo"
            no-title
            @input="modelToDateMenu = false"
            @change="filterTweets"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
  </v-toolbar>
</template>

<script>
import VContent from "vuetify/lib/components/VGrid/VContent";
import TopToolBar from "./TopToolBar";
import { ACTION_FILTER_TWEETS } from "./../../store/types";
import { BLUE_FILL } from "../../colors.js";
import moment from "moment";
import "moment/locale/de";
import {
  ROUTE_DASHBOARD,
  ROUTE_PROBLEM_REPORTS,
  ROUTE_INQUIRIES,
  ROUTE_COMPARISON
} from "../../routes.js";

export default {
  name: "FilterToolBar",
  components: {
    TopToolBar,
    VContent
  },
  data: function() {
    return {
      modelFromDateMenu: false,
      modelToDateMenu: false,
      twitterAccounts: [],
      selectedTwitterAccounts: [],
      dateFrom: null,
      dateTo: null,
      color: BLUE_FILL
    };
  },
  methods: {
    showAccountFilter() {
      let path = this.$router.currentRoute.path;
      return (
        path === ROUTE_DASHBOARD ||
        path === ROUTE_PROBLEM_REPORTS ||
        path === ROUTE_INQUIRIES
      );
    },
    showDateFilter() {
      let path = this.$router.currentRoute.path;
      return (
        path === ROUTE_COMPARISON ||
        path === ROUTE_PROBLEM_REPORTS ||
        path === ROUTE_INQUIRIES
      );
    },
    clearDateFrom() {
      this.dateFrom = null;
      this.filterTweets();
    },
    clearDateTo() {
      this.dateTo = null;
      this.filterTweets();
    },
    formatDate(date) {
      return moment(date, "YYYY-MM-DD").format("DD.MM.YYYY");
    },
    filterTweets() {
      let payload = {
        twitterAccounts: this.selectedTwitterAccounts,
        fromDate: this.dateFrom ? this.dateFrom.toString() : null,
        toDate: this.dateTo ? this.dateTo.toString() : null
      };
      this.$store.dispatch(ACTION_FILTER_TWEETS, payload);
    },
    loadAccountNames() {
      let storeTwitterAccounts = this.$store.getters
        .accessKeyConfigurationTwitterAccounts;
      storeTwitterAccounts.forEach(twitterAccount => {
        if (twitterAccount in this.$store.getters.tweets) {
          this.twitterAccounts.push(twitterAccount);
        }
      });
    },
    toggle() {
      this.$nextTick(() => {
        if (this.selectedAll) {
          this.selectedTwitterAccounts = [];
        } else {
          this.selectedTwitterAccounts = this.twitterAccounts.slice();
        }
      });
    }
  },
  computed: {
    selectedAll() {
      return (
        this.selectedTwitterAccounts.length === this.twitterAccounts.length
      );
    },
    selectedSome() {
      return this.selectedTwitterAccounts.length > 0 && !this.selectedAll;
    },
    icon() {
      if (this.selectedAll) {
        return "check_box";
      }
      if (this.selectedSome) {
        return "indeterminate_check_box";
      }
      return "check_box_outline_blank";
    },
    modelFromDateText: {
      get: function() {
        return this.dateFrom ? this.formatDate(this.dateFrom) : "";
      },
      set: function(val) {
        return (this.dateFrom = val);
      }
    },
    modelToDateText: {
      get: function() {
        return this.dateTo ? this.formatDate(this.dateTo) : "";
      },
      set: function(val) {
        return (this.dateTo = val);
      }
    }
  },
  mounted() {
    this.loadAccountNames();
    this.selectedTwitterAccounts = this.twitterAccounts;
    this.filterTweets();
  },
  watch: {
    selectedTwitterAccounts() {
      this.filterTweets();
    }
  }
};
</script>

<style lang="scss" scoped>
.daterange-picker {
  .calendar-holder {
    position: absolute;
  }
}

.account-select {
  max-width: 33%;
  min-width: 33%;
}

.text-size {
  font-size: 1.4em;
}
</style>

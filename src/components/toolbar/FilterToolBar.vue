<template>
  <v-toolbar :color="color" height="75">
    <v-spacer v-if="showFullToolbar()"></v-spacer>

    <v-select
      class="account-select text-size"
      :items="twitterAccounts"
      v-model="selectedTwitterAccount"
      label="Twitter Account"
    ></v-select>

    <v-spacer></v-spacer>

    <v-menu
      v-if="showFullToolbar()"
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

    <v-spacer></v-spacer>

    <v-menu
      v-if="showFullToolbar()"
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
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
import VContent from "vuetify/lib/components/VGrid/VContent";
import TopToolBar from "./TopToolBar";
import { ACTION_FILTER_TWEETS } from "./../../store/types";
import { BLUE_FILL } from "../../colors.js";
import moment from "moment";
import "moment/locale/de";

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
      twitterAccounts: ["All"],
      selectedTwitterAccount: "All",
      dateFrom: null,
      dateTo: null,
      color: BLUE_FILL
    };
  },
  computed: {
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
  methods: {
    showFullToolbar() {
      let path = this.$router.currentRoute.path;
      return (
        path === "/comparison" ||
        path === "/problemReports" ||
        path === "/inquiries"
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
        twitterAccount: this.selectedTwitterAccount,
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
    }
  },
  mounted() {
    this.loadAccountNames();
    this.filterTweets();
  },
  watch: {
    selectedTwitterAccount() {
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

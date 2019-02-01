<template>
  <v-toolbar :color="color" height="75">
    <v-spacer v-if="showFullToolbar()"></v-spacer>

    <v-select
      class="account-select text-size"
      :items="twitterAccounts"
      v-model="selectedTwitterAccount"
      @change="filterTweets"
      label="Twitter Account"
    ></v-select>

    <v-spacer></v-spacer>

    <v-menu
      v-if="showFullToolbar()"
      :close-on-content-click="false"
      v-model="menu1"
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
        v-model="computedDateFromFormatted"
        label="From:"
        persistent-hint
        prepend-icon="event"
        readonly
        clearable
        @input="clearDateFrom"
      ></v-text-field>
      <v-date-picker v-model="dateFrom" no-title @input="menu1 = false" @change="filterTweets"></v-date-picker>
    </v-menu>

    <v-spacer></v-spacer>

    <v-menu
      v-if="showFullToolbar()"
      :close-on-content-click="false"
      v-model="menu2"
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
        v-model="computedDateToFormatted"
        label="To:"
        persistent-hint
        prepend-icon="event"
        readonly
        clearable
        @input="clearDateTo"
      ></v-text-field>
      <v-date-picker v-model="dateTo" no-title @input="menu2 = false" @change="filterTweets"></v-date-picker>
    </v-menu>

    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
import VContent from "vuetify/lib/components/VGrid/VContent";
import TopToolBar from "./TopToolBar";
import { ACTION_FILTER_TWEETS } from "./../../store/types";
import { BLUE_FILL } from "../../colors.js";

export default {
  name: "FilterToolBar",
  components: {
    TopToolBar,
    VContent
  },
  data: function() {
    return {
      // TODO: Switch to momentjs
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
      twitterAccounts: ["All"],
      selectedTwitterAccount: "All",
      dateFrom: null, //new Date().toISOString().substr(0, 10),
      dateFromFormatted: this.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      dateTo: null, //new Date().toISOString().substr(0, 10),
      dateToFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      color: BLUE_FILL
    };
  },
  computed: {
    computedDateFromFormatted: {
      get: function() {
        return this.dateFrom ? this.formatDate(this.dateFrom) : "";
      },
      set: function(newValue) {
        this.dateFromFormatted = newValue;
      }
    },
    computedDateToFormatted: {
      get: function() {
        return this.dateTo ? this.formatDate(this.dateTo) : "";
      },
      set: function(newValue) {
        this.dateToFormatted = newValue;
      }
    }
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    dateFrom(val) {
      this.dateFromFormatted = this.formatDate(val);
    },
    dateTo(val) {
      this.dateToFormatted = this.formatDate(val);
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
    formatDateCompare(date) {
      if (!date) return null;
      return parseInt(
        date
          .toString()
          .split("-")
          .join("")
      );
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${year}-${month}-${day}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
      this.twitterAccounts = this.twitterAccounts.concat(
        this.$store.state.twitterAcconts
      );
    }
  },
  created() {
    this.loadAccountNames();
  },
  mounted() {
    this.filterTweets();
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

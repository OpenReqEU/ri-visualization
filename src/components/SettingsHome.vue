<template>
  <v-container>
    <v-card flat class="header">
      <v-card-title>
        <h1>Configure Twitter Accounts</h1>
      </v-card-title>
    </v-card>
    <v-card flat>
      <v-card-title>
        <v-text-field
          class="input-field"
          v-model="newTwitterAccount"
          label="Twitter Account"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
          small
          outline
          block
          color="primary"
          class="action-add"
          @click="addTwitterAccount({
              account_name: newTwitterAccount, 
              valid: false, 
              checking_validity: true,
          })"
        >add</v-btn>
      </v-card-title>
    </v-card>
    <v-data-table
      hide-actions
      :headers="tableHeaders"
      :items="twitterAccounts"
      :search="searchQuery"
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.account_name }}</td>
          <!-- :style="{backgroundColor: (props.item.valid ? 'rgba(144,238,144,0.2)' : 'transparent' )}" -->
          <td class="text-xs-center">
            <v-progress-circular v-if="props.item.checking_validity" indeterminate></v-progress-circular>
            <v-icon v-else-if="!props.item.checking_validity && props.item.valid">check</v-icon>
            <v-icon v-else>clear</v-icon>
          </td>
          <td class="text-xs-center">
            <v-btn small outline color="error" @click="removeTwitterAccount(props.item)">
              <!-- <v-icon>clear</v-icon> -->
              remove
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
import { GET_TWITTER_ACCOUNT_EXISTS_ENDPOINT } from "./../RESTconf.js";
export default {
  data() {
    return {
      tableHeaders: [
        {
          text: "Twitter Account",
          align: "left",
          sortable: true,
          value: "twitter_account",
          width: "90%"
        },
        {
          text: "Valid",
          align: "center",
          sortable: false,
          value: "twitter_account_valid",
          width: "5%"
        },
        {
          text: "Action",
          align: "center",
          sortable: false,
          value: "action",
          width: "5%"
        }
      ],
      twitterAccounts: [],
      searchQuery: "",
      newTwitterAccount: ""
    };
  },
  methods: {
    addTwitterAccount(twitterAccount) {
      // do not allow duplicates
      var twitterAccountAlreadyAdded =
        this.twitterAccounts.find(function(item) {
          return item.account_name == twitterAccount.account_name;
        }) != undefined;
      if (!twitterAccountAlreadyAdded) {
        this.twitterAccounts.push(twitterAccount);
        this.checkTwitterAccount(twitterAccount);
      }
    },
    removeTwitterAccount(twitterAccount) {
      this.twitterAccounts = this.twitterAccounts.filter(function(item) {
        return item != twitterAccount;
      });
      // send action to the store
    },
    updateTwitterAccounts(response, twitterAccount) {
      console.log("updateTwitterAccounts");
      for (let i = 0; i < this.twitterAccounts.length; i++) {
        if (
          this.twitterAccounts[i].account_name === twitterAccount.account_name
        ) {
          this.twitterAccounts[i].checking_validity = false;
          this.twitterAccounts[i].valid = response.account_exists;
          break;
        }
      }
    },
    async checkTwitterAccount(twitterAccount) {
      axios
        .get(GET_TWITTER_ACCOUNT_EXISTS_ENDPOINT(twitterAccount.account_name))
        .then(response => {
          console.log(response.data);
          this.updateTwitterAccounts(response.data, twitterAccount);
          // if valid send action to the store
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  },
  mounted() {}
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
.header {
  margin-top: 20px;
}
.input-field {
  /* min-width: 100px;
  width: 100px;
  max-width: 100px; */
  max-width: 20%;
}
.action-add {
  margin-left: 10px;
  max-width: 20px;
}
</style>

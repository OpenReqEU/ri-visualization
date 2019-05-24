<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-text-field
                v-model="accessKey"
                prepend-icon="lock"
                name="password"
                label="Access Key"
                type="password"
                :rules="accessKeyRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :color="color"
              class="white--text"
              :disabled="!valid"
              @click="sendCheckAccessKey()"
            >
              <v-spacer></v-spacer>
              <v-icon left dark>send</v-icon>Send
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="errorSnackbar" :timeout="errorSnackbarTimeout" :top="true">
          Access Key does not exist
          <v-btn color="pink" flat @click="errorSnackbar = false">Close</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  POST_RETRIEVE_ACCESS_KEY_CONFIGURATION,
  POST_RETRIEVE_ACCESS_KEY_CONFIGURATION_PAYLOAD
} from "./../RESTconf.js";
import { BLUE_FILL } from "../colors.js";
import {
  ACTION_FETCH_INITAL_DATA,
  MUTATE_LOGGED_IN,
  MUTATE_TWEETS,
  MUTATE_USER_CONFIGURATION
} from "../store/types.js";
export default {
  data() {
    return {
      color: BLUE_FILL,
      accessKey: "windtre_trial",
      accessKeyRules: [v => !!v || "required"],
      valid: false,
      /*
       * errors
       */
      errorSnackbar: false,
      errorSnackbarTimeout: 6000,
      errors: []
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.valid = true;
      }
    },
    sendCheckAccessKey() {
      axios
        .post(
          POST_RETRIEVE_ACCESS_KEY_CONFIGURATION(),
          POST_RETRIEVE_ACCESS_KEY_CONFIGURATION_PAYLOAD(this.accessKey)
        )
        .then(response => {
          if (response.status == 200) {
            console.log("response.data", response.data);
            this.$store.commit(MUTATE_TWEETS, response.data.twitter_accounts);
            this.$store.commit(MUTATE_USER_CONFIGURATION, response.data);
            this.$store
              .dispatch(
                ACTION_FETCH_INITAL_DATA,
                response.data.twitter_accounts
              )
              .then(
                response => {
                  this.$store.commit(MUTATE_LOGGED_IN, true);
                  this.$router.push({ path: "/dashboard" });
                },
                error => {
                  console.error(
                    "Got nothing from server. Prompt user to check internet connection and try again"
                  );
                }
              );
          } else {
            this.errorSnackbar = true;
            this.accessKey = "";
          }
        })
        .catch(e => {
          this.errorSnackbar = true;
          this.accessKey = "";
          this.errors.push(e);
        });
    }
  },
  mounted() {
    this.$store.dispatch(
      "setToolbarHeader",
      "Check Access and Load Configuration"
    );
  }
};
</script>

<style scoped>
</style>

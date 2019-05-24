<template>
  <v-app>
    <top-tool-bar @toggle-drawer="$refs.drawer.drawer = !$refs.drawer.drawer"></top-tool-bar>
    <top-navigation-drawer ref="drawer" v-show="$store.getters.loggedIn"></top-navigation-drawer>
    <v-content>
      <router-view :key="$route.path"></router-view>
    </v-content>
    <v-footer class="footer">
      &copy;{{new Date().getFullYear()}} — Christoph Stanik
      <strong>
        <a href="https://openreq.eu/">@OpenReq</a>
      </strong>
    </v-footer>
  </v-app>
</template>

<script>
import TopToolBar from "./components/toolbar/TopToolBar";
import TopNavigationDrawer from "./components/toolbar/TopNavigationDrawer";
import FilterToolBar from "./components/toolbar/FilterToolBar";
import { ACTION_FETCH_INITAL_DATA } from "./store/types.js";

export default {
  name: "App",
  components: {
    TopToolBar,
    TopNavigationDrawer,
    FilterToolBar
  },
  data() {
    return {};
  },
  created() {
    // this.$store.dispatch(ACTION_FETCH_INITAL_DATA);
  },
  computed: {
    initialDataLoaded() {
      // return this.$store.state.initialDataLoaded;
    }
  }
};
</script>

<style lang="scss">
.container {
  max-width: 1200px;
}
.full-row-widget {
  margin-top: 10px;
  padding-top: 5px;
}
.left-half-row-widget {
  padding-right: 10px;
}
.right-half-row-widget {
  padding-left: 10px;
}
.footer {
  padding-left: 5%;
}
</style
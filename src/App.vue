<template>
  <v-app>
    <top-tool-bar @toggle-drawer="$refs.drawer.drawer = !$refs.drawer.drawer"></top-tool-bar>
    <top-navigation-drawer ref="drawer" v-show="$store.getters.accessKey"></top-navigation-drawer>
    <v-content>
      <keep-alive>
        <router-view :key="$route.path"></router-view>
      </keep-alive>
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
export default {
  name: "App",
  components: {
    TopToolBar,
    TopNavigationDrawer
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
</style>
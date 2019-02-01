<template>
  <v-navigation-drawer app v-model="drawer" absolute temporary :style="style">
    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile
        v-for="item in items"
        :key="item.title"
        :to="item.path"
        active-class="active"
        :class="item.path === $route.path ? 'active' : ''"
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { WHITE } from "../../colors.js";
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          title: "Dashboard",
          icon: "dashboard",
          path: "/dashboard"
        },
        {
          title: "Problem Reports",
          icon: "error_outline",
          path: "/problemReports"
        },
        {
          title: "Inquiries",
          icon: "help_outline",
          path: "/inquiries"
        }
      ],
      style: {
        backgroundColor: WHITE,
        position: "fixed",
        top: 0,
        left: 0
      }
    };
  }
};
</script>

<style scoped>
.active {
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  /* color: rgba(255, 89, 0, 1); */
  background-color: rgba(0, 0, 0, 0.5);
}
</style>


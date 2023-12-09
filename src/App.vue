<template>
  <v-app>
    <v-main>
      <v-tabs v-model="tab" background-color="grey darken-4" centered dark icons-and-text>
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#tab-1" @click="navigateTo('/')">
          Libri
          <v-icon>mdi-bookshelf</v-icon>
        </v-tab>

        <v-tab href="#tab-2" @click="navigateTo('/authors')">
          Autori
          <v-icon>mdi-account-multiple</v-icon>
        </v-tab>
      </v-tabs>

      <v-card class="home my-5" elevation="4" shaped>
        <router-view />
      </v-card>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    tab: null,
  }),
  methods: {
    navigateTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    },
  },
};
</script>

<style>
#app {
  background-image: url(img/background.jpg);
  background-size: cover;
}

.home {
  max-width: 800px !important;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid black;
}
</style>
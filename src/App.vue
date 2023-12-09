<template>
  <v-app>
    <v-main>
      <v-tabs v-model="tab" background-color="grey darken-4" centered dark icons-and-text>
        <v-tab href="#tab-1" @click="navigateTo('/')">
          Libri
          <v-icon>mdi-bookshelf</v-icon>
        </v-tab>

        <v-tab href="#tab-2" @click="navigateTo('/authors')">
          Autori
          <v-icon>mdi-account-multiple</v-icon>
        </v-tab>
      </v-tabs>

      <div class="container">
        <router-view />
      </div>
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
    updateTab() {
      // Imposta il valore della tab sulla base della rotta corrente
      switch (this.$route.path) {
        case '/':
          this.tab = 'tab-1';
          break;
        case '/authors':
          this.tab = 'tab-2';
          break;
        default:
          this.tab = 'tab-1'
          break;
      }
    },
  },
  mounted() {
    this.updateTab();
  },
};
</script>

<style>
#app {
  background-image: url(img/background.jpg);
  background-size: cover;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
}
</style>
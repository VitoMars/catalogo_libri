<template>
  <v-app>
    <v-main style="margin: 2rem">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
#app {
  background-image: url(img/background.jpg);
  background-size: cover;
  background-position: center;
}
</style>
<template>
  <v-card class="home" elevation="4" shaped>
    <h1 class="text-center">Lista dei Libri</h1>
    <BookList />
  </v-card>
</template>

<script>

import BookList from "@/components/BookList.vue";

export default {
  name: 'HomeView',
  components: {
    BookList,
  },
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.home h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

.text-center {
  text-align: center;
}
</style>

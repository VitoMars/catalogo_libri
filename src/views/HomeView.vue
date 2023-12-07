<template>
  <div class="home">
    <h1>Lista dei Libri</h1>
    <BookList></BookList>
  </div>
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
</style>

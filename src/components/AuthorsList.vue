<template>
   <v-card elevation="4" class="rounded-xl pa-5">
      <h1 class="text-center">Lista autori</h1>

      <!-- Caricamento visivo per l'utente -->
      <v-progress-linear v-if="loading" indeterminate />

      <div v-for="author in authorsWithBooks" :key="author.id">
         <v-card class="my-5">
            <v-card-title>{{ author.name }}</v-card-title>
            <h4 class="mx-4">Libri pubblicati: </h4>
            <v-list>
               <v-list-item-group v-if="author.books.length > 0">
                  <v-list-item v-for="book in author.books" :key="book.id">
                     <v-list-item-content>
                        <v-list-item-title>{{ book.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ book.publish_year }}</v-list-item-subtitle>
                     </v-list-item-content>
                  </v-list-item>
               </v-list-item-group>
               <v-list-item v-else>
                  Nessun libro disponibile
               </v-list-item>
            </v-list>
         </v-card>
      </div>
   </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
   async created() {
      try {
         await this.$store.dispatch('loadBooks');
      } catch (error) {
         console.error('Errore durante il caricamento dei libri', error);
      }
   },
   computed: {
      ...mapGetters(['loading', 'authorsWithBooks']),
   },
};
</script>
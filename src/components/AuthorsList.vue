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
import api from '@/apis/api';

export default {
   data() {
      return {
         loading: false,
         authors: [],
         books: [],
         authorsWithBooks: [],

         // Esempio Struttura
         // authorsWithBooks: [
         //    {
         //       id: 1,
         //       name: "Autore 1",
         //       books: [
         //          { id: 1, title: "Libro 1", publish_year: "Anno 1" },
         //          { id: 2, title: "Libro 2", publish_year: "Anno 2" },
         //       ],
         //    },
         //    {
         //       id: 2,
         //       name: "Autore 2",
         //       books: [
         //          { id: 1, title: "Libro 1", publish_year: "Anno 1" },
         //          { id: 2, title: "Libro 2", publish_year: "Anno 2" },
         //       ],
         //    },
         // ],
      };
   },
   async created() {
      try {
         // Caricamento per l'utente
         this.loading = true;

         // Chiamata asincrona per ottenere i libri dall'API
         const { reading_log_entries } = await api.getBooks();

         // Trasformo i dati ottenuti dalla chiamata API in un formato migliore
         this.books = reading_log_entries.map((apiBook, index) => ({
            id: index,
            title: apiBook.work.title ?? 'Sconosciuto',
            author: apiBook.work.author_names[0] ?? 'Sconosciuto',
            publish_year: apiBook.work.first_publish_year ?? 'Sconosciuto',
            cover_url: apiBook.work.cover_id ? `https://covers.openlibrary.org/b/id/${apiBook.work.cover_id}-L.jpg` : null,
         }));

         this.books = this.books.filter(book => book.title !== 'Sconosciuto');

         console.log("Books:", this.books);

         // Creo una la lista degli autori dai libri
         this.authors = this.books.map(book => book.author);

         // Creo la struttura di authorsWithBooks
         this.authorsWithBooks = this.authors.map((author, index) => ({
            id: index,
            name: author,
            books: this.books.filter(book => book.author === author),
         }));

      } catch (error) {
         console.error('Errore durante il caricamento dei libri:', error);
      } finally {
         // Disabilito il caricamento per l'utente
         this.loading = false;
      }
   },
};
</script>
<template>
   <div>
      <v-list>
         <v-list-item-group v-if="books.length">
            <v-list-item v-for="book in books" :key="book.id">
               <v-list-item-content>
                  <v-list-item-title>{{ book.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ book.author }} - {{ book.publish_year }}</v-list-item-subtitle>
               </v-list-item-content>
            </v-list-item>
         </v-list-item-group>
         <v-alert v-else :value="true" type="info" icon="mdi-information" border="left" colored-border elevation="2">
            Nessun libro trovato.
         </v-alert>
      </v-list>
   </div>
</template>
 
<script>
import api from '@/apis/api.js'

export default {
   data() {
      return {
         books: [],

         // Example
         // books: [
         //    {
         //       id: 1,
         //       title: "Il Signore degli Anelli",
         //       author: "J.R.R. Tolkien",
         //       publish_year: "1999",
         //    },
         //    {
         //       id: 2,
         //       title: "1984",
         //       author: "George Orwell",
         //       publish_year: "1999",
         //    },
         // ]

      }
   },
   async created() {
      try {
         const { reading_log_entries } = await api.getBooks();

         this.books = reading_log_entries.map((apiBook, index) => ({
            id: index,
            title: apiBook.work.title ?? 'Sconosciuto',
            author: apiBook.work.author_names[0] ?? 'Sconosciuto',
            publish_year: apiBook.work.first_publish_year ?? 'Sconosciuto',
         }));

         console.log("Books:", this.books);
      } catch (error) {
         console.error('Errore durante il caricamento dei libri:', error);
      }
   },
};
</script>
 

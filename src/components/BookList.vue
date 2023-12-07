<template>
   <div>
      <!-- Caricamento visivo per l'utente -->
      <v-progress-linear v-if="loading" indeterminate />

      <!-- Modulo di inserimento -->
      <v-dialog v-model="addBookDialog" max-width="500">
         <v-card>
            <v-card-title>Aggiungi nuovo libro</v-card-title>
            <v-card-text>
               <v-form @submit.prevent="addBook">
                  <v-text-field v-model="newBook.title" label="Titolo" required></v-text-field>
                  <v-text-field v-model="newBook.author" label="Autore" required></v-text-field>
                  <v-text-field v-model="newBook.publish_year" label="Anno di pubblicazione"></v-text-field>
                  <v-btn type="submit" color="primary">Aggiungi libro</v-btn>
               </v-form>
            </v-card-text>
         </v-card>
      </v-dialog>

      <!-- Lista dei libri -->
      <v-list>
         <v-list-item-group v-if="books.length">
            <v-list-item v-for="book in books" :key="book.id">
               <v-list-item-content>
                  <v-list-item-title>{{ book.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ book.author }} - {{ book.publish_year }}</v-list-item-subtitle>
               </v-list-item-content>
            </v-list-item>
         </v-list-item-group>
         <v-alert v-else type="info" icon="mdi-information" class="my-3 mx-4" shaped>
            Nessun libro trovato.
         </v-alert>
      </v-list>

      <!-- Pulsante per aggiungere un libro -->
      <div class="d-flex justify-end mx-2">
         <v-btn @click="openAddBookDialog" fab color="primary">
            <v-icon>
               mdi-plus
            </v-icon>
         </v-btn>
      </div>

   </div>
</template>
 
<script>
import api from '@/apis/api.js'

export default {
   data() {
      return {
         loading: false,
         books: [],
         addBookDialog: false,
         newBook: {
            title: '',
            author: '',
            publish_year: '',
         },
      }
   },
   methods: {
      // Metodo per aprire il modulo di inserimento
      openAddBookDialog() {
         this.addBookDialog = true;
      },

      // Metodo per aggiungere un nuovo libro
      addBook() {
         this.books.push({
            id: this.books.length + 1,
            title: this.newBook.title,
            author: this.newBook.author,
            publish_year: this.newBook.publish_year,
         });

         this.addBookDialog = false;

         this.newBook = {
            title: '',
            author: '',
            publish_year: '',
         };
      },
   },
   async created() {
      try {
         this.loading = true;

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
      } finally {
         this.loading = false;
      }
   },
};
</script>
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
               <v-list-item-action>
                  <v-btn @click="openDeleteBookDialog(book)" icon>
                     <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
               </v-list-item-action>
            </v-list-item>
         </v-list-item-group>
         <v-alert v-else type="info" icon="mdi-information" class="my-3 mx-4" shaped>
            Nessun libro trovato.
         </v-alert>
      </v-list>

      <!-- Dialog di conferma eliminazione -->
      <v-dialog v-model="deleteBookDialog" max-width="400" persistent>
         <v-card class="px-1 pb-2">
            <v-card-title>Conferma eliminazione</v-card-title>
            <v-card-text>
               Sei sicuro di voler eliminare questo libro?
            </v-card-text>

            <v-card-actions class="d-flex justify-end">
               <v-btn @click="deleteBookDialog = false" color="primary" text>Annulla</v-btn>
               <v-btn @click="deleteBook" color="error">Elimina</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

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
         deleteBookDialog: false,
         newBook: {
            title: '',
            author: '',
            publish_year: '',
         },
         bookToDelete: null,
      }
   },
   methods: {
      // Metodo per aprire il modulo di inserimento
      openAddBookDialog() {
         this.addBookDialog = true;
      },
      // Metodo per aprire la dialog di conferma eliminazione
      openDeleteBookDialog(book) {
         this.bookToDelete = book;
         this.deleteBookDialog = true;
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
      // Metodo per confermare l'eliminazione del libro
      deleteBook() {
         if (this.bookToDelete) {
            const index = this.books.findIndex(book => book.id === this.bookToDelete.id);

            if (index !== -1) {
               this.books.splice(index, 1);
            }
         }

         this.deleteBookDialog = false;
         this.bookToDelete = null;
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
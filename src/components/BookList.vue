<template>
   <v-card elevation="4" class="rounded-xl pa-5">
      <h1 class="text-center">Lista libri</h1>

      <!-- Caricamento visivo per l'utente -->
      <v-progress-linear v-if="loading" indeterminate />

      <div v-else class="mx-4 mt-4">
         <!-- Campo per ricerca libro-->
         <v-text-field v-model="searchBook" label="Cerca libro" />

         <!-- Filtro per l'autore -->
         <v-select v-model="selectedAuthors" :items="authors" label="Filtro autori" multiple chips dense />

         <!-- Ordinamento -->
         <div class="grey--text text--darken-3">Ordina per</div>
         <div class="d-flex justify-space-between align-center flex-wrap">
            <v-radio-group v-model="sortCriteria" row>
               <v-radio label="Titolo" value="title" />
               <v-radio label="Anno di pubblicazione" value="publish_year" />
            </v-radio-group>
            <v-btn-toggle v-model="sortDirection">
               <v-btn small :value="'asc'">Asc</v-btn>
               <v-btn small :value="'desc'">Desc</v-btn>
            </v-btn-toggle>
         </div>
      </div>

      <!-- Lista dei libri -->
      <v-list>
         <v-list-item-group v-if="filteredBooks.length">
            <v-list-item v-for="book in filteredBooks" :key="book.id">
               <v-list-item-action class="d-none d-sm-flex">
                  <v-btn @click="openDetailBookDialog(book)" icon>
                     <v-icon color="green">mdi-information</v-icon>
                  </v-btn>
               </v-list-item-action>
               <v-list-item-content @click="openDetailBookDialog(book)">
                  <v-list-item-title>{{ book.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ book.author }} - {{ book.publish_year }}</v-list-item-subtitle>
               </v-list-item-content>
               <v-list-item-action class="mx-0 mx-sm-2">
                  <v-btn @click="openEditBookDialog(book)" icon>
                     <v-icon color="blue">mdi-pencil</v-icon>
                  </v-btn>
               </v-list-item-action>
               <v-list-item-action class="mx-0 mx-sm-2">
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

      <!-- Dialog per l'inserimento del libro -->
      <v-dialog v-model="addBookDialog" max-width="500">
         <v-card>
            <v-card-title>Aggiungi nuovo libro</v-card-title>
            <v-card-text>
               <v-form @submit.prevent="addBook" ref="addBookForm">
                  <v-text-field v-model="newBook.title" label="Titolo" :rules="[v => !!v || 'Il titolo è obbligatorio']" />
                  <v-text-field v-model="newBook.author" label="Autore"
                     :rules="[v => !!v || 'L\'autore è obbligatorio']" />
                  <v-text-field v-model="newBook.publish_year" label="Anno di pubblicazione" :rules="yearRules" />
                  <v-btn type="submit" color="primary">Aggiungi libro</v-btn>
               </v-form>
            </v-card-text>
         </v-card>
      </v-dialog>

      <!-- Dialog di modifica libro -->
      <v-dialog v-model="editBookDialog" max-width="500">
         <v-card>
            <v-card-title>Modifica libro</v-card-title>
            <v-card-text>
               <v-form @submit.prevent="editBook" ref="editBookForm">
                  <v-text-field v-model="bookToEdit.title" label="Titolo"
                     :rules="[v => !!v || 'Il titolo è obbligatorio']" />
                  <v-text-field v-model="bookToEdit.author" label="Autore"
                     :rules="[v => !!v || 'L\'autore è obbligatorio']" />
                  <v-text-field v-model="bookToEdit.publish_year" label="Anno di pubblicazione" :rules="yearRules" />
                  <v-btn type="submit" color="primary">Salva modifiche</v-btn>
               </v-form>
            </v-card-text>
         </v-card>
      </v-dialog>

      <!-- Dialog di eliminazione libro -->
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

      <!-- Dialog BookDetail come componente -->
      <BookDetail ref="bookDetail" :selectedBook="selectedBook" />

      <!-- Pulsante per aggiungere un libro -->
      <div class="d-flex justify-end mx-2">
         <v-btn @click="openAddBookDialog" fab color="primary">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
      </div>

   </v-card>
</template>
 
<script>
// import api from '@/apis/api.js'
import BookDetail from '@/components/BookDetail.vue';
import { mapGetters } from 'vuex';

export default {
   components: {
      BookDetail,
   },
   data() {
      return {
         // loading: false,
         // books: [],
         // authors: [],
         selectedBook: {},
         selectedAuthors: [],
         addBookDialog: false,
         editBookDialog: false,
         deleteBookDialog: false,
         newBook: {
            title: '',
            author: '',
            publish_year: '',
         },
         bookToEdit: {
            title: '',
            author: '',
            publish_year: '',
         },
         bookToDelete: null,
         sortCriteria: 'title',
         sortDirection: 'asc',
         searchBook: '',
         yearRules: [
            v => /^\d{4}$/.test(v) || 'Inserisci un anno valido (es. 2023)',
            v => (parseInt(v) >= 1600 && parseInt(v) <= 2023) || 'L\'anno deve essere compreso tra 1600 e 2023'
            // Potevo utilizzare una libreria per la gestione delle date come "moment" o "day.js" per ricavare l'anno corrente ma essendo un progetto di test ho evitato
         ]
      }
   },
   methods: {
      // Metodo per aprire la dialog di inserimento libro
      openAddBookDialog() {
         this.addBookDialog = true;
      },
      // Metodo per aprire la dialog per modificare il libro
      openEditBookDialog(book) {
         this.bookToEdit = { ...book };
         this.editBookDialog = true;
      },
      // Metodo per aprire la dialog di conferma eliminazione
      openDeleteBookDialog(book) {
         this.bookToDelete = book;
         this.deleteBookDialog = true;
      },
      openDetailBookDialog(book) {
         this.selectedBook = book;
         this.$refs.bookDetail.detailDialog = true;
      },
      // Metodo per aggiungere un nuovo libro
      addBook() {
         // Verifica la validità dei campi
         if (this.$refs.addBookForm.validate()) {
            if (!this.authors.includes(this.newBook.author)) {
               this.authors.push(this.newBook.author);
            }

            // Aggiunta libro
            this.books.push({
               id: this.books.length + 1,
               title: this.newBook.title,
               author: this.newBook.author,
               publish_year: this.newBook.publish_year,
            });

            // Reset Dialog e newBook
            this.addBookDialog = false;
            this.newBook = {
               title: '',
               author: '',
               publish_year: '',
            };
         }
      },
      // Metodo per modificare un libro
      editBook() {
         // Verifica la validità dei campi
         if (this.$refs.editBookForm.validate()) {
            if (this.bookToEdit) {
               // Trovaviamo l'indice del libro da eliminare nell'array dei libri
               const index = this.books.findIndex(book => book.id === this.bookToEdit.id);

               // Se l'indice è valido, sostituisco il libro esistente con il libro modificato
               if (index !== -1) {
                  this.books.splice(index, 1, { ...this.bookToEdit });
               }
            }

            // Reset Dialog e bookToEdit
            this.editBookDialog = false;
            this.bookToEdit = {
               title: '',
               author: '',
               publish_year: '',
            };
         }
      },
      // Metodo per elimianre un libro
      deleteBook() {
         if (this.bookToDelete) {
            // Trovaviamo l'indice del libro da eliminare nell'array dei libri
            const index = this.books.findIndex(book => book.id === this.bookToDelete.id);

            // Se l'indice è valido, elimino il libro
            if (index !== -1) {
               this.books.splice(index, 1);
            }
         }

         // Reset Dialog e bookToDelete
         this.deleteBookDialog = false;
         this.bookToDelete = null;
      },
      sortBooks(books, criteria, direction) {
         const sortedBooks = [...books];
         if (criteria === 'title') {
            sortedBooks.sort((a, b) => (direction === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
         } else if (criteria === 'publish_year') {
            sortedBooks.sort((a, b) => (direction === 'asc' ? a.publish_year - b.publish_year : b.publish_year - a.publish_year));
         }
         return sortedBooks;
      },
   },
   created() {
      this.$store.dispatch('loadBooks');
   },
   computed: {
      ...mapGetters(['loading', 'books', 'authors']),

      filteredBooks() {
         // Applichiamo l'ordinamento
         const sortedBooks = this.sortBooks(this.books, this.sortCriteria, this.sortDirection);

         // Filtro autori
         const filteredBooks = sortedBooks.filter((book) => {
            // Se l'autore del libro è presente tra quelli selezionati o non ci sono autori selezionati
            return (
               this.selectedAuthors.includes(book.author) ||
               this.selectedAuthors.length === 0
            );
         });

         // Filtro per titolo del libro
         return filteredBooks.filter((book) =>
            book.title.toLowerCase().includes(this.searchBook.toLowerCase())
         );
      },
   },

};
</script>
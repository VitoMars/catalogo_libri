import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/apis/api'

Vue.use(Vuex)

export default new Vuex.Store({
  // Variabili
  state: {
    loading: false,
    books: [],
    authors: [],
    authorsWithBooks: [],
    newBook: { title: '', author: '', publish_year: '' },
    bookToEdit: { title: '', author: '', publish_year: '' },
  },
  // Metodi get per ottenere le variabili
  getters: {
    loading(state) {
      return state.loading;
    },
    books(state) {
      return state.books;
    },
    authors(state) {
      return state.authors;
    },
    authorsWithBooks(state) {
      return state.authorsWithBooks;
    },
    newBook(state) {
      return state.newBook;
    }
  },
  // Funzioni sincrone che modificano lo stato (variabili) nello store
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    setBooks(state, books) {
      state.books = books;
      state.loading = false;
    },
    setAuthors(state, authors) {
      state.authors = authors;
    },
    setAuthorsWithBooks(state, authorsWithBooks) {
      state.authorsWithBooks = authorsWithBooks;
    },
    addBook(state, newBook) {
      state.books.push(newBook);
    },
    editBook(state, editedBook) {
      const index = state.books.findIndex(book => book.id === editedBook.id);
      if (index !== -1) {
        state.books.splice(index, 1, editedBook);
      }
    },
    deleteBook(state, bookToDelete) {
      const index = state.books.findIndex(book => book.id === bookToDelete.id);
      if (index !== -1) {
        state.books.splice(index, 1);
      }
    },
  },
  // Sono funzioni asincrone che vengono caricate prima di chiamare le mutation.
  actions: {
    // Carica i libri dall'API e aggiorna lo stato
    async loadBooks({ commit }) {
      try {
        // Caricamento per l'utente
        commit('setLoading', true);

        // Chiamata asincrona per ottenere i libri dall'API
        const { reading_log_entries } = await api.getBooks();

        // Trasformo i dati ottenuti dalla chiamata API in un formato migliore
        const books = reading_log_entries.map((apiBook, index) => ({
          id: index,
          title: apiBook.work.title ?? 'Sconosciuto',
          author: apiBook.work.author_names[0] ?? 'Sconosciuto',
          publish_year: apiBook.work.first_publish_year ?? 'Sconosciuto',
          cover_url: apiBook.work.cover_id ? `https://covers.openlibrary.org/b/id/${apiBook.work.cover_id}-L.jpg` : null,
        }));
        commit('setBooks', books);

        // Creo una la lista degli autori dai libri
        const authors = books.map(book => book.author);
        commit('setAuthors', authors);

        // Creo la struttura di authorsWithBooks
        const authorsWithBooks = authors.map((author, index) => ({
          id: index,
          name: author,
          books: books.filter(book => book.author === author),
        }));
        commit('setAuthorsWithBooks', authorsWithBooks);

      } catch (error) {
        console.error('Errore durante il caricamento dei libri:', error);
      } finally {
        // Disabilito il caricamento per l'utente
        commit('setLoading', false);
      }
    },
    async addBook({ commit, state }, newBook) {
      try {
        // Aggiungo il libro allo stato
        commit('addBook', newBook);

        // Aggiorno la lista degli autori
        if (!state.authors.includes(newBook.author)) {
          commit('setAuthors', [...state.authors, newBook.author]);
        }
      } catch (error) {
        console.error('Errore durante l\'aggiunta del libro:', error);
      }
    },
    async editBook({ commit, state }, editedBook) {
      try {
        // Esegui la modifica del libro nello stato
        commit('editBook', editedBook);

        // Aggiorno la lista degli autori rimuovendo eventuali duplicati
        const uniqueAuthors = [...new Set(state.books.map(book => book.author))];
        commit('setAuthors', uniqueAuthors);
      } catch (error) {
        console.error('Errore durante la modifica del libro:', error);
      }
    },
    async deleteBook({ commit, state }, bookToDelete) {
      try {
        // Esegui l'eliminazione del libro nello stato
        commit('deleteBook', bookToDelete);

        // Aggiorno la lista degli autori rimuovendo eventuali duplicati
        const uniqueAuthors = [...new Set(state.books.map(book => book.author))];
        commit('setAuthors', uniqueAuthors);
      } catch (error) {
        console.error('Errore durante l\'eliminazione del libro:', error);
      }
    },
  },
  modules: {}
})

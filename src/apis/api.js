import axios from 'axios';

const BOOKS_URL = 'https://openlibrary.org/people/mekBot/books/currently-reading.json';

export default {
   async getBooks() {
      try {
         const response = await axios.get(BOOKS_URL);
         return response.data;
      } catch (error) {
         console.error('Errore durante la richiesta dei libri:', error);
         throw error;
      }
   },
};

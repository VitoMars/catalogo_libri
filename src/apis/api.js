// api.js
import axios from 'axios';

const BASE_URL = 'https://openlibrary.org/people/mekBot/books/currently-reading.json';

export default {
   async getBooks() {
      try {
         const response = await axios.get(BASE_URL);
         return response.data;
      } catch (error) {
         console.error('Errore durante la richiesta dei libri:', error);
         throw error;
      }
   },
};

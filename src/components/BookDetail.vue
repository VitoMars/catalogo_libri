<template>
   <v-dialog v-model="detailDialog" max-width="500" @click:outside="closeDetailDialog()">
      <v-card>
         <v-card-title>Dettagli libro</v-card-title>
         <v-card-text class="pb-0">
            <v-list>
               <v-list-item>
                  <v-list-item-content>
                     <v-list-item-title>Titolo: {{ selectedBook.title }}</v-list-item-title>
                     <v-list-item-subtitle>Autore: {{ selectedBook.author }}</v-list-item-subtitle>
                     <v-list-item-subtitle>Anno di pubblicazione: {{ selectedBook.publish_year }}</v-list-item-subtitle>
                  </v-list-item-content>
               </v-list-item>
            </v-list>
         </v-card-text>

         <div v-if="!imageLoaded" class="text-center">
            <v-progress-circular indeterminate color="primary" />
         </div>

         <v-img :src="selectedBook.cover_url" :max-height="imageLoaded ? '500px' : 0" @load="handleImageLoad" />

         <v-card-actions class="d-flex justify-end">
            <v-btn @click="closeDetailDialog()" color="primary" text>Chiudi</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>
 
<script>
export default {
   props: {
      selectedBook: Object,
   },
   data() {
      return {
         detailDialog: false,
         imageLoaded: false,
      };
   },
   methods: {
      closeDetailDialog() {
         this.detailDialog = false;
      },
      handleImageLoad() {
         this.imageLoaded = true;
      },
   },
};
</script>
 
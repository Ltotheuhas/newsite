<template>
    <v-container>
      <h1>Thank you for your purchase!</h1>
      <p>Your order was successful, and a confirmation email has been sent.</p>
      <v-btn color="primary" @click="$router.push('/store')">Back to Store</v-btn>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'ConfirmationView',
  };
  </script>
  
  <style scoped>
  h1 {
    margin-bottom: 20px;
  }
  </style>
  
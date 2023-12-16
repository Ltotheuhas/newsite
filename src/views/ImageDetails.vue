<template>
    <div>
      <img :src="image.url" :alt="image.text" />
      <p>{{ image.text }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        image: {},
      };
    },
    created() {
      // Retrieve the image details from route parameters
      const { id } = this.$route.params;
      
      // Assuming you have a global images array, you can find the selected image
      // based on the id parameter. Replace this logic with your actual data source.
      // For example, if your images are in the store:
      // const selectedImage = this.$store.state.images.find(image => image.id === parseInt(id));
  
      // For demonstration purposes, let's assume the images array is stored in the parent component
      const selectedImage = this.$parent.images.find(image => image.id === parseInt(id));
  
      if (selectedImage) {
        this.image = selectedImage;
      } else {
        // Handle case where image with the given id is not found
        console.error('Image not found');
      }
    },
  };
  </script>
  
  <style scoped>
  /* Add styling for the details page as needed */
  img {
    max-width: 100%;
    max-height: 80vh; /* Adjust as needed */
    object-fit: contain; /* Adjust as needed */
  }
  </style>
  
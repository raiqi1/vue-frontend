<template>
  <div class="container mt-5">
    <h2>Create Product</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Product Name</label>
        <input type="text" id="name" v-model="name" class="form-control" required placeholder="Enter product name" />
      </div>
      <button type="submit" class="btn btn-primary">Create Product</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { showError } from '@/helper/ToastNofication'; // Adjust the path accordingly
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const name = ref('');

const toast = useToast();
const router = useRouter();
async function createPost(name: string) {

  const data = {
    name,
  };

  try {
    const response = await axios.post('https://api-loan-production.up.railway.app/api/products/create-products', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true,
    });
    // const idCompany = response.data.company._id;
    // console.log("idCompany", idCompany);
    console.log('Product created successfully:', response.data.message);
    console.log('Product data:', response.data);
    // if (response.data.success === true) {
    //   router.push(`/create-post?=${idCompany}`)
    // }
    toast.success('Product created successfully');

  } catch (error: any) {
    console.error('Error creating company:', error);
    showError((error.response?.data?.message || error.message) || 'An error occurred.');
  }
}

async function handleSubmit() {
  try {
    await createPost(name.value);
    name.value = '';
  } catch (error) {
    showError('Failed to create company. Please try again.');
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>

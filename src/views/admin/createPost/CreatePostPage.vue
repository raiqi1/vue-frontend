<template>
  <div class="container mt-5">
    <h2>Create Product</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Product Name</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="form-control"
          required
          placeholder="Enter product name"
        />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Loading...</span>
        <span v-else>Create Product</span>
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { showError } from '@/helper/ToastNofication'; // Adjust the path accordingly
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { APP } from '@/helper/APP';

const name = ref('');
const loading = ref(false); // Tambahkan ref untuk loading

const toast = useToast();
const router = useRouter();

async function createPost(name: string) {
  const data = { name };

  try {
    loading.value = true; // Set loading ke true saat mulai request
    const response = await axios.post(`${APP.nodeApiBaseURL}/products/create-products`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    console.log('Product created successfully:', response.data.message);
    console.log('Product data:', response.data);

    toast.success('Product created successfully');
  } catch (error: any) {
    console.error('Error creating product:', error);
    showError((error.response?.data?.message || error.message) || 'An error occurred.');
  } finally {
    loading.value = false; // Set loading ke false setelah request selesai
  }
}

async function handleSubmit() {
  try {
    await createPost(name.value);
    name.value = '';
  } catch (error) {
    showError('Failed to create product. Please try again.');
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>

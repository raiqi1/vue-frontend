<template>
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <td>ID</td>
        <td>Name</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    </thead>

    <tbody>
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.id }}</td>
        <td>{{ post.name }}</td>
        <td>
          <button @click="emit('updatePost', post)" class="btn btn-outline-primary btn-sm">Edit</button>
        </td>
        <td>
          <button @click="deleteProduct(post.id)" class="btn btn-outline-danger btn-sm">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import type { GetPostResponseType } from '../actions/GetPost';
import { useGetPost } from '../actions/GetPost';
import { APP } from '@/helper/APP';

defineProps<{
  posts: Array<GetPostResponseType> | undefined;
}>();

const emit = defineEmits<{
  (e: 'deleteProduct', postId: number): void;
  (e: 'updatePost', post: GetPostResponseType): void;
  (e: 'showModal', post: GetPostResponseType): void;
}>();

const { getPost } = useGetPost(); // Mengambil fungsi getPost dari useGetPost

// Fungsi untuk menghapus produk
async function deleteProduct(postId: number) {
  const confirmed = window.confirm('Are you sure you want to delete this product?');
  if (!confirmed) return;

  try {
    const response = await fetch(`${APP.nodeApiBaseURL}/products/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      console.log('Product deleted successfully');
      await getPost();
    } else {
      console.error('Failed to delete product:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

onMounted(() => {
  getPost();
});

</script>

<style scoped>
.table {
  width: 100%;
}
</style>

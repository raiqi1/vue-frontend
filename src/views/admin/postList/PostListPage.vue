<template>
    <div class="row">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">Product List</div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <span style="color:blue" v-if="loading"><b>Loading</b></span>
                        </div>
                    </div>
                    <br />
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>Delete</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="post in posts" :key="post.id">
                                <td>{{ post.id }}</td>
                                <td>{{ post.name }}</td>
                                <td>
                                    <button @click="deleteProduct(post.id)"
                                        class="btn btn-outline-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useGetPost } from './actions/GetPost';
import { confirmDelation } from '@/helper/sweetAlert';

const { loading, posts, getPost, query } = useGetPost();

const searchPost = async () => {
    await getPost();
}

async function deleteProduct(postId: number) {
    const confirmed = await confirmDelation(); // Menunggu konfirmasi dari sweet alert
    if (!confirmed) return;
    try {
        const response = await fetch(`http://localhost:5000/api/products/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            console.log('Product deleted successfully');
            await getPost(); // Memperbarui daftar setelah penghapusan
        } else {
            console.error('Failed to delete product:', response.statusText);
        }
        // jika response nya tidak ok atau unauthorized 

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

onMounted(async () => {
    await getPost();
});
</script>

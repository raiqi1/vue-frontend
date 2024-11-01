<template>
  <div class="row">
    <div class="col-md-4" v-for="post in posts" :key="post.id">
      <div class="card h-100">
        <div class="card-body d-flex flex-column">
          <div class="col d-flex flex-column position-static">
            <h3 class="mb-2">{{ post.name }}</h3>
            <input
              type="number"
              v-model.number="quantities[post.id]"
              min="1"
              placeholder="Quantity"
              class="mb-2"
            />
            <button @click="addToCart(post.name, post.id)" class="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GetArticleResponseType } from '../actions/DisplayArticle';
import { ref } from 'vue';

// Mendefinisikan properti yang diterima
const props = defineProps<{
  posts: Array<GetArticleResponseType> | undefined
}>();

// State untuk menyimpan kuantitas produk
const quantities = ref<{ [key: number]: number }>({});

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productName: string, productId: number) {
  const quantity = quantities.value[productId] || 0;

  if (quantity > 0) {
    // Ambil keranjang dari local storage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Cek jika produk sudah ada di keranjang
    const existingProduct = cart.find((item: { name: string }) => item.name === productName);

    if (existingProduct) {
      // Jika ada, tambahkan kuantitas
      existingProduct.quantity += quantity;
    } else {
      // Jika tidak ada, tambahkan produk baru
      cart.push({ name: productName, quantity });
    }

    // Simpan kembali ke local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reset kuantitas setelah ditambahkan
    quantities.value[productId] = 0;
    alert(`${quantity} ${productName}(s) added to cart!`);
  } else {
    alert('Please enter a quantity greater than 0.');
  }
}
</script>

<style scoped>
.card-img-container {
  height: 200px;
  overflow: hidden;
}

.card-img-top {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.reading {
  margin-top: auto;
  text-align: center;
  position: relative;
  top: 15vw;
}
</style>

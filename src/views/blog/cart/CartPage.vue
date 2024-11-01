<script lang="ts" setup>
import { APP } from "@/helper/APP";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userData = localStorage.getItem("token");
const userId = ref<number | null>(null);
const name = ref<string | null>(null);
const cart = ref<{ name: string; quantity: number }[]>([]);

// Ambil user ID dan nama user dari API
const fetchUserId = async () => {
  try {
    const res = await fetch(`${APP.nodeApiBaseURL}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData}`,
      },
    });
    const data = await res.json();
    userId.value = data.user.id;
    name.value = data.user.name;
  } catch (error) {
    console.log(error);
  }
};

// Ambil data keranjang dari localStorage
const loadCart = () => {
  const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.value = storedCart;
};

// Update quantity produk di dalam cart
const updateQuantity = (index: number, change: number) => {
  const newQuantity = cart.value[index].quantity + change;
  if (newQuantity >= 1) {
    cart.value[index].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart.value)); // Simpan pembaruan di localStorage
  }
};

// Menghapus item dari cart
const deleteCartItem = (index: number) => {
  cart.value.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart.value));
};

// Submit data cart ke API
const submitCart = async () => {
  try {
    if (userId.value) {
      const res = await fetch(`${APP.nodeApiBaseURL}/transaksi/create-transaksi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData}`,
        },
        body: JSON.stringify({
          userId: userId.value,
          customer: name.value,
          product: cart.value,
        }),
      });
      const data = await res.json();
      console.log("Response:", data);

      // Jika transaksi berhasil, kosongkan cart, hapus dari localStorage, dan arahkan ke halaman admin
      cart.value = [];
      localStorage.removeItem("cart");
      router.push("/admin");
    } else {
      console.log("User ID belum tersedia, silakan cek profil terlebih dahulu.");
    }
  } catch (error) {
    console.log(error);
  }
};

// Panggil fungsi loadCart dan fetchUserId saat komponen dimuat
onMounted(() => {
  fetchUserId();
  loadCart();
});
</script>

<template>
  <main class="container">
    <div>
      <h2>Daftar Produk di Keranjang</h2>
      <ul v-if="cart.length > 0">
        <li v-for="(item, index) in cart" :key="index">
          <div>
            <span>{{ item.name }}</span>
            <div class="quantity-controls">
              <button @click="updateQuantity(index, -1)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQuantity(index, 1)">+</button>
              <i class="fas fa-trash delete-icon" @click="deleteCartItem(index)"></i>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>Tidak ada belanjaan di keranjang</p>
    </div>
    <button @click="submitCart" :disabled="cart.length === 0">Submit Cart</button>
  </main>
</template>

<style scoped>
.container {
  background-color: #f8f9fa;
  padding: 0;
  margin: 0;
  margin: 10vw;
}

.fas {
  cursor: pointer;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  font-size: 1.2em;
  margin: 0 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 50%;
}

.quantity-controls span {
  min-width: 20px;
  text-align: center;
}

.delete-btn {
  background-color: #dc3545;
  border-radius: 5px;
  font-size: 0.9em;
  padding: 5px;
  color: white;
  cursor: pointer;
  margin-left: 10px;
}
</style>

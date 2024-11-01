<script lang="ts" setup>
import { APP } from "@/helper/APP";
import { onMounted, ref, watch } from "vue";

interface Product {
  productName: string;
  quantity: number;
  name: string;
}

interface Transaksi {
  id: number;
  invoiceNo: string;
  customer: string;
  product: Product[];
  createdAt: string;
}

const transaksiList = ref<Transaksi[]>([]);

const fetchTransaksiData = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${APP.nodeApiBaseURL}/transaksi/all-transaksi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Cek status respons
    if (!response.ok) {
      if (response.status === 401) {
        // Redirect ke halaman login jika unauthorized
        window.location.href = "/login"; // Ganti dengan path login yang sesuai
      }
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("Data diterima dari API:", data); // Menampilkan data yang diterima

    // Akses data transaksi dari data.data
    if (Array.isArray(data.data) && data.data.length > 0) {
      console.log("Data valid, menyimpan ke transaksiList");
      transaksiList.value = data.data; // Menyimpan data transaksi ke dalam state
      console.log("Data transaksiList diatur:", transaksiList.value);
    } else {
      console.log("Data yang diterima tidak valid. Data:", data);
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
};

// Watch untuk mendeteksi perubahan pada transaksiList
watch(transaksiList, (newValue) => {
  console.log("transaksiList diubah:", newValue);
});

// Mengambil data saat komponen dimuat
onMounted(() => {
  fetchTransaksiData();
});
</script>

<template>
  <div class="row">
    <div class="row">
      <h3>Dashboard</h3>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">Transaksi List</div>
          <div class="card-body">
            <table v-if="transaksiList.length > 0" class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total Quantity</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(transaksi) in transaksiList" :key="transaksi.id">
                  <td>{{ transaksi.id }}</td>
                  <td>{{ transaksi.invoiceNo }}</td>
                  <td>{{ transaksi.customer }}</td>
                  <td>
                    <ul>
                      <li v-for="(product, idx) in transaksi.product" :key="idx">
                        {{ product.name }} - Quantity: {{ product.quantity }}
                      </li>
                    </ul>
                  </td>
                  <td>{{ transaksi.product.reduce((sum, item) => sum + item.quantity, 0) }}</td>
                  <td>{{ new Date(transaksi.createdAt).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else>Tidak ada transaksi tersedia.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-top: 20px;
}

.table {
  width: 100%;
  margin-top: 20px;
}
</style>

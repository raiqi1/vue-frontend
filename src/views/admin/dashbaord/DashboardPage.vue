<script lang="ts" setup>
import { APP } from "@/helper/APP";
import { confirmDelation } from "@/helper/sweetAlert";
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
const loading = ref(false); // State untuk loading

const fetchTransaksiData = async () => {
  loading.value = true; // Set loading ke true saat mulai fetch
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
        window.location.href = "/login"; 
      }
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("Data diterima dari API:", data); 

    // Akses data transaksi dari data.data
    if (Array.isArray(data.data) && data.data.length > 0) {
      console.log("Data valid, menyimpan ke transaksiList");
      transaksiList.value = data.data; // Menyimpan data transaksi ke dalam state
      console.log("Data transaksiList diatur:", transaksiList.value);
    } else {
      console.log("Data yang diterima tidak valid. Data:", data);
      transaksiList.value = [];
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    loading.value = false; 
  }
};

const deleteTransaksi = async (transaksiId: number) => {
  const confirmed = await confirmDelation();
  if (!confirmed) return;
  const token = localStorage.getItem("token");
  loading.value = true;
  try {
    const response = await fetch(`${APP.nodeApiBaseURL}/transaksi/${transaksiId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Transaksi berhasil dihapus");
      await fetchTransaksiData(); 
    } else {
      console.error("Gagal menghapus transaksi:", response.statusText);
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    loading.value = false; 
  }
};


watch(transaksiList, (newValue) => {
  console.log("transaksiList diubah:", newValue);
});


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
          <div class="card-body position-relative">
            <!-- Indikator loading dengan posisi absolute -->
            <div v-if="loading" class="loading-overlay">
              <p>Loading...</p>
            </div>

            <table v-if="transaksiList.length > 0" class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total Quantity</th>
                  <th>Created At</th>
                  <th>Action</th>
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
                  <td>
                    <button @click="deleteTransaksi(transaksi.id)" class="btn btn-danger">Delete</button>
                  </td>
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

.position-relative {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  /* Background semi-transparan */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}
</style>

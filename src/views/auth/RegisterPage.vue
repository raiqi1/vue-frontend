<script lang="ts" setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { APP } from '@/helper/APP';

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('admin')
const loading = ref(false)

async function handleSubmit() {
  console.log('Form data before submit:', {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
  })

  const formData = {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
  }

  try {
    loading.value = true // Set loading ke true saat mulai proses
    const response = await fetch(`${APP.nodeApiBaseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    })
    const data = await response.json()
    console.log('Response from server:', data)
    Swal.fire('Success!', 'Registration successful!', 'success')
    window.location.href = '/login'
  } catch (error) {
    console.error('Error during registration:', error)
    Swal.fire('Error!', 'Registration failed! Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Judul -->
    <h1 class="text-center">Register</h1>
    <form @submit.prevent="handleSubmit" class="form">
      <input type="text" v-model="name" class="form-control mb-2" placeholder="Full Name" required />
      <input type="email" v-model="email" class="form-control mb-2" placeholder="Email" required />
      <input type="password" v-model="password" class="form-control mb-2" placeholder="Password" required />
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Loading...</span>
        <span v-else>Register</span>
      </button>
    </form>
  </div>
</template>

<style>
.text-center {
  text-align: center;
  margin-bottom: 2vw;
}
.form {
  max-width: 400px;
  margin: auto;
}
</style>

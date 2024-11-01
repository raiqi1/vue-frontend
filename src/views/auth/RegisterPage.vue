<script lang="ts" setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('admin') // Default role

async function handleSubmit() {
  console.log('Form data before submit:', {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
  })

  // Membuat data sebagai JSON
  const formData = {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
  }

  try {
    const response = await fetch('https://api-loan-production.up.railway.app/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    console.log('Response from server:', data)
    Swal.fire('Success!', 'Registration successful!', 'success') // Show success alert
    window.location.href = '/login' // Redirect to login page
  } catch (error) {
    console.error('Error during registration:', error)
    Swal.fire('Error!', 'Registration failed! Please try again.', 'error') // Show error alert
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit" class="form">
      <input type="text" v-model="name" class="form-control mb-2" placeholder="Full Name" required />
      <input type="email" v-model="email" class="form-control mb-2" placeholder="Email" required />
      <input type="password" v-model="password" class="form-control mb-2" placeholder="Password" required />

      <div class="mb-2">
        <label>
          <input type="radio" value="admin" v-model="role" />
          Admin
        </label>
        <label>
          <input type="radio" value="lender" v-model="role" />
          customer
        </label>
      </div>

      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<style>
.form {
  max-width: 400px;
  margin: auto;
}
</style>

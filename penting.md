<script lang="ts" setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const fullname = ref('')
const email = ref('')
const phoneNumber = ref('')
const password = ref('')
const role = ref('student') // Default role

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    previewUrl.value = URL.createObjectURL(file.value)
    console.log('Selected file:', file.value)
  }
}

async function handleSubmit() {
  console.log('Form data before submit:', {
    fullname: fullname.value,
    email: email.value,
    phoneNumber: phoneNumber.value,
    password: password.value,
    role: role.value,
    file: file.value,
  })

  const formData = new FormData()
  formData.append('fullname', fullname.value)
  formData.append('email', email.value)
  formData.append('phoneNumber', phoneNumber.value)
  formData.append('password', password.value)
  formData.append('role', role.value)
  if (file.value) {
    formData.append("file", file.value)
  }

  try {
    const response = await fetch('https://job-portal-api-nine.vercel.app/api/v1/user/register', {
      method: 'POST',
      body: formData,
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
      <input type="text" v-model="fullname" class="form-control mb-2" placeholder="Full Name" required />
      <input type="email" v-model="email" class="form-control mb-2" placeholder="Email" required />
      <input type="tel" v-model="phoneNumber" class="form-control mb-2" placeholder="Phone Number" required />
      <input type="password" v-model="password" class="form-control mb-2" placeholder="Password" required />

      <div class="mb-2">
        <label>
          <input type="radio" value="student" v-model="role" />
          Student
        </label>
        <label>
          <input type="radio" value="recruiter" v-model="role" />
          Recruiter
        </label>
      </div>

      <input type="file" @change="handleFileChange" accept="image/*" class="mb-2" />
      <button type="submit" class="btn btn-primary">Register</button>
    </form>

    <img v-if="previewUrl" :src="previewUrl" alt="Preview" style="max-width: 100px; margin-top: 10px;" />
  </div>
</template>

<style>
.form {
  max-width: 400px;
  margin: auto;
}
</style>

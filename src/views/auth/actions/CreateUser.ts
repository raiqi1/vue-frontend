import { APP } from '@/helper/APP'
import { showError, successMsg } from '@/helper/ToastNofication'
import { makeHttpReq } from '@/helper/makeHttpReq'
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Import router

export interface IRegisterInput {
  username: string
  email: string
  password: string
}

export type RegisterResponseType = {
  user: {
    id: number
    username: string
    email: string
  }
  message: string
}

export const registerInput = ref<IRegisterInput>({
  username: '',
  email: '',
  password: ''
})

export function useCreateUser() {
  const loading = ref(false)
  const router = useRouter() // Gunakan router

  async function createUser() {
    try {
      loading.value = true
      const data = await makeHttpReq<IRegisterInput, RegisterResponseType>(
        'register',
        'POST',
        registerInput.value
      )
      successMsg("Pendaftaran berhasil")
      loading.value = false
      registerInput.value = {} as IRegisterInput

      // Arahkan ke halaman login setelah pendaftaran berhasil
      router.push({ name: 'Login' }) // Sesuaikan nama rute halaman login
    } catch (error) {
      loading.value = false
      showError((error as Error).message)
    }
  }

  return { loading, createUser }
}

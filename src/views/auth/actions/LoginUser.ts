import { APP } from '@/helper/APP'
import { showError } from '@/helper/ToastNofication'
import { makeHttpReq, makeHttpReqLogin } from '@/helper/makeHttpReq'
import { ref } from 'vue'
import { useToast } from 'vue-toastification' // Import useToast

export interface ILoginInput {
  email: string
  password: string
}

export type LoginResponseType = {
  user: {
    role: string
  }
  message: string
  token: string
}

export const loginInput = ref<ILoginInput>({
  email: '',
  password: ''
})

export function useLoginUser() {
  const loading = ref(false)
  const toast = useToast()

  async function loginUser() {
    try {
      loading.value = true
      const data = await makeHttpReqLogin<ILoginInput, LoginResponseType>(
        'login',
        'POST',
        loginInput.value
      )

      console.log('data from loginUser', data)

      loading.value = false

      if (data?.token) {
        loginInput.value = {} as ILoginInput
        localStorage.setItem('token', data.token)
        toast.success("Login Successfull") // Show success toast
        window.location.href = '/admin'
      }
    } catch (error: any) {
      loading.value = false
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage) // Make sure this line is used to display the error
    }
  }

  return { loading, loginUser }
}

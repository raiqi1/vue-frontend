import { showError } from '@/helper/ToastNofication'
import { makeHttpGetProduct, makeHttpReq } from '@/helper/makeHttpReq'
import { ref } from 'vue'

export type GetPostResponseType = {
  id: number
  title: string
  post_content: string
  slug: string
  image: string
  name: string
  message: string
}
export function useGetPost() {
  const loading = ref(false)
  const query = ref<string>('')
  const message = ref<string>('')
  const posts = ref<Array<GetPostResponseType>>()
  async function getPost() {
    try {
      loading.value = true
      const data = await makeHttpGetProduct<
        undefined,
        { data: Array<GetPostResponseType>; message: any }
      >(`posts?query=${query.value}`, 'GET', undefined)
      posts.value = data.data

      console.log('data from getPost', data.data)
      console.log('message', data.message)

      loading.value = false
    } catch (error) {
      loading.value = false
      showError((error as Error).message)
    }
  }
  return { loading, posts, getPost, query }
}

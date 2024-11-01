import { showError } from '@/helper/ToastNofication'
import { makeHttpReqAllProduct } from '@/helper/makeHttpReq'
import { ref } from 'vue'

export type GetArticleResponseType = {
  id: number
  title: string
  category: string
  slug: string
  image: string
  userId: string
  name: string
  createdAt: string 
}

export function useDisplayArticle() {
  const loading = ref(false)
  const posts = ref<Array<GetArticleResponseType>>([]) // Mengubah tipe posts menjadi array

  async function getPost() {
    try {
      loading.value = true
      const data = await makeHttpReqAllProduct<Array<GetArticleResponseType>>() // Menentukan tipe respons sebagai array
      console.log('data from getPost', data)

      // Mapping data dari data.posts
      posts.value = data.map((post) => ({
        id: post.id,
        title: post.title,
        category: post.category,
        slug: post.slug,
        image: post.image,
        userId: post.userId,
        name: post.name,
        createdAt: post.createdAt,
      }))

      console.log('Mapped data post from backend', posts.value)
      loading.value = false
    } catch (error) {
      loading.value = false
      showError((error as Error).message)
    }
  }

  return { loading, posts, getPost }
}


// export const adminRoutes= {
//     path: '/admin',
//     name: 'admin',
//     component: () => import('../../views/admin/AdminPage.vue'),
//     children: [
//       {
//         path: '/',
//         name: 'admin',
//         component: () => import('../../views/admin/dashbaord/DashboardPage.vue')
//       },
//       {
//         path: '/create-post',
//         name: 'create-post',
//         component: () => import('../../views/admin/createPost/CreatePostPage.vue')
//       },
//       {
//         path: '/post-lists',
//         name: 'post-lists',
//         component: () => import('../../views/admin/postList//PostListPage.vue')
//       },
     
//     ]
//   }

  export const adminRoutes = {
    path: '/admin',
    name: 'admin',
    component: () => import('../../views/admin/AdminPage.vue'),
    children: [
      {
        path: '', // Halaman default untuk /admin
        name: 'admin-dashboard',
        component: () => import('../../views/admin/dashbaord/DashboardPage.vue')
      },
      {
        path: '/create-post', // Akses ke /admin/create-post
        name: 'create-post',
        component: () => import('../../views/admin/createPost/CreatePostPage.vue')
      },
      {
        path: '/post-lists', // Akses ke /admin/post-lists
        name: 'post-lists',
        component: () => import('../../views/admin/postList/PostListPage.vue')
      }
    ]
  }
  
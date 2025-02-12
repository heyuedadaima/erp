import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/Login.vue'
import Layout from '@/views/Layout/Layout.vue'

const Product=()=>import('@/views/Product/Product')
const Order=()=>import('@/views/Order/Order')
const User=()=>import('@/views/User/User')



Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:Layout,
    children:[
      {
        path:'/product',
        name:'product',
        component:Product
      },
      {
        path:'/order',
        name:'order',
        component:Order
      },
      {
        path:'/user',
        name:'user',
        component:User
      },
    ]
  },
  {
    path:'/Login',
    name:'Login',
    component:Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

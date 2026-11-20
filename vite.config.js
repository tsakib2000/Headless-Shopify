import express from 'express'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createCartRouter } from './server/cartRouter.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_SHOPIFY_')
  const cartApi = express()
  cartApi.disable('x-powered-by')
  cartApi.use('/api/cart', createCartRouter({
    domain: env.VITE_SHOPIFY_STORE_DOMAIN,
    token: env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
  }))

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'storefront-cart',
        configureServer(server) {
          server.middlewares.use(cartApi)
        },
        configurePreviewServer(server) {
          server.middlewares.use(cartApi)
        },
      },
    ],
  }
})

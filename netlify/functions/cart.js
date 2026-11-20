import express from 'express'
import serverless from 'serverless-http'
import { createCartRouter } from '../../server/cartRouter.js'

const app = express()
app.disable('x-powered-by')

app.use(['/api/cart', '/.netlify/functions/cart'], createCartRouter({
  domain: process.env.VITE_SHOPIFY_STORE_DOMAIN,
  token: process.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
}, { secure: true }))

export const handler = serverless(app)

import { fileURLToPath } from 'node:url'
import express from 'express'
import { createCartRouter } from './cartRouter.js'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const app = express()
app.disable('x-powered-by')
app.use('/api/cart', createCartRouter({
  domain: process.env.VITE_SHOPIFY_STORE_DOMAIN,
  token: process.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
}, { secure: true }))
app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }))
app.use(express.static(dist))
app.get('/{*path}', (_request, response) => response.sendFile('index.html', { root: dist }))

const port = Number(process.env.PORT ?? 4173)
app.listen(port, () => console.log(`Storefront listening on port ${port}`))

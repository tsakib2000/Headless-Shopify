export async function requestStorefront({ domain, token }, query, variables, signal) {
  const hostname = domain?.trim().toLowerCase()
  const accessToken = token?.trim()
  if (!hostname || !accessToken) {
    throw new Error('The Shopify storefront is not configured yet.')
  }
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(hostname)) {
    throw new Error('Set the Shopify store domain to its .myshopify.com hostname.')
  }

  const response = await fetch(`https://${hostname}/api/2026-10/graphql.json`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
    signal,
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error('Shopify denied access. Check the public Storefront API token and permissions.')
  }
  if (!response.ok) throw new Error('Shopify is temporarily unavailable. Please try again.')

  const { data, errors } = await response.json()
  if (errors?.length || !data) {
    throw new Error('Shopify could not complete the request. Check the Storefront API permissions and try again.')
  }
  return data
}

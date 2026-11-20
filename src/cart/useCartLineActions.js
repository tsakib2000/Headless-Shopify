import { useState } from 'react'
import { useCart } from './useCart.js'

export function useCartLineActions() {
  const { updateQuantity, removeItem } = useCart()
  const [feedback, setFeedback] = useState(null)

  async function changeQuantity(lineId, quantity) {
    setFeedback(null)
    const result = await updateQuantity(lineId, quantity)
    if (result) setFeedback({ ...result, success: 'Quantity updated.' })
  }

  async function removeLine(lineId) {
    setFeedback(null)
    const result = await removeItem(lineId)
    if (result) setFeedback({ ...result, success: 'Item removed.' })
  }

  return { feedback, changeQuantity, removeLine }
}

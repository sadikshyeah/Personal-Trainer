
import type { Customer, NewCustomer } from './types'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

const normalizeResponse = <T>(data: unknown, embeddedKey?: string): T[] => {
  if (Array.isArray(data)) {
    return data as T[]
  }

  if (typeof data === 'object' && data !== null) {
    const objectData = data as {
      content?: unknown
      data?: unknown
      _embedded?: Record<string, unknown>
    }

    if (Array.isArray(objectData.content)) {
      return objectData.content as T[]
    }

    if (Array.isArray(objectData.data)) {
      return objectData.data as T[]
    }

    if (embeddedKey && objectData._embedded && Array.isArray(objectData._embedded[embeddedKey])) {
      return objectData._embedded[embeddedKey] as T[]
    }
  }

  return []
}

export const fetchCustomers = () => {
  return fetch(`${API_BASE_URL}/customers`).then((response) => {
    if (!response.ok) {
      throw new Error('Error when fetching customers.')
    }

    return response.json().then((data) => normalizeResponse<Customer>(data, 'customers'))
  })
}

export const addCustomer = (customer: NewCustomer) => {
  return fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Error when adding customer.')
    }
  })
}

export const updateCustomer = (url: string, customer: NewCustomer) => {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Error when updating customer.')
    }
  })
}

export const deleteCustomer = (url: string) => {
  return fetch(url, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Error when deleting customer.')
    }
  })
}

import type { Customer, Training } from './types'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

type TrainingWithLink = Training & {
  _links?: {
    customer?: {
      href?: string
    }
  }
}

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

export const fetchTrainings = () => {
  return fetch(`${API_BASE_URL}/trainings`).then((response) => {
    if (!response.ok) {
      throw new Error('Error when fetching trainings.')
    }

    return response
      .json()
      .then((data) => normalizeResponse<TrainingWithLink>(data, 'trainings'))
      .then((trainings) =>
        Promise.all(
          trainings.map(async (training) => {
            const customerUrl = training._links?.customer?.href

            if (!customerUrl) {
              return training
            }

            try {
              const customerResponse = await fetch(customerUrl)
              if (!customerResponse.ok) {
                return training
              }

              const customerData = (await customerResponse.json()) as {
                firstname?: string
                lastname?: string
              }

              return {
                ...training,
                customer: {
                  firstname: customerData.firstname ?? '',
                  lastname: customerData.lastname ?? '',
                },
              }
            } catch {
              return training
            }
          }),
        ),
      )
  })
}

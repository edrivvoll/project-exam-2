const BASE_URL = 'https://v2.api.noroff.dev'
const API_KEY = '4f3ee179-18e9-46f1-b721-844731846040'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('hz_token')

  const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': API_KEY,
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 204) return null

  const data = await res.json()

  if (!res.ok) {
    const message = data?.errors?.[0]?.message || data?.message || 'Request failed'
    throw new Error(message)
  }

  return data
}

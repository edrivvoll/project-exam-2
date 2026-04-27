import { apiFetch } from './client'

export function getVenues(page = 1, limit = 12) {
  return apiFetch(`/holidaze/venues?_bookings=true&sort=created&sortOrder=desc&page=${page}&limit=${limit}`)
}

export function searchVenues(query) {
  return apiFetch(`/holidaze/venues/search?q=${encodeURIComponent(query)}&_bookings=true`)
}

export function getVenue(id) {
  return apiFetch(`/holidaze/venues/${id}?_bookings=true&_owner=true`)
}

export function createVenue(data) {
  return apiFetch('/holidaze/venues', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateVenue(id, data) {
  return apiFetch(`/holidaze/venues/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteVenue(id) {
  return apiFetch(`/holidaze/venues/${id}`, {
    method: 'DELETE',
  })
}

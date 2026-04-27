import { apiFetch } from './client'

export function getProfile(name) {
  return apiFetch(`/holidaze/profiles/${name}`)
}

export function updateProfile(name, data) {
  return apiFetch(`/holidaze/profiles/${name}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getProfileBookings(name) {
  return apiFetch(`/holidaze/profiles/${name}/bookings?_venue=true&sort=dateFrom&sortOrder=asc`)
}

export function getProfileVenues(name) {
  return apiFetch(`/holidaze/profiles/${name}/venues?_bookings=true`)
}

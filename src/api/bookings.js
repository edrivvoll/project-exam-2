import { apiFetch } from './client'

export function createBooking({ venueId, dateFrom, dateTo, guests }) {
  return apiFetch('/holidaze/bookings', {
    method: 'POST',
    body: JSON.stringify({ venueId, dateFrom, dateTo, guests }),
  })
}

export function deleteBooking(id) {
  return apiFetch(`/holidaze/bookings/${id}`, {
    method: 'DELETE',
  })
}

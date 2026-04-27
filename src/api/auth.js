import { apiFetch } from './client'

export async function register({ name, email, password, venueManager = false, bio = '', avatarUrl = '', avatarAlt = '' }) {
  const body = { name, email, password, venueManager }
  if (bio) body.bio = bio
  if (avatarUrl) body.avatar = { url: avatarUrl, alt: avatarAlt || name }

  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function login({ email, password }) {
  return apiFetch('/auth/login?_holidaze=true', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

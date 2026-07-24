const API_URL = process.env.NEXT_PUBLIC_API_URL

const readApiError = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const result = await response.json()
    return result.error || result.message
  }
  return response.text()
}

/**
 * Ensures an authenticated Firebase user has a matching database profile.
 *
 * This is intentionally safe to call after every login. The backend owns the
 * uid, default role, and creation timestamp and should upsert without replacing
 * an existing role.
 */
export const ensureUserProfile = async (firebaseUser, profile = {}) => {
  if (!API_URL) throw new Error('Backend API URL is missing.')
  if (!firebaseUser) throw new Error('No authenticated user was provided.')

  const token = await firebaseUser.getIdToken()
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: profile.name ?? firebaseUser.displayName ?? '',
      email: firebaseUser.email ?? '',
      phone: profile.phone ?? firebaseUser.phoneNumber ?? '',
      photoURL: firebaseUser.photoURL ?? '',
      provider: firebaseUser.providerData?.[0]?.providerId ?? 'password',
    }),
  })

  if (!response.ok) {
    const message = await readApiError(response)
    throw new Error(message || 'Could not save your account details.')
  }

  return response.json()
}

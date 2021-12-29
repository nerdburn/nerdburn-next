import { useEffect, useState } from 'react'
import { get } from '@/util/api'
import { useStore } from '@/util/store'

/**
 * Authenticate current user against server session.
 */
export function useUser() {
  const user = useStore(state => state.user)
  const token = useStore(state => state.token)
  const setUserAndToken = useStore(state => state.setUserAndToken)

  useEffect(async () => {
    const data = await get('/api/user')
    setUserAndToken(data.user || null, data.token || null)
  }, [])

  return { user, token }
}

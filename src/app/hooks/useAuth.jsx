'use client'

import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext/AuthContext'

function useAuth() {
  const authInfo = useContext(AuthContext)
  return authInfo
}

export default useAuth

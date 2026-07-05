'use client'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { AuthContext } from './AuthContext'
import { auth } from '@/app/firebase/firebase.init'
import { useEffect, useState } from 'react'

const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const updateUserProfile = (name) => {
    return updateProfile(auth.currentUser, { displayName: name })
  }

  const signIn = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const logOut = () => {
    setLoading(true)
    return signOut(auth)
  }

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unSubscribe()
  }, [])

  const authInfo = {
    user,
    loading,
    createUser,
    updateUserProfile,
    signIn,
    signInWithGoogle,
    logOut,
  }

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}

export default AuthProvider
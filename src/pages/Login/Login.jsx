import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import SignInPage from './SignInPage/SignInPage'
import { Routes, Route, useNavigate } from 'react-router-dom'
import SignUpComponent from './SignUpPage/SignUpPage'
import './Login.scss'
import { useLayoutEffect, useState } from 'react'
import { checkCookie } from '../../services/Cookies'
import axios from 'axios'
import ForgotPassword from './ForgotPassword/ForgotPassword'
import ChangeForgotPassword from './ChangeForgotPassword/ChangeForgotPassword'

export default function Login() {
  const navigate = useNavigate()
  const [linkLoginGoogle, SetLinkLoginGoogle] = useState('')
  useLayoutEffect(() => {
    checkCookie()
      ? navigate('/')
      : axios
          .get('https://genzu-chatting-be.onrender.com/auth/sign-in-google', {
            headers: {
              Accept: 'application/json',
            },
          })
          .then((response) => {
            SetLinkLoginGoogle(response.data.data)
          })
          .catch((error) => {
            console.error('Google sign in failed:', error)
          })
  }, [navigate])
  return (
    <div className='LoginPage mx-auto my-auto flex min-h-screen w-screen items-center justify-center'>
      <div>
        <Routes>
          <Route path='/' element={<SignInPage linkGoogle={linkLoginGoogle} />} />
          <Route path='signup' element={<SignUpComponent />} />
          <Route path='forgot/' element={<ForgotPassword />} />
          <Route path='forgot/:id' element={<ChangeForgotPassword />} />
        </Routes>
      </div>
    </div>
  )
}

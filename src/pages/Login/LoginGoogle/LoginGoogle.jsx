import LoadingSpinner from '@/pages/Chat/ChatSkeleton/ChatSkeleton'
import { checkCookie, setCookie } from '@/services/Cookies'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function LoginGoogle() {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const err = queryParams.get('err')
    const accessToken = queryParams.get('at')
    const refreshToken = queryParams.get('rt')
    const success = queryParams.get('success')

    if (success) {
      axios
        .get('https://genzu-chatting-be.onrender.com/auth/profile', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setCookie(
            'userLogin',
            JSON.stringify({
              accessToken: accessToken,
              refreshToken: refreshToken,
              user: response.data.data,
            }),
            7,
          )
          if (checkCookie()) {
            navigate('/')
          }
          // Handle success
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error)
          // Handle error
        })
    }
    // You can further process or set state with these values
  }, [location])
  return (
    <div>
      <LoadingSpinner />
    </div>
  )
}

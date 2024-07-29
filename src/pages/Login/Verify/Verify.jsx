import { setCookie } from '@/services/Cookies'
import axios from 'axios'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Verify() {
  const token = useParams()
  const [contentLoading, setContentLoading] = useState('Processing Verify your account')
  const navigate = useNavigate()
  const verifyEmail = async (token) => {
    try {
      const response = await axios.post(
        'https://genzu-chatting-be.onrender.com/auth/verify-email',
        { token },
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      console.log('Email verification response:', response.data)
      // Xử lý kết quả trả về từ server (ví dụ: hiển thị thông báo thành công)
      return response.data
    } catch (error) {
      console.error('Email verification error:', error)
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
      throw error // Có thể throw error để xử lý ở nơi gọi hàm
    }
  }
  useLayoutEffect(() => {
    verifyEmail(token.id)
      .then(async (data) => {
        try {
          // Create an instance of Axios
          const api = axios.create({
            baseURL: 'https://genzu-chatting-be.onrender.com',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${data.data.accessToken}`,
            },
          })

          // Make a GET request to the /auth/profile endpoint
          const response = await api.get('/auth/profile')
          console.log(response.status)

          setCookie(
            'userLogin',
            JSON.stringify({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              user: response.data.data,
            }),
            7,
          )
          if (response.status == 200) {
            navigate('/')
          }
        } catch (error) {
          // Handle error
          console.error('Error fetching profile:', error)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  })

  return (
    <div>
      {console.log(token)}
      <div className='flex h-screen w-full flex-col items-center justify-center bg-lightTheme dark:bg-darkTheme'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-blue-500'></div>
        <h2>{contentLoading}</h2>
      </div>
    </div>
  )
}

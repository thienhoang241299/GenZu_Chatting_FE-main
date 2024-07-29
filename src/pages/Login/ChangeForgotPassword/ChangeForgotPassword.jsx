import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../../../assets/logo.png'
export default function ChangeForgotPassword() {
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = useParams()
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    console.log(token.id)
    if (password == rePassword) {
      try {
        const response = await axios.post(
          'https://genzu-chatting-be.onrender.com/auth/verify-forgot-password',
          {
            token: token.id,
            newPassword: password,
          },
        )

        console.log('Password reset email sent:', response.data)
        navigate('/')
        // Handle success: show message or redirect user
      } catch (error) {
        console.error('Password reset request failed:', error)
        // Handle error: show error message to the user
      }
    } else {
      setError('Password not match')
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <img className='mx-auto h-12 w-auto' src={logo} alt='Genzu Chat' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Enter your new password
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleChangePassword}>
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Enter Password'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password 2nd
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Enter Re-password'
              />
            </div>
          </div>

          {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}

          <div>
            <button
              type='submit'
              className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={loading}
            >
              <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                {/* <LockClosedIcon
                  className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                  aria-hidden='true'
                /> */}
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

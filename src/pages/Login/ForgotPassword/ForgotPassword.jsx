import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from '@/services/userService'
import axios from 'axios'
import logo from '../../../assets/logo.png'
const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        'https://genzu-chatting-be.onrender.com/auth/forgot-password',
        {
          email: email,
        },
      )

      console.log('Password reset email sent:', response.data)
      // Handle success: show message or redirect user
    } catch (error) {
      console.error('Password reset request failed:', error)
      // Handle error: show error message to the user
    }
  }

  return (
    <div className='flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <img className='mx-auto h-12 w-auto' src={logo} alt='Genzu Chat' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Forgot Your Password?
          </h2>
        </div>
        <form className='mt-8 space-y-6'>
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Email address'
              />
            </div>
          </div>

          {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}

          {/* <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember_me'
                name='remember_me'
                type='checkbox'
                checked={rememberme}
                onChange={() => SetRememberme(!rememberme)}
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <label htmlFor='remember_me' className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a
                onClick={() => {
                  navigate('/login/forgot')
                }}
                href='#'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Forgot your password?
              </a>
            </div>
          </div> */}

          <div>
            <button
              onClick={(e) => handleResetPassword(e)}
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
              {loading ? 'Reset in...' : 'Send Password Reset Email'}
            </button>
            <p className='mt-2 text-center text-sm text-gray-600'>
              <a
                onClick={() => {
                  navigate('/login')
                }}
                href='#'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Sign in your account
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword

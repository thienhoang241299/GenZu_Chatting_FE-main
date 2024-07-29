import { useEffect, useState } from 'react'
import userService from '@/services/userService'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getIdConversation } from '@/redux/Slice/userSlice'
import logo from '../../../assets/logo.png'
import axios from 'axios'

const LoginForm = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberme, SetRememberme] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showButton, setShowButton] = useState(false)
  const idConversation = useSelector((state) => state.user.idConversation)
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await userService.signIn(email, password, rememberme)
      if (user) {
        dispatch(getIdConversation())
      }
      // Handle successful login here (e.g., save token, redirect)
    } catch (err) {
      console.error('Login failed:', err)
      // console.log(err.message == 'Please verify account')
      if (err.message == 'Please verify account') {
        setError('Login failed. Please verify your account.')
        setShowButton(true)
      } else {
        setError('Login failed. Please check your email and password.')
      }
    } finally {
      setLoading(false)
    }
  }
  const resendVerifyEmail = async (email) => {
    try {
      const response = await axios.post(
        'https://genzu-chatting-be.onrender.com/auth/resend-verify-email',
        { email },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to resend verify email')
    }
  }
  useEffect(() => {
    if (idConversation !== null) {
      navigate(`/chat/${idConversation}`)
    }
  }, [idConversation])
  return (
    <div className='flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <img className='mx-auto h-12 w-auto' src={logo} alt='Genzu Chat' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or {` `}
            <a
              onClick={() => {
                navigate('/login/signup')
              }}
              href='#'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Sign Up your account
            </a>
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleLogin}>
          <div className='-space-y-px rounded-md shadow-sm'>
            <div className='relative'>
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
              {/* Nút resend verify email */}
              {showButton && (
                <button
                  type='button'
                  onClick={() => {
                    resendVerifyEmail(email)
                      .then((data) => {
                        console.log(data.status)
                        setError('')
                        setNotification('Send message successfull. Please check your email')
                      })
                      .catch(
                        (error) => setError(error.message + ' s'),
                        setNotification(''),
                        console.log(error.message),
                      )
                  }}
                  className='absolute inset-y-0 right-0 flex items-center justify-center bg-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-300 focus:outline-none'
                >
                  <span className='mr-1'>Resend email</span>
                  {/* <svg
                    className='h-5 w-5 animate-spin text-gray-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V2.5a.5.5 0 011 0V4a8 8 0 01-8 8z'
                    ></path>
                  </svg> */}
                </button>
              )}
            </div>
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
                placeholder='Password'
              />
            </div>
          </div>

          {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}
          {notification && <div className='mt-2 text-sm text-blue-500'>{notification}</div>}

          <div className='flex items-center justify-between'>
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
          </div>

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
          <div className='mt-6'>
            <button
              onClick={() => {
                window.location.href = props.linkGoogle
              }}
              type='button'
              className='group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <svg
                  className='h-5 w-5 text-gray-500'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 48 48'
                  aria-hidden='true'
                >
                  <path
                    fill='#4285F4'
                    d='M24 9.5c3.31 0 6.1 1.14 8.37 3.03l6.28-6.28C34.82 3.12 29.68 1 24 1 14.9 1 7.35 6.78 4.66 14.83l7.67 5.94C13.65 13.36 18.45 9.5 24 9.5z'
                  />
                  <path
                    fill='#34A853'
                    d='M46.63 24.52c0-1.49-.13-2.92-.37-4.3H24v8.16h12.74c-.55 3.02-2.17 5.58-4.62 7.3v6.02h7.45C44.12 37.54 46.63 31.45 46.63 24.52z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M12.33 27.43c-.82-2.43-1.28-5-1.28-7.67 0-2.67.46-5.24 1.28-7.67V6.08H4.66C2.1 10.22 0 17.62 0 24s2.1 13.78 4.66 17.92l7.67-5.94z'
                  />
                  <path
                    fill='#EA4335'
                    d='M24 48c6.48 0 11.91-2.17 15.88-5.9l-7.45-6.02c-2.07 1.39-4.71 2.23-8.43 2.23-5.55 0-10.35-3.86-12.04-9.03l-7.67 5.94C7.35 41.22 14.9 47 24 47z'
                  />
                  <path fill='none' d='M0 0h48v48H0z' />
                </svg>
              </span>
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm

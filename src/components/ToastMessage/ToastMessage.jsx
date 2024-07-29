import { useEffect } from 'react'
import { clearToastMessage } from '../../redux/Slice/userSlice'
import { useDispatch } from 'react-redux'

const ToastMessage = ({ message }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearToastMessage())
    }, 2000)
    return () => clearTimeout(timer)
  }, [dispatch])

  return (
    <div
      className='absolute end-0 top-0 max-w-xs rounded-xl bg-blue-500 text-sm text-white shadow-lg'
      role='alert'
    >
      <div className='flex p-4'>
        {message}

        <div className='ms-auto'>
          <button
            type='button'
            className='inline-flex size-5 flex-shrink-0 items-center justify-center rounded-lg text-white opacity-50 hover:text-white hover:opacity-100 focus:opacity-100 focus:outline-none'
          >
            <span className='sr-only'>Close</span>
            <svg
              className='size-4 flex-shrink-0'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M18 6 6 18'></path>
              <path d='m6 6 12 12'></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ToastMessage

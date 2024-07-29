import React from 'react'

const NoConversations = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z'
          />
        </svg>
        <h2 className='mt-2 text-lg font-medium text-gray-900'>Không có cuộc trò chuyện</h2>
        <p className='mt-1 text-sm text-gray-600'>Hiện tại bạn chưa có cuộc trò chuyện nào.</p>
      </div>
    </div>
  )
}

export default NoConversations

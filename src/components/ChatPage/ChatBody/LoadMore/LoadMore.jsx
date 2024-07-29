import React from 'react'

const LoadMore = () => {
  return (
    <div className='flex items-center justify-center py-4'>
      <svg
        className='h-8 w-8 animate-spin text-gray-600'
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
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z'></path>
      </svg>
      <span className='ml-4 text-gray-600'>Đang tải thêm tin nhắn...</span>
    </div>
  )
}

export default React.memo(LoadMore)

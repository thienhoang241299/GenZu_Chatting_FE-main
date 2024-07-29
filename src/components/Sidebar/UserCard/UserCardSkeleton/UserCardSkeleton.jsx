import React from 'react'

const UserCardSkeleton = () => {
  return (
    <>
      <div className='animate-pulse rounded-lg bg-gray-200 p-4 shadow-md'>
        {/* Skeleton lines */}
        <div className='mb-2 h-4 w-5/6 animate-pulse bg-gray-300'></div>
        <div className='mb-2 h-4 w-4/6 animate-pulse bg-gray-300'></div>
        <div className='mb-2 h-4 w-3/6 animate-pulse bg-gray-300'></div>

        {/* Optional: Add a shimmer effect */}
        <div className='mt-2 h-1 w-full animate-pulse rounded bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300'></div>
      </div>
      <div className='animate-pulse rounded-lg bg-gray-200 p-4 shadow-md'>
        {/* Skeleton lines */}
        <div className='mb-2 h-4 w-5/6 animate-pulse bg-gray-300'></div>
        <div className='mb-2 h-4 w-4/6 animate-pulse bg-gray-300'></div>
        <div className='mb-2 h-4 w-3/6 animate-pulse bg-gray-300'></div>

        {/* Optional: Add a shimmer effect */}
        <div className='mt-2 h-1 w-full animate-pulse rounded bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300'></div>
      </div>
      <div className='animate-pulse rounded-lg bg-gray-200 p-4 shadow-md'>
        {/* Skeleton lines */}
        <div className='mb-2 h-4 w-5/6 animate-pulse bg-gray-300'></div>
        <div className='mb-2 h-4 w-4/6 animate-pulse bg-gray-300'></div>
        <div className='mb-2 h-4 w-3/6 animate-pulse bg-gray-300'></div>

        {/* Optional: Add a shimmer effect */}
        <div className='mt-2 h-1 w-full animate-pulse rounded bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300'></div>
      </div>
    </>
  )
}

export default UserCardSkeleton

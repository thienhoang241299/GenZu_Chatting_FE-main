import React from 'react'

const LoadingSpinner = () => {
  
  return (
    <>
      <div className='flex h-screen w-full flex-col items-center justify-center bg-lightTheme dark:bg-darkTheme'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-blue-500'></div>
        <h2>Loading Chat</h2>
      </div>
    </>
  )
}

export default LoadingSpinner

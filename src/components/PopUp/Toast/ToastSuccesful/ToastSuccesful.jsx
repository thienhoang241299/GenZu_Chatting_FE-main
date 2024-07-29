import React from 'react'

export default function ToastSuccesful(message) {
  return (
    <div style={{ zIndex: 99 }}>
      <div className='absolute end-0 top-0'>
        <div
          className='max-w-xs rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800'
          role='alert'
        >
          <div className='p-2 sm:p-4'>
            <h3 className='text-xs font-semibold text-gray-800 dark:text-white sm:text-base'>
              {message.message}
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

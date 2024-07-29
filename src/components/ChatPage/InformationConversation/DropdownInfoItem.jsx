import React from 'react'

const DropdownInfoItem = ({ icon: Icon, label }) => {
  return (
    <div className='rounded-md p-4 hover:bg-mainBlue dark:hover:bg-[#357ABD]'>
      <li>
        <button
          id='setting'
          className='relative flex w-full cursor-pointer items-center dark:text-white'
        >
          <Icon size={24} />
          <span className='ml-3 text-sm font-medium text-gray-900 dark:text-white'>{label}</span>
        </button>
      </li>
    </div>
  )
}

export default DropdownInfoItem

import React from 'react'

const DropdownItem = ({ icon: Icon, label, onClick, dropdownStyle, iconStyle }) => {
  return (
    <div
      className={`mb-1 mt-3 flex cursor-pointer items-center rounded-lg hover:bg-gray-100 dark:bg-gray-600 dark:hover:text-black ${dropdownStyle}`}
      onClick={onClick}
    >
      <Icon className={`-mr-1 rounded-full bg-slate-200 hover:bg-slate-300 ${iconStyle}`} />
      <span className='ml-4 dark:text-black'>{label}</span>
    </div>
  )
}

export default DropdownItem

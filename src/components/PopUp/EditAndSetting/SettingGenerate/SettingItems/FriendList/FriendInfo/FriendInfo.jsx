import { FiUserX } from 'react-icons/fi'
import React, { useState, useRef, useEffect } from 'react'
import userIcon from '../../../../../../../assets/noImage.jpg'
import userService from '@/services/userService'
import { useDispatch } from 'react-redux'
import { removeFriend } from '@/redux/Slice/userSlice'

const FriendInfo = ({ friendInfo, createdAt, friendShipId, onUnfriend }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()

  const handleRemoveClick = () => {
    setIsDropdownVisible(!isDropdownVisible)
  }

  const handleUnfriendConfirm = async (friendId) => {
    const response = await userService.deleteFriend(friendId)
    if (response.status === 200) {
      onUnfriend(friendId)
      dispatch(removeFriend(friendId))
      setIsDropdownVisible(false)
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false)
    }
  }

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownVisible])

  return (
    <div className='relative mt-1 flex items-start rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
      <img
        src={friendInfo?.picture || userIcon}
        alt='friend avatar'
        className='h-12 w-12 flex-shrink-0 rounded-full object-cover'
      />
      <div className='ml-4 flex-grow overflow-hidden'>
        <div className='mb-2 flex flex-col'>
          <span className='block break-words text-lg font-semibold text-gray-800 dark:text-gray-200'>
            {friendInfo?.fullName}
          </span>
          <span className='break-words text-sm text-gray-500 dark:text-gray-400'>
            Email: <strong>{friendInfo?.email}</strong>
          </span>
          <p className='mt-1 break-words text-sm text-gray-600 dark:text-gray-300'>
            Đã trở thành bạn bè từ {createdAt}
          </p>
        </div>
        <button
          className='relative mt-2 flex items-center justify-center rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
          onClick={handleRemoveClick}
        >
          <FiUserX size={20} className='mr-2' />
          <span>Remove</span>
        </button>
        {isDropdownVisible && (
          <div
            ref={dropdownRef}
            className='absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-gray-600 dark:bg-gray-700'
          >
            <p className='mb-2 text-sm text-gray-800 dark:text-gray-200'>Are you sure?</p>
            <div className='flex justify-end'>
              <button
                className='mr-2 rounded bg-gray-300 px-2 py-1 text-sm text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300'
                onClick={() => setIsDropdownVisible(false)}
              >
                Cancel
              </button>
              <button
                className='rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                onClick={() => handleUnfriendConfirm(friendShipId)}
              >
                Unfriend
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendInfo

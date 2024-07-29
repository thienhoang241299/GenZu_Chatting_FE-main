import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import userService from '../../../services/userService'
import {
  setToastMessage,
  setNewFriendRequestNotification,
  sendReplyFriendRequest,
} from '../../../redux/Slice/userSlice'
import { useDispatch } from 'react-redux'

const UserInfoFriendRequest = ({ userInfo, requestId, onRequestHandled }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleAcceptFriendRequest = async (requestId) => {
    setIsLoading(true)
    try {
      const response = await userService.acceptFriendRequest(requestId)
      dispatch(sendReplyFriendRequest(response?.data))
      dispatch(setToastMessage(t('accept_friend_req')))
      onRequestHandled(userInfo?._id)
    } catch (error) {
      console.error('Failed to accept friend request', error)
      dispatch(setToastMessage('Failed to accept friend request'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelFriendRequest = async (requestId) => {
    setIsLoading(true)
    try {
      const response = await userService.rejectFriendRequest(requestId)
      dispatch(setNewFriendRequestNotification(response?.data))
      dispatch(setToastMessage(t('decline_friend_req')))
      onRequestHandled(userInfo?._id)
      return response
    } catch (error) {
      console.error('Failed to cancel friend request', error)
      dispatch(setToastMessage('Failed to cancel friend request'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <li
      key={userInfo?._id}
      className='flex items-center justify-between rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'
    >
      <img
        src={userInfo?.picture}
        alt='user avatar'
        className='h-12 w-12 rounded-full object-cover'
      />
      <div className='ml-4 flex-1'>
        <span className='block font-medium text-gray-800 dark:text-gray-200'>
          {userInfo?.fullName}
        </span>
        <div className='mt-2 flex sm:flex-col sm:mb-4 lg:flex lg:flex-row lg:mr-2 lg:space-x-2'>
          <button
            className='rounded border-b-2 border-b-blue-500 px-3 py-1 mr-2 text-blue-500 hover:bg-red-600 hover:text-white sm:mb-2 sm:pr-2'
            onClick={() => {
              handleCancelFriendRequest(requestId)
            }}
          >
            {isLoading ? t('loading') : t('cancel')}
          </button>
          <button
            className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:mb-2 sm:pr-2'
            onClick={() => handleAcceptFriendRequest(requestId)}
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('accept')}
          </button>
        </div>
        {/* {message && <ToastMessage message={message} />} */}
      </div>
    </li>
  )
}

export default UserInfoFriendRequest

import axios from 'axios'
import './PopUpFindFriends.scss'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getCookie } from '../../../services/Cookies'
import { MdPersonSearch } from 'react-icons/md'
import { IoPersonAdd } from 'react-icons/io5'
import { RiUserSharedFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RiUserSearchLine } from 'react-icons/ri'
import { alertFriendRequest } from '../../../redux/Slice/userSlice'
import userService from '@/services/userService'
import { useTranslation } from 'react-i18next'

export default function PopUpFindFriends({ isVisible, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [message, setMessage] = useState({ text: '', isSuccess: true })
  const [sentRequests, setSentRequests] = useState({})
  const friendLists = useSelector((state) => state?.user?.lsFriends) || []
  const popupRef = useRef()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const handleSearch = useCallback(async () => {
    try {
      const token = JSON.parse(getCookie('userLogin')).accessToken
      const response = await axios.get(
        `https://genzu-chatting-be.onrender.com/users/searchUsers?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        },
      )
      setSearchResult(response.data)
    } catch (error) {
      setMessage({ text: error.message, isSuccess: false })
    }
  }, [searchTerm])

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSearch()
    }
  }

  const fetchSentRequests = useCallback(async () => {
    const response = await userService.getFriendRequestHasBeenSent()
    const requests = response?.data.reduce((acc, request) => {
      acc[request.receiver] = { _id: request._id, status: request.status }
      return acc
    }, {})
    setSentRequests(requests)
  }, [])

  const handleSendFriendRequest = useCallback(async (userID) => {
    try {
      const response = await userService.sendFriendRequest(userID)
      if (response.statusCode === 201) {
        const friendRequestID = response?.data?.data?._id
        setMessage({ text: 'Friend request sent successfully!', isSuccess: true })
        setSentRequests((prevRequests) => ({
          ...prevRequests,
          [userID]: { _id: friendRequestID, status: 'pending' },
        }))
        dispatch(alertFriendRequest(response?.data?.data))
        setTimeout(() => setMessage({ text: '', isSuccess: true }), 2000)
      }
    } catch (error) {
      setMessage({ text: 'Friend request already sent!', isSuccess: false })
      setTimeout(() => setMessage({ text: '', isSuccess: true }), 2000)
    }
  }, [])

  const handleCancelFriendRequest = useCallback(
    async (userID) => {
      try {
        const requestId = sentRequests[userID]._id
        const response = await userService.deleteFriendRequestHasBeenSent(requestId)
        if (response.statusCode === 201) {
          setMessage({ text: 'Friend request cancelled successfully!', isSuccess: true })
          setSentRequests((prevRequests) => {
            const updatedRequests = { ...prevRequests }
            delete updatedRequests[userID]
            return updatedRequests
          })
          setTimeout(() => setMessage({ text: '', isSuccess: true }), 2000)
        }
      } catch (error) {
        setMessage({ text: 'Failed to cancel friend request!', isSuccess: false })
        setTimeout(() => setMessage({ text: '', isSuccess: true }), 2000)
      }
    },
    [sentRequests],
  )

  const handleFriendRequest = useCallback(
    (userID) => {
      if (sentRequests[userID] && sentRequests[userID]?.status === 'pending') {
        handleCancelFriendRequest(userID)
      } else {
        handleSendFriendRequest(userID)
      }
    },
    [handleCancelFriendRequest, handleSendFriendRequest, sentRequests],
  )

  useEffect(() => {
    if (isVisible) {
      fetchSentRequests()
    }
  }, [isVisible, fetchSentRequests])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!isVisible) {
    return null
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div
        ref={popupRef}
        className='relative mx-2 flex h-[28rem] w-[28rem] flex-col justify-around rounded-lg bg-white p-6 shadow-lg'
      >
        <h1>{t('find_friends')}</h1>
        <button
          className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
          onClick={onClose}
        >
          &times;
        </button>

        <div className='relative mx-2 mt-10 h-4/5 max-w-md rounded-lg bg-slate-50 p-6 shadow-xl'>
          {
            <div
              className={`${
                message.text !== '' ? 'opacity-100' : 'opacity-0'
              } absolute -top-10 z-50 my-2 box-content flex justify-between rounded border px-3 py-2 ${
                message.isSuccess
                  ? 'border-green-400 bg-green-200 text-green-700'
                  : 'border-red-400 bg-red-200 text-red-700'
              }`}
              role='alert'
            >
              <span className='block sm:inline'>{message.text}</span>
            </div>
          }
          <div className='flex justify-between'>
            <input
              type='text'
              className='w-5/6 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Enter search term'
            />
            <button onClick={handleSearch} className='ml-2'>
              <RiUserSearchLine size={24} />
            </button>
          </div>

          {searchResult.user && (
            <ul className='no-scrollbar mt-4 h-4/5 overflow-y-auto'>
              {searchResult?.user?.map((user, index) => {
                const isFriend = friendLists.some((friend) => friend?.info?._id === user._id)
                return (
                  <div
                    key={index}
                    className='flex items-center justify-between border-b border-gray-200'
                  >
                    <div>
                      <li>{user.fullName}</li>
                      <li className='py-2'>{user.email}</li>
                    </div>
                    {!isFriend && (
                      <button onClick={() => handleFriendRequest(user._id)}>
                        {sentRequests[user._id]?.status === 'pending' ? (
                          <RiUserSharedFill size={24} color='blue' />
                        ) : (
                          <IoPersonAdd size={24} color='green' />
                        )}
                      </button>
                    )}
                  </div>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

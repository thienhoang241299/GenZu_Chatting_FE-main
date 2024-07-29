import { useParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { alertFriendRequest } from '@/redux/Slice/userSlice'
import userService from '@/services/userService'
import { useDispatch } from 'react-redux'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

const ProfilePage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [message, setMessage] = useState({ text: '', isSuccess: true })
  const [sentRequests, setSentRequests] = useState({})
  const [user, setUser] = useState(null)
  const [isFriend, setIsFriend] = useState(false)
  const [requestSent, setRequestSent] = useState(false) // State to track if friend request has been sent

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(id)
        setUser(response.user)
        response?.relationShip === 'Not a friend yet' ? setIsFriend(false) : setIsFriend(true)
      } catch (error) {
        console.error('Failed to fetch user', error)
      }
    }
    fetchUser()
  }, [id])

  const handleSendFriendRequest = useCallback(
    async (userID) => {
      try {
        const response = await userService.sendFriendRequest(userID)
        if (response.statusCode === 201) {
          const friendRequestID = response?.data?._id
          setMessage({ text: 'Friend request sent successfully!', isSuccess: true })
          setSentRequests((prevRequests) => ({
            ...prevRequests,
            [userID]: { _id: friendRequestID, status: 'pending' },
          }))
          dispatch(alertFriendRequest())
          setTimeout(() => setMessage({ text: '', isSuccess: true }), 2000)
          setRequestSent(true) // Mark that friend request has been sent
        }
      } catch (error) {
        setMessage({ text: 'Friend request already sent!', isSuccess: false })
        setTimeout(() => setMessage({ text: '', isSuccess: true }), 2000)
      }
    },
    [dispatch],
  )

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      {user ? (
        <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
          <div className='flex flex-col items-center'>
            <img
              src={user?.picture}
              alt='User avatar'
              className='mb-4 h-24 w-24 rounded-full object-cover'
            />
            <h2 className='text-2xl font-semibold'>{user.fullName}</h2>
            <p className='text-gray-600'>{user?.email}</p>
            <p className='text-gray-600'>{user?.phoneNumber}</p>
            <p className='text-gray-600'>{user?.address}</p>
            {isFriend ? (
              <button
                disabled
                className='mt-4 w-full rounded bg-gray-400 px-4 py-2 font-semibold text-white'
              >
                Friend Already
              </button>
            ) : requestSent ? (
              <button
                disabled
                className='mt-4 w-full rounded bg-gray-400 px-4 py-2 font-semibold text-white'
              >
                Sent
              </button>
            ) : (
              <button
                onClick={() => handleSendFriendRequest(user?._id)}
                className='mt-4 w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-blue-600'
              >
                Add Friend
              </button>
            )}
            {message.text && (
              <div
                className={`mt-4 flex items-center ${
                  message.isSuccess ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {message.isSuccess ? (
                  <FiCheckCircle className='mr-2' />
                ) : (
                  <FiXCircle className='mr-2' />
                )}
                <span>{message.text}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ProfilePage

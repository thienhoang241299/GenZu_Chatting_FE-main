import React, { useEffect, useState, useRef } from 'react'
import userService from '@/services/userService'
import { useParams } from 'react-router-dom'
import { MdOutlineClose } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { addNewMemberToGroup } from '@/redux/Slice/userSlice'

const AddNewMember = ({ isVisible, onClose }) => {
  const [loading, setLoading] = useState(true)
  const [friends, setFriends] = useState([])
  const [groupMembers, setGroupMembers] = useState([])
  const [addedMembers, setAddedMembers] = useState(new Set()) // State to track added members
  const dispatch = useDispatch()
  const { idConversation } = useParams()
  const popupRef = useRef()
  const listFriends = useSelector((state) => state.user.lsFriends)

  useEffect(() => {
    const fetchFriends = () => {
      try {
        if (!Array.isArray(listFriends)) {
          console.error('Unexpected data format:', listFriends)
          return
        }

        const friendsNotInGroup = listFriends.reduce((acc, item) => {
          const { info: friend, createdAt, friendShip: friendshipId, groupConversation } = item
          const isNotInGroup = !groupConversation.some((gc) => gc?._id === idConversation)

          if (isNotInGroup) {
            acc.push({ friend, createdAt, friendshipId, groupConversation })
          }

          return acc
        }, [])

        setFriends(friendsNotInGroup)
      } catch (error) {
        console.error('Failed to process friends:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [listFriends, idConversation])

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

  const handleAddToGroup = (friend, idUser, idConversation) => {
    dispatch(addNewMemberToGroup({ groupId: idConversation, users: [idUser] }))
    // Remove the added friend from the list
    setFriends((prevFriends) => prevFriends.filter((f) => f.friend?._id !== idUser))
  }

  if (!isVisible) return null

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div
          className='relative max-h-screen w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg'
          ref={popupRef}
        >
          <button
            className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
            onClick={onClose}
          >
            <MdOutlineClose size={24} />
          </button>
          <h2 className='mb-4 text-2xl font-bold'>Add New Member</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className='space-y-4'>
              {friends.map((friend, index) => (
                <li
                  key={index}
                  className='flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow'
                >
                  <div className='flex items-center'>
                    <img
                      src={friend?.friend?.picture}
                      alt={friend?.friend?.fullName}
                      className='mr-4 h-10 w-10 rounded-full'
                    />
                    <div>
                      <p className='font-semibold'>{friend?.friend?.fullName}</p>
                      <p className='text-sm text-gray-500'>{friend?.friend?.email}</p>
                    </div>
                  </div>
                  <button
                    className={`rounded-lg px-4 py-2 text-white ${
                      addedMembers.has(friend.friend?._id)
                        ? 'cursor-not-allowed bg-gray-500'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={() => handleAddToGroup(friend, friend.friend?._id, idConversation)}
                    disabled={addedMembers.has(friend.friend?._id)}
                  >
                    {addedMembers.has(friend.friend?._id) ? 'Added' : 'Add to Group'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default AddNewMember

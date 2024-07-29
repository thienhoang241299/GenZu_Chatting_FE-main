import { useRef, useState, useEffect } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { removeMemberFromGroup, exchangeAdminGroup } from '@/redux/Slice/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from '@/services/Cookies'
import { useParams } from 'react-router-dom'

const ViewMember = ({ members, onClose, isVisible, groupAdminId }) => {
  const { idConversation } = useParams()
  const popupRef = useRef()
  const dispatch = useDispatch()
  const currentUser = JSON.parse(getCookie('userLogin'))?.user
  const isCurrentUserAdmin = currentUser?._id === groupAdminId

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

  const handleRemoveMember = (idConversation, idMember) => {
    const groupId = idConversation
    const memberId = idMember
    dispatch(removeMemberFromGroup({ groupId, memberId }))
  }

  const exchangeAdmin = (idConversation, exchangeAdminId) => {
    const groupId = idConversation
    const exchangeAdmin = exchangeAdminId
    dispatch(exchangeAdminGroup({ groupId, exchangeAdmin }))
  }

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div
          className='relative h-screen w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-[#333333]'
          ref={popupRef}
        >
          <button
            className='absolute right-2 top-2 text-gray-500 transition-colors hover:text-gray-700'
            onClick={onClose}
          >
            <MdOutlineClose size={24} />
          </button>
          <h2 className='mb-6 text-center text-2xl font-bold dark:text-white'>All Members</h2>
          <ul className='space-y-4'>
            {members.map((member, index) => (
              <li
                key={index}
                className='flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow transition-shadow hover:shadow-md'
              >
                <div className='flex items-center'>
                  <img
                    src={member?.picture}
                    alt={member?.fullName}
                    className='mr-4 h-12 w-12 rounded-full object-cover'
                  />
                  <div>
                    <p className='font-semibold text-gray-800'>{member?.fullName}</p>
                    <p className='text-sm text-gray-500'>{member?.email}</p>
                  </div>
                </div>

                {member._id === groupAdminId ? (
                  <p className='text-sm font-medium text-green-600'>Group Admin</p>
                ) : isCurrentUserAdmin ? (
                  <div className='flex space-x-2'>
                    <button
                      className='rounded-lg bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-yellow-400'
                      onClick={() => exchangeAdmin(idConversation, member?._id)}
                    >
                      Make Admin
                    </button>
                    <button
                      className='rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-400'
                      onClick={() => handleRemoveMember(idConversation, member?._id)}
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default ViewMember

import { useEffect, useRef, useState } from 'react'

import { getCookie } from '@/services/Cookies'
import { CgMoreO, CgProfile } from 'react-icons/cg'
import DropdownItem from '../DropdownItem/DropdownItem'
import { MdBlock, MdOutlineDelete, MdPhone, MdVideocam } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setConversation } from '@/redux/Slice/userSlice'
import { createNewConversation, setIsCreateNewConversation } from '@/redux/Slice/chatSlice'
import noImage from '../../../assets/noImage.jpg'

export default function SearchFriends({ user }) {
  const [isOptionBtnClick, setIsOptionBtnClick] = useState(false)
  const [isCreateNewConversation, setCreateNewConversation] = useState(false)
  const isCreateConversationSucces = useSelector((state) => state.chat.isCreateNewConversation)
  const conversation = useSelector((state) => state.user.lsConversation[0])
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isActive, SetIsActive] = useState(true)
  const handleMoreClick = (e) => {
    e.preventDefault()
    setIsOptionBtnClick(!isOptionBtnClick)
  }

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsOptionBtnClick(false)
    }
  }
  const handleUserClick = (id) => {
    navigate(`/chat/${id}`)

    dispatch(setConversation(id))
  }
  const handleUserNoConversationClcik = (id) => {
    setCreateNewConversation(true)
    dispatch(createNewConversation(id))
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  useEffect(() => {
    if (isCreateConversationSucces != null) {
      navigate(`/chat/${conversation._id}`)
      dispatch(setIsCreateNewConversation(false))
    }
  }, [isCreateConversationSucces])

  return (
    <>
      {console.log(user)}
      {user.isChat === false ? (
        <p>User không trong cuộc trò chuyện</p>
      ) : user?.conversation?.length > 0 ? (
        <div
          onClick={() => {
            handleUserClick(user.conversation[0]._id)
          }}
          className={`group relative flex cursor-pointer items-center space-x-4 p-2 ${isActive ? 'bg-[#74CDFF]' : 'hover:bg-[#74CDFF]'
            } mb-1 rounded-lg`}
        >
          <img
            src={
              !user.conversation[0]?.isGroupChat
                ? user.conversation[0].users[0]?._id == JSON.parse(getCookie('userLogin')).user._id
                  ? user.conversation[0].users[1]?.picture
                  : user.conversation[0].users[0]?.picture
                : user.conversation[0]?.avatar != null
                  ? user.conversation[0]?.avatar
                  : `https://i.pinimg.com/736x/e8/13/74/e8137457cebc9f60266ffab0ca4e83a6.jpg`
            }
            alt='user avatar'
            className='h-12 w-12 rounded-full object-cover'
          // onError={(e) => {
          //   e.target.src = { noImage }
          // }}
          />

          <div className='flex w-full flex-col gap-2 truncate dark:text-white'>
            <h3 className='truncate text-sm font-semibold'>
              {!user.conversation[0].isGroupChat
                ? user.conversation[0].users[0]._id == JSON.parse(getCookie('userLogin')).user._id
                  ? user.conversation[0].users[1]?.fullName
                  : user.conversation[0].users[0]?.fullName
                : user.conversation[0].chatName}
            </h3>
            <p className='truncate text-sm text-gray-500 dark:text-slate-500'>
              {user.conversation[0]?.latestMessage?.message}
            </p>
          </div>
          <div
            className={`absolute right-2 top-1/2 -translate-y-1/2 transform transition-opacity ${isOptionBtnClick ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            ref={buttonRef}
            onClick={handleMoreClick}
          >
            <CgMoreO className='h-5 w-5 text-gray-500 hover:text-gray-800 dark:text-white' />
          </div>
          {isOptionBtnClick && (
            <div
              className='absolute right-0 top-0 z-10 mt-12 w-52 rounded-lg border bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
              ref={dropdownRef}
            >
              {/* <div className="absolute left-48 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" /> */}
              <ul>
                <DropdownItem
                  icon={CgProfile}
                  label={'Xem trang cá nhân'}
                  onClick={() => { }}
                  dropdownStyle={'mt-[7px] p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                />
                <hr />
                <DropdownItem
                  icon={MdPhone}
                  label={'Gọi thoại'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
                <DropdownItem
                  icon={MdVideocam}
                  label={'Chat video'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
                <hr />
                <DropdownItem
                  icon={MdBlock}
                  label={'Chặn'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
                <DropdownItem
                  icon={MdOutlineDelete}
                  label={'Delete chat'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => {
            handleUserNoConversationClcik(user?.info?._id)
          }}
          className={`group relative flex cursor-pointer items-center space-x-4 p-2 ${isActive ? 'bg-[#74CDFF]' : 'hover:bg-[#74CDFF]'
            } mb-1 rounded-lg ${isCreateNewConversation ? 'disabled' : ''}`}
        >
          <img
            src={user?.info?.picture || noImage}
            alt='user avatar'
            className='h-12 w-12 rounded-full object-cover'
          // onError={(e) => {
          //   e.target.src = { noImage }
          // }}
          />

          <div className='flex w-full flex-col gap-2 truncate dark:text-white'>
            <h3 className='truncate text-sm font-semibold'>{user?.info?.fullName}</h3>
          </div>
          <div
            className={`absolute right-2 top-1/2 -translate-y-1/2 transform transition-opacity ${isOptionBtnClick ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            ref={buttonRef}
            onClick={handleMoreClick}
          >
            <CgMoreO className='h-5 w-5 text-gray-500 hover:text-gray-800 dark:text-white' />
          </div>
          {isOptionBtnClick && (
            <div
              className='absolute right-0 top-0 z-10 mt-12 w-52 rounded-lg border bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
              ref={dropdownRef}
            >
              {/* <div className="absolute left-48 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" /> */}
              <ul>
                <DropdownItem
                  icon={CgProfile}
                  label={'Xem trang cá nhân'}
                  onClick={() => { }}
                  dropdownStyle={'mt-[7px] p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                />
                <hr />
                <DropdownItem
                  icon={MdPhone}
                  label={'Gọi thoại'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
                <DropdownItem
                  icon={MdVideocam}
                  label={'Chat video'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
                <hr />
                <DropdownItem
                  icon={MdBlock}
                  label={'Chặn'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
                <DropdownItem
                  icon={MdOutlineDelete}
                  label={'Delete chat'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  )
}

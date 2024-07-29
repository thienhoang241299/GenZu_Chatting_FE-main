import { CgMoreO } from 'react-icons/cg'
import userIcon from '../../../assets/user_icon.jpg'
import { useRef, useState, useEffect, useLayoutEffect, memo } from 'react'
import { MdPhone, MdVideocam, MdBlock, MdOutlineDelete } from 'react-icons/md'
import { IoAlert } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import DropdownItem from '../DropdownItem/DropdownItem'
import { getCookie } from '@/services/Cookies'
import { useDispatch, useSelector } from 'react-redux'
import { deleteConversation } from '@/redux/Slice/messageSlice'
import { TbPointFilled } from 'react-icons/tb'
import ViewProfile from '@/components/PopUp/ViewProfile/ViewProfile'
import { getUserBlocked, handleBlockUser } from '@/redux/Slice/userSlice'
import { useNavigate, useParams } from 'react-router-dom'
import noImage from '../../../assets/noImage.jpg'

const UserCard = ({ user, isActive, onUserCardClick, togglePopupViewProfile }) => {
  const [isOptionBtnClick, setIsOptionBtnClick] = useState(false)
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { idConversation } = useParams()
  const isDeleteConversation = useSelector((state) => state.message.isDeleteConversation)
  const isDeleteGroupChat = useSelector((state) => state.user.isDeleteGroupChat)
  const lsConversation = useSelector((state) => state.user?.lsConversation)
  const userId = JSON.parse(getCookie('userLogin')).user._id
  const lstBlockUser = useSelector((state) => state.user.lstBlockUsers)
  const idUserBlocked =
    lstBlockUser?.length != 0
      ? lstBlockUser?.find((item) => item._id === user.id)
      : user.userBlocked?.find((item) => item === userId)
  const handleBlockBtn = (event) => {
    const item = {
      user,
      type: idUserBlocked ? 'unBlock' : 'block',
    }
    dispatch(handleBlockUser(item))
  }

  const handleDeleteBtn = () => {
    dispatch(deleteConversation(user))
  }

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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  useEffect(() => {
    if (isDeleteConversation || isDeleteGroupChat) {
      console.log('haha')
      if (idConversation == lsConversation[0]._id) {
        navigate(`/chat/${lsConversation[1]?._id}`)
      } else {
        navigate(`/chat/${lsConversation[0]?._id}`)
      }
    }
  }, [isDeleteConversation, isDeleteGroupChat])
  useLayoutEffect(() => {
    dispatch(getUserBlocked())
  }, [])
  return (
    <>
      <div
        onClick={onUserCardClick}
        className={`group relative flex cursor-pointer items-center space-x-4 p-2 ${isActive ? 'bg-[#74CDFF]' : 'hover:bg-[#74CDFF]'
          } mb-1 rounded-lg ${!user.isRead ? 'border-2 border-blue-400' : ''}`}
      >
        <div className='relative h-14 w-20'>
          <img
            src={user.picture || noImage}
            alt='user avatar'
            className='h-14 w-14 rounded-full object-cover'
          // onError={(e) => {
          //   e.target.src = { noImage }
          // }}
          />
          <TbPointFilled
            size={22}
            className={`absolute bottom-0 right-0 ${user.is_online == null ? 'hidden' : user.is_online ? 'text-green-500' : 'text-gray-500'}`}
          />
        </div>
        <div className='flex w-full flex-col gap-2 truncate dark:text-white'>
          <h3 className='truncate text-sm font-semibold'>{user.name}</h3>
          <p className='truncate text-sm text-gray-500 dark:text-slate-500'>{user.latestMessage}</p>
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
            {idUserBlocked === userId ? (
              <ul>
                <DropdownItem
                  icon={IoAlert}
                  label={'Bạn tạm thời không thể liên lạc được với người này'}
                  onClick={() => { }}
                  dropdownStyle={'mt-[7px] p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                />
              </ul>
            ) : (
              <ul>
                <DropdownItem
                  icon={CgProfile}
                  label={'Xem trang cá nhân'}
                  onClick={togglePopupViewProfile}
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
                  label={'Gọi video'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={() => { }}
                />
                <hr />
                <DropdownItem
                  icon={MdBlock}
                  label={idUserBlocked ? 'Bỏ Chặn' : 'Chặn'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={handleBlockBtn}
                />
                <DropdownItem
                  icon={MdOutlineDelete}
                  label={'Xóa đoạn hội thoại'}
                  dropdownStyle={'p-2'}
                  iconStyle={'h-9 w-9 p-2'}
                  onClick={handleDeleteBtn}
                />
              </ul>
            )}
          </div>
        )}
      </div>

      {/* {isViewProfileClick && <ViewProfile user={user} onClose={togglePopupViewProfile} />} */}
    </>
  )
}

export default memo(UserCard)

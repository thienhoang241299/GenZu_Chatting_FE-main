import { memo, useEffect, useState } from 'react'
import UserCard from '../UserCard/UserCard'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import UserCardSkeleton from '../UserCard/UserCardSkeleton/UserCardSkeleton'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setConversation } from '@/redux/Slice/userSlice'
import SearchFriends from '../SearchFriends/SearchFriends'
import { getCookie } from '@/services/Cookies'
import { resetMessageSlice } from '@/redux/Slice/messageSlice'

const UserList = ({ togglePopupViewProfile }) => {
  const [activeTab, setActiveTab] = useState('personal')
  const { t } = useTranslation()
  const [activeUserID, setActiveUserID] = useState(null)
  const navigate = useNavigate()
  const groupChats = useSelector((state) => state.user.lsGroupChats)
  const lsChats = useSelector((state) => state.user.lsPersonalChats)
  const lsConversation = useSelector((state) => state.user.lsConversation)
  const conversation = useSelector((state) => state.user.conversation)
  const lsFriends = useSelector((state) => state.user.lsFriends)
  const idConversation = useParams()
  const dispatch = useDispatch()
  const handleUserClick = (id) => {
    navigate(`/chat/${id}`)
    dispatch(resetMessageSlice())
    setActiveUserID(id)
    if (!conversation) {
      dispatch(setConversation(id))
    }
  }

  // useEffect(() => {
  //   if (groupChats.length > 0 ) {
  //     navigate(`/chat/${groupChats[0]._id}`)
  //   }
  // }, [groupChats.length])

  return (
    <section className='h-full w-full'>
      {console.log('groupchats', groupChats)}
      <div className='mt-4 flex'>
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 rounded-bl-xl rounded-tl-xl border p-2 text-center ${activeTab === 'personal'
            ? 'border-blue-300 bg-blue-300 text-black shadow-lg dark:text-white'
            : 'border-gray-300 bg-white text-black'
            }`}
        >
          {t('personal_chat')}
        </button>
        <button
          onClick={() => setActiveTab('group')}
          className={`flex-1 rounded-br-xl rounded-tr-xl border p-2 text-center ${activeTab === 'group'
            ? 'border-blue-300 bg-blue-300 text-black shadow-lg dark:text-white'
            : 'border-gray-300 bg-white text-black'
            }`}
        >
          {t('group_chat')}
        </button>
      </div>
      <div className='no-scrollbar mt-4 h-full overflow-y-auto text-black'>
        {lsChats.length == 0 && groupChats.length == 0 ? (
          lsConversation != null ? (
            lsFriends.length > 0 ? (
              lsFriends?.map((item, index) => {
                return <SearchFriends key={index} user={item} />
              })
            ) : (
              <h1>Khong co ban be</h1>
            )
          ) : (
            <UserCardSkeleton />
          )
        ) : (
          <>
            {activeTab === 'personal' &&
              lsChats.map((item) => {
                let userInfo
                if (item.users[0]?._id == JSON.parse(getCookie('userLogin')).user._id) {
                  userInfo = {
                    idConversation: item._id,
                    id: item.users[1]?._id,
                    name: item.users[1]?.fullName,
                    picture: item.users[1]?.picture,
                    is_online: item.users[1]?.is_online,
                    latestMessage: item?.latestMessage?.message,
                    isGroupChat: false,
                    isRead:
                      item?.latestMessage?.readBy?.findIndex(
                        (id) => id == JSON.parse(getCookie('userLogin')).user._id,
                      ) >= 0
                        ? true
                        : false,
                    userBlocked: item?.blockedUsers,
                  }
                } else {
                  userInfo = {
                    idConversation: item._id,
                    id: item.users[0]?._id,
                    name: item.users[0]?.fullName,
                    picture: item.users[0]?.picture,
                    is_online: item.users[0]?.is_online,
                    latestMessage: item?.latestMessage?.message,
                    isGroupChat: false,
                    isRead:
                      item?.latestMessage?.readBy?.findIndex(
                        (id) => id == JSON.parse(getCookie('userLogin')).user._id,
                      ) >= 0
                        ? true
                        : false,
                    userBlocked: item?.blockedUsers,
                  }
                }
                return (
                  <UserCard
                    user={userInfo}
                    key={item._id}
                    isActive={activeUserID === item._id}
                    onUserCardClick={() => handleUserClick(item._id)}
                    togglePopupViewProfile={togglePopupViewProfile}
                  />
                )
              })}
            {activeTab === 'group' &&
              groupChats.map((item) => {
                const userInfo = {
                  name: item?.chatName,
                  picture:
                    item.avatar != null
                      ? item.avatar
                      : `https://i.pinimg.com/736x/e8/13/74/e8137457cebc9f60266ffab0ca4e83a6.jpg`,
                  isGroupChat: true,
                  latestMessage: item?.latestMessage?.message,
                  is_online: null,
                  isRead:
                    item?.latestMessage?.readBy?.findIndex(
                      (id) => id == JSON.parse(getCookie('userLogin')).user._id,
                    ) >= 0
                      ? true
                      : false,
                }
                return (
                  <UserCard
                    user={userInfo}
                    key={item._id}
                    isActive={activeUserID === item._id}
                    onUserCardClick={() => handleUserClick(item._id)}
                  />
                )
              })}
          </>
        )}
      </div>
    </section>
  )
}

export default memo(UserList)

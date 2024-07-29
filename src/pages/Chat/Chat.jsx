import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import ChatBody from '../../components/ChatPage/ChatBody/ChatBody'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import InformationConversation from '../../components/ChatPage/InformationConversation/InformationConversation'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate, useParams } from 'react-router-dom'
import { getMessagesById } from '../../redux/Slice/messageSlice'
import {
  clearToastMessage,
  getFriends,
  getFriendsAndConversation,
  getLsConversation,
  loginSlice,
  setConversation,
  setIdConversation,
  setToastMessage,
} from '@/redux/Slice/userSlice'
import { connectSocket, resetChat, setListSearch, watchMessageSlice } from '@/redux/Slice/chatSlice'
import { checkCookie, getCookie } from '@/services/Cookies'
import LoadingSpinner from './ChatSkeleton/ChatSkeleton'
import NoConversations from './NoConversation/NoConversation'
import ViewProfile from '@/components/PopUp/ViewProfile/ViewProfile'
import SearchBar from '@/components/ChatPage/InformationConversation/SearchBar/SearchBar'

function Chat() {
  const [isViewProfileClick, setIsViewProfileClick] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [idMessage, setIdMessage] = useState('')

  const dispatch = useDispatch()
  const isSearchMessage = useSelector((state) => state.message.isSearchMessage)

  const toastMessage = useSelector((state) => state?.user?.toastMessage)
  const friendRequestNotification =
    useSelector((state) => state?.user?.friendRequestNotification) || []
  const getStatusFriendRequest = friendRequestNotification.length
    ? friendRequestNotification.at(-1)
    : null
  const navigate = useNavigate()
  const idConversation = useParams()
  const conversation = useSelector((state) => state.user.conversation)
  const lsConversation = useSelector((state) => state.user.lsConversation)
  const [user, setUser] = useState()
  const toastRef = useRef(null)
  const idConversationPreventive = useSelector((state) => state.user.idConversation)

  const togglePopupViewProfile = () => {
    setIsViewProfileClick(!isViewProfileClick)
    if (!isViewProfileClick && conversation) {
      setUser(
        !conversation?.isGroupChat
          ? conversation.users[0]?._id === JSON.parse(getCookie('userLogin'))?.user?._id
            ? conversation?.users[1]
            : conversation?.users[0]
          : conversation?.avatar != null
            ? conversation?.avatar
            : '',
      )
    }
  }

  const handleSetMsgId = (id) => {
    setIdMessage(id)
  }

  useLayoutEffect(() => {
    if (!checkCookie()) {
      dispatch(setIdConversation(null))
      window.location.href = '/'
    }
  })
  useEffect(() => {
    if (checkCookie()) {
      const sessionId = JSON.parse(getCookie('userLogin')).user._id
      if (getStatusFriendRequest?.sender?._id === sessionId) {
        if (getStatusFriendRequest?.status === 'accepted' && toastRef.current !== 'accepted') {
          dispatch(setToastMessage('Your friend request was accepted'))
          toastRef.current = 'accepted'
        } else if (
          getStatusFriendRequest?.status === 'declined' &&
          toastRef.current !== 'declined'
        ) {
          dispatch(setToastMessage('Your friend request was declined'))
          toastRef.current = 'declined'
        }
      }
    }
  }, [getStatusFriendRequest, dispatch])

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }
  //**// */
  useLayoutEffect(() => {
    if (checkCookie()) {
      dispatch(connectSocket(idConversation))
      dispatch(getFriendsAndConversation())
    }
  }, [idConversation])
  useLayoutEffect(() => {
    console.log(lsConversation)
    if (checkCookie() && idConversation.idConversation !== 'undefined') {
      dispatch(getMessagesById(idConversation))
      dispatch(setIdConversation(idConversation.idConversation))
      dispatch(resetChat())
    }
  }, [idConversation, lsConversation])

  //**// */
  useEffect(() => {
    if (checkCookie() && idConversation.idConversation !== 'undefined') {
      dispatch(loginSlice(JSON.parse(getCookie('userLogin'))?.user._id))
      dispatch(watchMessageSlice())
    }
  }, [dispatch, idConversation])
  ///
  useEffect(() => {
    if (lsConversation && checkCookie()) {
      dispatch(setConversation(idConversation))
    }
  }, [lsConversation, idConversation])
  ///
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToastMessage()) // Clear the toast message after 2 seconds
        toastRef.current = null
        // toastRef.current = null // Reset the toastRef after clearing the message
      }, 2000)
      return () => clearTimeout(timer) // Cleanup the timer on unmount
    }
  }, [dispatch, toastMessage])
  useEffect(() => {
    if (lsConversation && idConversation.idConversation == 'undefined') {
      if (idConversationPreventive != null) {
        navigate(`/chat/${idConversationPreventive}`)
      }
    }
  }, [idConversationPreventive, idConversation, lsConversation, navigate])

  useEffect(() => {
    if (!isSearchMessage) {
      const data = { data: '' }
      dispatch(setListSearch(data))
    }
  }, [isSearchMessage])

  return (
    <>
      {!checkCookie() ? (
        <LoadingSpinner />
      ) : (
        <div className='fixed w-full'>
          {console.log('check chat component')}
          <div className='Login relative'>
            <main className='flex'>
              <Sidebar togglePopupViewProfile={togglePopupViewProfile} />
              {/* {!conversation ? <LoadingSpinner /> : <ChatBody toggleInfo={toggleInfo} />} */}
              {conversation ? (
                <ChatBody
                  isSearchMessage={isSearchMessage}
                  idMessage={idMessage}
                  toggleInfo={toggleInfo}
                />
              ) : lsConversation == null ? (
                <LoadingSpinner />
              ) : (
                <NoConversations />
              )}
              {showInfo && conversation && !isSearchMessage ? (
                <div className='w-1/3'>
                  <InformationConversation togglePopupViewProfile={togglePopupViewProfile} />
                </div>
              ) : (
                isSearchMessage && (
                  <div className='w-1/3'>
                    <SearchBar
                      handleSetMsgId={handleSetMsgId}
                      isSearchMessage={isSearchMessage}
                      conversation={conversation}
                    />
                  </div>
                )
              )}
            </main>
            {toastMessage && <ToastMessage message={toastMessage} />}
          </div>
          {isViewProfileClick && <ViewProfile user={user} onClose={togglePopupViewProfile} />}
        </div>
      )}
    </>
  )
}

export default memo(Chat)

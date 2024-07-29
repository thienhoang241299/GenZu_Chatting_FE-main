import { useEffect, useLayoutEffect, useState } from 'react'
import { checkCookie } from '../services/Cookies'
import { useNavigate } from 'react-router-dom'
import Login from './Login/Login'
import { useDispatch, useSelector } from 'react-redux'
import { getIdConversation } from '@/redux/Slice/userSlice'
import LoadingSpinner from './Chat/ChatSkeleton/ChatSkeleton'

export default function Home() {
  const navigate = useNavigate()
  const idConversation = useSelector((state) => state.user.idConversation)
  const [isLoading, SetIsLoading] = useState(false)
  const dispatch = useDispatch()
  useLayoutEffect(() => {
    if (checkCookie()) {
      SetIsLoading(true)
      dispatch(getIdConversation())
    }
    // !checkCookie() ?: navigate('/chat/123456')
  }, [dispatch, navigate])
  useEffect(() => {
    if (idConversation !== null) {
      navigate(`/chat/${idConversation}`)
    }
  }, [idConversation])
  return <>{!isLoading ? <Login /> : <LoadingSpinner />}</>
}

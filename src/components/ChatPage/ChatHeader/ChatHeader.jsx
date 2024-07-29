import { SlOptions } from 'react-icons/sl'
import { MdPhone, MdVideocam } from 'react-icons/md'
import { getCookie } from '@/services/Cookies'
import { useSelector } from 'react-redux'
import ChatHeaderSkeleton from './ChatHeaderSkeleton/ChatHeaderSkeleton'
import { useEffect, useState } from 'react'
import noImage from '../../../assets/noImage.jpg'

function ChatHeader({ toggleInfo }) {
  const personalChat = useSelector((state) => state.user.conversation)
  const [customer, setCustomer] = useState(null)
  const [timeOffline, setTimeOffline] = useState('')
  const [offlineTime, setOfflineTime] = useState(null)
  useEffect(() => {
    if (personalChat) {
      setCustomer(
        personalChat.users[0]?._id == JSON.parse(getCookie('userLogin')).user._id
          ? personalChat?.users[1]
          : personalChat?.users[0],
      )
      setOfflineTime(
        personalChat.users[0]?._id == JSON.parse(getCookie('userLogin')).user._id
          ? personalChat.users[1]?.offline_at
          : personalChat.users[0]?.offline_at,
      )
    }
  }, [personalChat])

  useEffect(() => {
    const calculateOfflineTime = () => {
      if (!offlineTime) return

      const offlineDate = new Date(offlineTime)
      const now = new Date()
      const diffInMilliseconds = now - offlineDate

      const minutes = Math.floor(diffInMilliseconds / (1000 * 60))
      const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
      const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

      if (days > 0) {
        setTimeOffline(`${days} day${days > 1 ? 's' : ''}`)
      } else if (hours > 0) {
        setTimeOffline(`${hours} hour${hours > 1 ? 's' : ''}`)
      } else {
        setTimeOffline(`${minutes} minute${minutes > 1 ? 's' : ''}`)
      }
    }

    // Tính toán khi component mount
    calculateOfflineTime()

    // Tính toán lại mỗi phút
    const intervalId = setInterval(calculateOfflineTime, 60000)

    // Clear interval khi component unmount
    return () => clearInterval(intervalId)
  }, [offlineTime])
  return (
    <>
      {personalChat ? (
        <header className='mb-2 flex items-center justify-between rounded-lg bg-mainBlue px-8 py-4 shadow-xl dark:bg-darkTheme'>
          <div className='flex cursor-pointer items-center space-x-4'>
            <img
              src={
                !personalChat.isGroupChat
                  ? customer?.picture ? customer?.picture : noImage
                  : personalChat.avatar != null
                    ? personalChat.avatar
                    : `https://i.pinimg.com/736x/e8/13/74/e8137457cebc9f60266ffab0ca4e83a6.jpg`
              }
              alt='user avatar'
              className='h-16 w-16 rounded-full'
            // onError={(e) => {
            //   e.target.src = { noImage }
            // }}
            />
            <div className='flex flex-col'>
              <span className='text-xl font-semibold text-black dark:text-white md:text-2xl'>
                {!personalChat.isGroupChat ? customer?.fullName : personalChat?.chatName}
              </span>
              {customer?.is_online ? (
                <span className='font-semibold text-green-500 dark:text-green-400'>
                  {!personalChat.isGroupChat ? 'Is Online Now' : ''}
                </span>
              ) : (
                <span className='font-semibold text-gray-500 dark:text-slate-500'>
                  {!personalChat.isGroupChat ? `Active ${timeOffline} ago` : ''}
                </span>
              )}
            </div>
          </div>
          <div className='flex space-x-2 text-black dark:text-white md:space-x-6'>
            <button className='rounded-md p-2 hover:bg-blue-400 dark:hover:bg-[#357ABD]'>
              <MdPhone size={22} />
            </button>
            <button className='rounded-md p-2 hover:bg-blue-400 dark:hover:bg-[#357ABD]'>
              <MdVideocam size={22} />
            </button>
            <button
              className='rounded-md p-2 hover:bg-blue-400 dark:hover:bg-[#357ABD]'
              onClick={toggleInfo}
            >
              <SlOptions size={22} color='' />
            </button>
          </div>
        </header>
      ) : (
        <ChatHeaderSkeleton />
      )}
    </>
  )
}

export default ChatHeader

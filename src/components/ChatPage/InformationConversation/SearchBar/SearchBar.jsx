import { searchMessageById } from '@/redux/Slice/chatSlice'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function SearchBar(props) {
  const [activeUserID, setActiveUserID] = useState(null)

  let lstMessage = useSelector((state) => state.chat.listSearch)

  const dispatch = useDispatch()
  const onSearchClick = (pageMsg, id) => {
    setActiveUserID(id)
    const itemSearchIdMessage = {
      idConversation: props.conversation._id,
      page: pageMsg,
    }
    dispatch(searchMessageById(itemSearchIdMessage))
    props.handleSetMsgId(id)
  }

  return (
    <div className='dark:bg h-screen w-full bg-mainBlue dark:bg-[#333333] dark:opacity-95'>
      <div className='mx-auto flex max-w-2xl flex-col space-x-2 border-b-4'>
        <label className='mb-2 ml-2 font-bold'>Kết quả tìm kiếm</label>
        <p>Danh sách kết quả phù hợp trong hội thoại</p>

        <div className='flex h-screen flex-col space-y-2 overflow-y-auto'>
          {lstMessage ? (
            lstMessage.map((msg, index) => (
              <div key={index} className='mx-2 mt-6 flex flex-col bg-white'>
                <div
                  onClick={() => {
                    onSearchClick(msg.pageNumber, msg._id)
                  }}
                  className={`group relative flex cursor-pointer items-center space-x-4 p-2 ${
                    activeUserID === msg._id ? 'bg-[#74CDFF]' : 'hover:bg-[#74CDFF]'
                  } mb-1 rounded-lg`}
                >
                  <div className='relative h-14 w-20'>
                    <img
                      src={msg.sender.picture}
                      alt='user avatar'
                      className='h-14 w-14 rounded-full object-cover'
                    />
                  </div>
                  <div className='flex w-full flex-col gap-2 truncate dark:text-white'>
                    <h3 className='truncate text-sm font-semibold'>{msg.sender.fullName}</h3>
                    <p className='truncate text-sm text-gray-500 dark:text-slate-500'>
                      {msg.message}
                    </p>
                  </div>
                </div>
                {index == lstMessage.length - 1 && (
                  <div className='h-20 font-light italic'>
                    {' '}
                    <p>Hết rồi đừng kéo nữa :3 </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='mx-2 mt-6 flex flex-col bg-mainBlue dark:bg-transparent'>
              <div className='flex justify-center'>
                <img
                  className='w-24'
                  src='https://www.okcretesolutions.com/wp-content/uploads/search-icon.png'
                />
              </div>
              <h3 className='mt-6 text-center font-medium italic dark:text-white'>
                Không tìm thấy kết quả
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

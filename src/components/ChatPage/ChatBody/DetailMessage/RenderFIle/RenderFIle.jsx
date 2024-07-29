import { getCookie } from '@/services/Cookies'
import React, { memo } from 'react'
import noImage from '../../../../../assets/noImage.jpg'
const RenderMessage = ({ item, autoTranslate }) => {
  const userId = JSON.parse(getCookie('userLogin')).user._id
  const isOwnMessage = item.sender?._id === userId
  const isGroupChat = item.conversation?.isGroupChat

  switch (item.messageType) {
    case 'image':
      return (
        <img
          className='h-auto w-full'
          src={item.message || noImage}
          alt='Uploaded content'
          style={{ width: 'auto', height: '200px' }}
        // onError={(e) => {
        //   e.target.src = { noImage }
        // }}
        />
      )
    case 'audio':
      return <audio className='w-full' controls src={item.message} />
    case 'video':
      return (
        <video
          className='w-full'
          controls
          src={item.message || noImage}
          style={{ width: 'auto', height: '400px' }}
        // onError={(e) => {
        //   e.target.src = { noImage }
        // }}
        />
      )
    case 'file':
      return (
        <a href={item.message} download>
          <img
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAzHuAroNuDhtPXeGxXfL-Idoctgcv2wPggA&s'
            alt='image file'
            style={{ width: '100px', height: 'auto' }}
          />
        </a>
      )
    case 'text':
      return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} relative`}>
          {!isOwnMessage && isGroupChat && (
            <img
              src={item.sender?.picture || noImage}
              alt={item.sender?.fullName}
              className='absolute left-0 top-0 h-8 w-8 rounded-full'
            // onError={(e) => {
            //   e.target.src = { noImage }
            // }}
            />
          )}
          <div
            className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} ${!isOwnMessage && isGroupChat ? 'ml-10' : ''}`}
          >
            {!isOwnMessage && isGroupChat && (
              <span className='mb-1 text-xs text-gray-500'>{item.sender?.fullName}</span>
            )}
            <p className={`${isOwnMessage ? 'text-right' : 'text-left'}`}>{item.message}</p>
          </div>
        </div>
      )
    // case 'notification':
    //   if (item.message === '3001' || item.message === '3006') {
    //     if (item.affected_user_id && item.sender._id === userId && item.conversation.isGroupChat) {
    //       return (
    //         <p>
    //           {'Bạn vừa thêm ' +
    //             item?.affected_user_id?.fullName +
    //             ' vào nhóm ' +
    //             item.conversation?.chatName}
    //         </p>
    //       )
    //     } else if (
    //       item.affected_user_id &&
    //       item.affected_user_id?._id === userId &&
    //       item.conversation?.isGroupChat
    //     ) {
    //       return (
    //         <p>{item.sender?.fullName + ' thêm bạn vào nhóm ' + item.conversation?.chatName}</p>
    //       )
    //     } else if (item.affected_user_id && item.conversation?.isGroupChat) {
    //       return (
    //         <p>
    //           {item.sender?.fullName +
    //             ` thêm ${item.affected_user_id?.fullName} vào nhóm ` +
    //             item.conversation?.chatName}
    //         </p>
    //       )
    //     }
    //   }

    //   if(item.message === '7008'){
    //     return (
    //       <p className='text-gray-600 font-light italic'>{item.sender?.fullName +
    //               ` vừa thay đổi background`}
    //       </p>
    //     )
    //   }
    //   break
    default:
      return null
  }
}

export default memo(RenderMessage)

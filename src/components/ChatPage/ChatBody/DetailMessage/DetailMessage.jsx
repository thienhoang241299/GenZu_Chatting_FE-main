import React, { useRef, useState, useEffect, memo, useCallback } from 'react'
import FeatureAI from '../FeatureAI/FeatureAI'
import { useSelector, useDispatch } from 'react-redux'
import { MdOutlineEmojiEmotions } from 'react-icons/md'
import FeatureEmoji from '../../../FeatureEmoji/FeatureEmoji'
import { setMessageSpoiled } from '../../../../redux/Slice/messageSlice'
import './DetailMessage.css'
import { getCookie } from '@/services/Cookies'
import RenderMessage from './RenderFIle/RenderFIle'
import RenderReplyMessage from './RenderFIle/RenderReplyMessage'
import RenderNotification from './RenderNotification/RenderNotification'
import LoadingSpinner from '@/pages/Chat/ChatSkeleton/ChatSkeleton'

const DetailMessage = memo(function DetailMessage(props) {
  const [isEmoteBtnClick, setEmoteBtnClick] = useState(false)
  const [isOptionSelected, setIsOptionSelected] = useState(false)

  const [activeMessageOptionID, setActiveMessageOptionID] = useState(null)
  const [activeMessageEmoteID, setActiveMessageEmoteID] = useState(null)
  const [hoveredMessage, setHoveredMessage] = useState(null)

  const resultMessage = useSelector((state) => state.chat.listSearch)
  const messages = useSelector((state) => state.message.message)
  const autoTranslate = useSelector((state) => state.user.conversation.autoTranslateList)

  const ownerTranslate =
    autoTranslate?.findIndex((e) => e == JSON.parse(getCookie('userLogin')).user._id) == -1
      ? false
      : true
  const dispatch = useDispatch()

  const buttonRef = useRef(null)
  const emoteRef = useRef(null)
  const optionRef = useRef(null)

  const session = Object.values(JSON.parse(getCookie('userLogin')))
  const sessionId = Object.keys(session)?.map((key) => {
    return session[key]._id
  })[2]

  const handleUserEmoteClick = useCallback((id_message) => {
    setActiveMessageEmoteID(id_message)
  }, [])

  const handleUserOptionClick = useCallback((id_message) => {
    setActiveMessageOptionID(id_message)
  }, [])

  const handleMessageHover = useCallback((id_message) => {
    setHoveredMessage(id_message)
  }, [])

  const handleEmoteClick = useCallback(
    (id_message) => {
      setEmoteBtnClick(!isEmoteBtnClick)
      handleUserEmoteClick(id_message)
    },
    [isEmoteBtnClick, handleUserEmoteClick],
  )

  const handleOptionClick = useCallback(
    (id_message) => {
      setIsOptionSelected(!isOptionSelected)
      handleUserOptionClick(id_message)
    },
    [isOptionSelected, handleUserOptionClick],
  )

  const handleClickOutside = useCallback((e) => {
    if (
      emoteRef.current &&
      !emoteRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setEmoteBtnClick(false)
    }
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setIsOptionSelected(false)
    }
  }, [])

  const handleSpoiledClick = useCallback(
    (id_message) => {
      const message = messages.find((msg) => msg.id_message === id_message)
      if (message && !message.isSpoiled) {
        dispatch(setMessageSpoiled({ id_message }))
      }
    },
    [dispatch, messages],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  useEffect(() => {
    props.handleToBottom()
  }, [messages, props])

  useEffect(() => {
    var index = props.idMessage
    if (!resultMessage || resultMessage.length === 0) return
    handleSearchMessage(index, props.isSearchMessage)
  }, [props.isSearchMessage, messages, resultMessage, props.idMessage])

  const handleSearchMessage = useCallback((indexMsg, isSearch) => {
    const myElement = document.getElementById(`${indexMsg}`)
    if (!myElement) return

    if (!isSearch) {
      myElement.classList.remove('text-purple-700', 'font-bold')
    } else {
      messages.forEach((msg) => {
        const previousElement = document.getElementById(`${msg._id}`)
        if (!previousElement) return
        if (previousElement.classList.contains('text-purple-700') && indexMsg !== msg._id) {
          previousElement.classList.remove('text-purple-700', 'font-bold')
        }
      })
    }
    myElement.classList.add('text-purple-700', 'font-bold')
    myElement.scrollIntoView()
  })
  return (
    <div
      id='messages'
      className={`${messages == null ? '' : 'mx-2'} flex flex-col-reverse ${messages?.length >= 10 ? 'h-fit' : 'h-full'}`}
    >
      {messages == null ? (
        <LoadingSpinner />
      ) : (
        <>
          {messages?.map((item, index) =>
            // Nếu người gửi tin nhắn là user hiện tại thì hiển thị tin nhắn ở bên phải
            item.messageType === 'notification' ? (
              <div key={index} className='flex justify-center font-light italic text-gray-600'>
                <RenderNotification item={item} />
              </div>
            ) : item.sender && sessionId === item.sender._id ? (
              <div
                key={index}
                className={`flex ${item.sender && sessionId === item.sender._id ? 'justify-end' : ''} ${item.status === 'recalled' ? 'pointer-events-none opacity-50' : ''}`}
                onMouseEnter={() => handleMessageHover(item._id)}
                onMouseLeave={() => handleMessageHover(null)}
              >
                {/* Component FeatureAI */}
                <div
                  className={`${
                    isOptionSelected && activeMessageOptionID == item._id
                      ? 'text-cyan-900 opacity-100 dark:text-cyan-700'
                      : hoveredMessage == item._id
                        ? 'text-cyan-900 opacity-100 dark:text-cyan-700'
                        : 'opacity-0 group-hover:opacity-100'
                  }`}
                  ref={optionRef}
                >
                  <FeatureAI
                    message={item.message}
                    id={item._id}
                    callBackOptionClick={handleOptionClick}
                    owner={true}
                  />
                </div>

                {/* Tin nhắn */}
                <div className='relative'>
                  <div
                    id={item._id}
                    className={`my-4 max-w-xs break-words rounded-lg bg-blue-200 p-2 ${item.isSpoiled || item.isSpoiled === undefined ? 'show' : 'hide'}`}
                    style={{
                      fontWeight: item.styles.bold ? 'bold' : 'normal',
                      fontStyle: item.styles.italic ? 'italic' : 'normal',
                      textDecoration: item.styles.underline ? 'underline' : 'none',
                    }}
                    onClick={() => handleSpoiledClick(item._id)}
                  >
                    {item.replyMessage ? (
                      <RenderReplyMessage item={item} />
                    ) : (
                      <RenderMessage item={item} />
                    )}
                  </div>
                  {/* Component FeatureEmoji */}
                  {isEmoteBtnClick && activeMessageEmoteID === item._id ? (
                    <div className='absolute right-px z-10' ref={emoteRef}>
                      <FeatureEmoji
                        isActive={isEmoteBtnClick}
                        item={item}
                        sessionId={sessionId}
                        handleCallBack={handleEmoteClick}
                      />
                    </div>
                  ) : (
                    <></>
                  )}

                  {/* Nút emoji */}
                  <div
                    className={`absolute bottom-px right-px p-0.5 text-cyan-900 transition delay-75 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-cyan-600 dark:text-cyan-700 dark:hover:text-cyan-500 rounded-md${
                      hoveredMessage === item._id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    ref={buttonRef}
                    onClick={() => handleEmoteClick(item._id)}
                  >
                    {/* Hiển thị danh sách emoji đã react */}
                    {item.emojiBy.length !== 0 ? (
                      item.emojiBy.map((emote, index) => emote.emoji != null && emote.emoji)
                    ) : (
                      <MdOutlineEmojiEmotions size={14} />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Nếu người gửi tin nhắn không phải là user hiện tại thì hiển thị tin nhắn ở bên trái
              <div
                key={index}
                className={`flex ${item.status === 'recalled' ? 'pointer-events-none opacity-50' : ''}`}
                onMouseEnter={() => {
                  handleMessageHover(item._id)
                }}
                onMouseLeave={() => handleMessageHover(null)}
              >
                {/* Tin nhắn */}
                <div className='relative'>
                  <div
                    id={item._id}
                    className='my-4 max-w-xs break-words rounded-lg bg-gray-300 p-2 text-black'
                  >
                    {item.replyMessage ? (
                      <RenderReplyMessage item={item} />
                    ) : (
                      <RenderMessage item={item} autoTranslate={ownerTranslate} />
                    )}
                  </div>
                  {/* Nút emoji */}
                  <div
                    className={`absolute bottom-px right-px p-0.5 text-cyan-900 transition delay-75 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-cyan-600 dark:text-cyan-700 dark:hover:text-cyan-500 rounded-md${
                      hoveredMessage === item._id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    ref={buttonRef}
                    onClick={() => handleEmoteClick(item._id)}
                  >
                    {/* Hiển thị danh sách emoji đã react */}
                    {item.emojiBy.length != 0 ? (
                      item.emojiBy.map((emote, index) => emote.emoji != null && emote.emoji)
                    ) : (
                      <MdOutlineEmojiEmotions size={14} />
                    )}
                  </div>
                  {/* Component FeatureEmoji */}
                  {isEmoteBtnClick && activeMessageEmoteID == item._id ? (
                    <div className='absolute z-10' ref={emoteRef}>
                      <FeatureEmoji
                        isActive={isEmoteBtnClick}
                        item={item}
                        sessionId={sessionId}
                        handleCallBack={handleEmoteClick}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                {/* Component FeatureAI */}
                <div
                  className={`${
                    isOptionSelected && activeMessageOptionID == item._id
                      ? 'text-cyan-900 opacity-100 dark:text-cyan-700'
                      : hoveredMessage == item._id
                        ? 'text-cyan-900 opacity-100 dark:text-cyan-700'
                        : 'opacity-0 group-hover:opacity-100'
                  }`}
                  ref={optionRef}
                >
                  <FeatureAI
                    sender={item.sender}
                    message={item.message}
                    id={item._id}
                    callBackOptionClick={handleOptionClick}
                    owner={false}
                  />
                </div>
              </div>
            ),
          )}
        </>
      )}
    </div>
  )
})

export default DetailMessage

import ChatHeader from '../ChatHeader/ChatHeader' // Import component ChatHeader từ đường dẫn tương đối
import ChatFooter from '../ChatFooter/ChatFooter' // Import component ChatFooter từ đường dẫn tương đối
import DetailMessage from './DetailMessage/DetailMessage' // Import component DetailMessage từ đường dẫn tương đối
import { useDispatch, useSelector } from 'react-redux' // Import hook useSelector từ thư viện react-redux
import { IoMdArrowRoundDown } from 'react-icons/io' // Import icon IoMdArrowRoundDown từ thư viện react-icons/io
import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react' // Import hook useEffect, useState từ thư viện react
import { useParams } from 'react-router-dom'
import { getMessagesMore } from '@/redux/Slice/messageSlice'
import { getMessageMoreBottom, leaveRoomSlice, setLoadMore } from '@/redux/Slice/chatSlice'
import LoadMore from './LoadMore/LoadMore'
import SearchMessage from './SearchMessage/SearchMessage'
import Typing from './Typing/Typing'
function ChatBody({ isSearchMessage, idMessage, toggleInfo }) {
  // Component ChatBody nhận props toggleInfo
  const [backgroundStyle, setBackgroundStyle] = useState({ backgroundColor: '#6699FF' })

  let [indexMessage, setIndexMessage] = useState(0)
  const page = useSelector((state) => state.chat.page)
  const loadMore = useSelector((state) => state.chat.loadMore)
  const totalPage = useSelector((state) => state.message.totalPage)
  const minPage = useSelector((state) => state.chat.minPage)
  // const isSearchMessage = useSelector((state) => state.message.isSearchMessage)
  const resultMessage = useSelector((state) => state.message.resultMessage)
  const conversation = useSelector((state) => state.user.conversation)
  const isTyping = useSelector((state) => state.chat.isTyping)
  const idConversation = useParams()
  const dispatch = useDispatch()
  const messagesListRef = useRef(null)
  const [scrollHeight, setScrollHeight] = useState(0)
  // Hàm xử lý sự kiện scroll của danh sách tin nhắn
  const showGoToBottomBtn = (e) => {
    const element = document.getElementById('messages-list') // Lấy element có id là "messages-list"
    const elementBottomBtn = document.getElementById('to-bottom-button') // Lấy element có id là "to-bottom-button"

    // Kiểm tra vị trí scroll hiện tại của danh sách tin nhắn
    // Nếu vị trí scroll nằm trong khoảng từ 0 đến (chiều cao của danh sách - 1250)
    // thì hiển thị nút "Go To Bottom", ngược lại thì ẩn nút đi
    if (element.scrollTop >= 0 && element.scrollTop < element.scrollHeight - 1250) {
      elementBottomBtn.classList.remove('hidden')
      elementBottomBtn.classList.add('flex')
    } else {
      elementBottomBtn.classList.remove('flex')
      elementBottomBtn.classList.add('hidden')
    }
  }
  // Hàm xử lý khi scroll tới top
  const handleScrollToTop = (e) => {
    const element = document.getElementById('messages-list')
    if (element.scrollTop === 0) {
      // Gọi API để lấy thêm tin nhắn mới ở đây
      dispatch(getMessagesMore({ idConversation: idConversation.idConversation, page: page }))
      dispatch(setLoadMore(true))
      setScrollHeight(element.scrollHeight)
    }
  }
  const handleScrollToBottom = (e) => {
    const element = document.getElementById('messages-list')
    if (element.scrollHeight - element.scrollTop - 1 - element.clientHeight < 2) {
      // Gọi API để lấy thêm tin nhắn ở đây

      dispatch(
        getMessageMoreBottom({ idConversation: idConversation.idConversation, page: minPage }),
      )
      dispatch(setLoadMore(true))
      setScrollHeight(element.scrollHeight)
    }
  }
  // Hàm xử lý sự kiện click vào nút "Go To Bottom"
  const goToBottom = (e) => {
    const element = document.getElementById('messages-list') // Lấy element có id là "messages-list"
    const elementBottomBtn = document.getElementById('to-bottom-button') // Lấy element có id là "to-bottom-button"

    element.scrollTop = element.scrollHeight // Đặt vị trí scroll của danh sách tin nhắn xuống cuối cùng
    elementBottomBtn.classList.remove('flex') // Ẩn nút "Go To Bottom" đi
    elementBottomBtn.classList.add('hidden')
    // element.scrollTo({ bottom: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (!loadMore) {
      const element = document.getElementById('messages-list')
      element.scrollTop = element.scrollTop - scrollHeight + 904
    }
  }, [loadMore])

  useEffect(() => {
    if (idConversation.idConversation != 'undefined') {
      return () => {
        dispatch(leaveRoomSlice(idConversation))
      }
    }
  }, [idConversation])

  // let backgroundStyle
  useLayoutEffect(() => {
    let style
    if (conversation.background == null) return
    const backgroundType = conversation.background.backgroundType
    const url = conversation.background.url
    switch (backgroundType) {
      case 'color':
        style = {
          backgroundColor: url,
        }
        break
      case 'image':
        style = {
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
        }
        break
      default:
        break
    }
    setBackgroundStyle(style)
  }, [conversation.background])

  return (
    <div className='relative mx-0 flex h-screen w-full flex-col shadow-2xl dark:bg-darkBlack md:mx-2'>
      <ChatHeader toggleInfo={toggleInfo} />
      {loadMore ? <LoadMore /> : ''}
      {/* Hiển thị thanh tìm kiếm tin nhắn khi được chọn */}
      {isSearchMessage && <SearchMessage idConversation={idConversation.idConversation} />}
      {/* Hiển thị component ChatHeader với props toggleInfo được truyền vào */}
      <div
        id='messages-list'
        className='no-scrollbar flex h-screen flex-col space-y-2 overflow-y-auto'
        style={backgroundStyle}
        onScroll={(e) => {
          showGoToBottomBtn(e)
          page > totalPage ? '' : handleScrollToTop(e)
          minPage > 0 ? handleScrollToBottom(e) : ''
        }}
        ref={messagesListRef} // Gắn ref cho danh sách tin nhắn
      >
        <DetailMessage
          handleToBottom={goToBottom}
          idMessage={idMessage}
          isSearchMessage={isSearchMessage}
        />
        {/* Hiển thị component DetailMessage với props handleToBottom được truyền vào */}
        {/* Nút "Go To Bottom" */}
        <button
          id='to-bottom-button'
          title='Go To Bottom'
          className='z-90 fixed bottom-20 left-1/2 flex -translate-x-1/2 transform items-center justify-center space-x-0.5 rounded-full border-0 px-4 py-2 text-xs font-bold text-blue-600 drop-shadow-md'
          onClick={goToBottom} // Gọi hàm goToBottom khi nút được click
        >
          <IoMdArrowRoundDown size={12} /> {/* Hiển thị icon mũi tên xuống */}
          <p className=''>Has a new message</p> {/* Hiển thị text "Has a new message" */}
        </button>
      </div>
      {console.log(isTyping)}
      {isTyping ? <Typing /> : <></>}
      {/* {console.log(conversation.blockUsers.length, conversation.isGroupChat)} */}
      <ChatFooter />
      {/* Hiển thị component ChatFooter */}
    </div>
  )
}

export default ChatBody // Xuất component ChatBody để sử dụng ở nơi khác

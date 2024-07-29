import React, { useState, useRef, useEffect } from 'react'
import 'regenerator-runtime'
import { MdOutlineKeyboardVoice, MdAttachFile, MdInsertEmoticon } from 'react-icons/md'
import { LuSend } from 'react-icons/lu'
import { FaFile, FaImage, FaVideo } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {
  sendMessage,
  deleteEmoji,
  clearReplyTo,
  sendMessageGroup,
} from '../../../redux/Slice/messageSlice'
import AttachmentButton from '../../Button/AttachmentButton'
import { VscBold } from 'react-icons/vsc'
import { GoItalic } from 'react-icons/go'
import { BsTypeUnderline } from 'react-icons/bs'
import { AudioRecorder } from 'react-audio-voice-recorder'
import { BiHide } from 'react-icons/bi'
import EmojiMessage from '../../FeatureEmoji/EmojiMessage'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import isLink from '@/utils/helpers'
import './ChatFooter.css'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/utils/firebaseConfig'
import { useParams } from 'react-router-dom'
import { TiDeleteOutline } from 'react-icons/ti'
import Preview from './Preview/Preview'
import { getCookie } from '@/services/Cookies'
import { typingSlice } from '@/redux/Slice/chatSlice'

const ChatFooter = () => {
  // Trạng thái hiển thị menu đính kèm
  const [showAttachments, setShowAttachments] = useState(false)
  const [isEmojiMsgClick, setIsEmojiMsgClick] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isTextSelected, setIsTextSelected] = useState(false)
  const [selectedText, setSelectedInput] = useState('')
  const [inputStr, setInputStr] = useState('')
  const [isSpoiled, setIsSpoiled] = useState(true)
  const [boldActive, setBoldActive] = useState(false)
  const [italicActive, setItalicActive] = useState(false)
  const [underlineActive, setUnderlineActive] = useState(false)
  const [isAiSuggestionClick, setIsAiSuggestionClick] = useState(true)
  const [showAnswerSuggestion, setShowAnswerSuggestion] = useState(false)
  const [indexAnswerText, setIndexAnswerText] = useState()
  const [answerArray, setAnswerArray] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  // Tham chiếu đến các thành phần DOM
  const buttonRef = useRef(null) // Nút emoji
  const emoteRef = useRef(null) // Bảng chọn emoji
  const inputRef = useRef(null) // Input nhập liệu
  // Tham chiếu đến các input file ẩn
  const fileInputRefs = {
    file: useRef(null),
    image: useRef(null),
    video: useRef(null),
    audio: useRef(null),
  }
  // Tham chiếu đến các câu trả lời gợi ý từ AI
  const answerSuggRefs = {
    0: useRef(null),
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
  }
  // Tham chiếu đến container chứa các bản ghi âm
  const audioContainerRef = useRef(null)

  // Lấy useDispatch từ react-redux để dispatch actions
  const dispatch = useDispatch()
  const replyMessage = useSelector((state) => state?.message?.replyMessage)
  // Lấy danh sách emoji đã chọn từ store Redux
  const selectedEmojis = useSelector((state) => state.message.selectedEmojis)
  // Lấy gợi ý trả lời từ AI từ store Redux
  const answerSuggestionAI = useSelector((state) => state.message.answerAI)
  const conversation = useSelector((state) => state.user.conversation)

  const lstBlockUser = useSelector((state) => state.user?.lstBlockUsers)
  console.log('chat footer list block user:', lstBlockUser)
  const userId = JSON.parse(getCookie('userLogin')).user._id
  // let idUserBlocked = useSelector((state) => state.user.userBlocked)
  // console.log('chat footer user block 0:', idUserBlocked)
  const idUserBlocked_2 = () => {
    if (!lstBlockUser) return
    for (var item of lstBlockUser) {
      for (var item_2 of conversation.users) {
        if (item._id === item_2._id) {
          return item._id
        }
      }
    }
  }

  // set lại user Id bị blocked từ conversation.blockedUsers cho lần render đầu tiên
  let idUserBlocked = idUserBlocked_2()

  idUserBlocked =
    idUserBlocked && !conversation.isGroupChat
      ? conversation.users?.find((item) => item._id === idUserBlocked)
      : conversation.blockedUsers?.find((item) => item === userId)

  // Lấy tham số từ URL
  const param = useParams()

  // Sử dụng useSpeechRecognition hook để chuyển đổi giọng nói thành văn bản
  const {
    transcript, // Văn bản được chuyển đổi từ giọng nói
    listening, // Trạng thái đang nghe
    resetTranscript, // Hàm reset văn bản được chuyển đổi
    browserSupportsSpeechRecognition, // Kiểm tra trình duyệt có hỗ trợ Speech Recognition hay không
  } = useSpeechRecognition()

  // useEffect hook để cập nhật input field với văn bản được chuyển đổi từ giọng nói
  useEffect(() => {
    // Kiểm tra nếu có văn bản được chuyển đổi và trạng thái không phải đang nghe
    if (transcript && !listening) {
      setInputStr((prevInput) => prevInput.trim() + ' ' + transcript.trim())
      // Reset văn bản được chuyển đổi sau khi cập nhật input
      resetTranscript()
    }
  }, [transcript, listening, resetTranscript])

  // useEffect hook để xử lý và hiển thị các gợi ý trả lời từ AI
  useEffect(() => {
    // Duyệt qua từng phần tử trong answerSuggestionAI
    answerSuggestionAI.map((answer, index) => {
      // Kiểm tra nếu có gợi ý trả lời
      if (answer.answerSuggestion) {
        // parse chuỗi json sang array
        let checkMutiAnswer = JSON.parse(answer.answerSuggestion)
        // tách giá trị từ key general về list
        let answerText = checkMutiAnswer.map((item) => {
          return item.general
        })
        // Cập nhật mảng câu trả lời
        setAnswerArray(answerText)
        // Hiển thị gợi ý nếu có câu trả lời
        checkMutiAnswer != null
          ? setShowAnswerSuggestion(answer.isAnswerAI)
          : setShowAnswerSuggestion(false)
        // Reset chỉ số câu trả lời được chọn
        setIndexAnswerText()
      }
      // Cập nhật trạng thái AI suggestion
      setIsAiSuggestionClick(answer.isAnswerAI)
    })
  }, [answerSuggestionAI])

  // useEffect hook để cập nhật input field với emoji được chọn
  useEffect(() => {
    if (selectedEmojis.length > 0) {
      setInputStr((prev) => prev + selectedEmojis.join(''))
      dispatch(deleteEmoji())
    }
  }, [selectedEmojis, dispatch])

  // Hàm thêm thẻ audio vào DOM để phát bản ghi âm
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob)
    const audioWrapper = document.createElement('div')
    audioWrapper.className = 'audio-wrapper'

    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
    audio.className = 'audio-element'

    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete-button'
    deleteButton.innerHTML = '×'
    deleteButton.onclick = () => {
      audioWrapper.remove()
    }

    audioWrapper.appendChild(audio)
    audioWrapper.appendChild(deleteButton)

    if (audioContainerRef.current) {
      audioContainerRef.current.appendChild(audioWrapper)
    }
  }

  // Hàm xóa tất cả các thẻ audio trong DOM
  const clearAudioElements = () => {
    if (audioContainerRef.current) {
      audioContainerRef.current.innerHTML = ''
    }
  }

  // Xử lý sự kiện nhấn phím Enter trong input field
  const handleKeyPress = (e) => {
    // Kiểm tra nếu phím Enter được nhấn
    if (e.keyCode === 13) {
      // Gửi tin nhắn
      handleSendMsg()
    }
  }
  const handleDeletePreview = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
  }
  // Hàm xử lý gửi tin nhắn
  const handleSendMsg = () => {
    // Nếu có file được chọn, tiến hành gửi file
    if (selectedFile?.file) {
      if (!isUploading) {
        handleSendFile()
      }
      setIsUploading(true)
    }
    // Kiểm tra inputStr khác null, undefined và rỗng
    if (conversation.isGroupChat) {
      if (inputStr != null && inputStr != undefined && inputStr != '') {
        if (replyMessage) {
          console.log('1', replyMessage)
        }
        // Tạo object messageData chứa thông tin tin nhắn
        const messageData = {
          message: inputStr, // Nội dung tin nhắn
          styles: {
            // Định dạng văn bản
            fontSize: 10,
            bold: boldActive,
            italic: italicActive,
            underline: underlineActive,
          },
          emojiBy: [],
          isSpoiled: isSpoiled,
          idConversation: param,
          replyMessage: replyMessage ? replyMessage._id : null,
        }
        console.log('msg data', messageData)
        // Dispatch action gửi tin nhắn
        dispatch(sendMessageGroup(messageData))
        // Xóa emoji đã chọn
        dispatch(deleteEmoji())
        // Xóa nội dung input field sau khi gửi
        setInputStr('')
        // Reset định dạng văn bản
        setBoldActive(false)
        setItalicActive(false)
        setUnderlineActive(false)
        // Reset trạng thái tin nhắn "spoiled"
        setIsSpoiled(true)
        dispatch(clearReplyTo())
        // Ẩn gợi ý trả lời từ AI
        setShowAnswerSuggestion(!showAnswerSuggestion)
      }
    } else {
      if (inputStr != null && inputStr != undefined && inputStr != '') {
        // Tạo object messageData chứa thông tin tin nhắn
        const messageData = {
          message: inputStr, // Nội dung tin nhắn
          styles: {
            // Định dạng văn bản
            fontSize: 10,
            bold: boldActive,
            italic: italicActive,
            underline: underlineActive,
          },
          emojiBy: [],
          isSpoiled: isSpoiled,
          idConversation: param,
          replyMessage: replyMessage ? replyMessage._id : null,
        }
        // Dispatch action gửi tin nhắn
        dispatch(sendMessage(messageData))
        // Xóa emoji đã chọn
        dispatch(deleteEmoji())
        // Xóa nội dung input field sau khi gửi
        setInputStr('')
        // Reset định dạng văn bản
        setBoldActive(false)
        setItalicActive(false)
        setUnderlineActive(false)
        // Reset trạng thái tin nhắn "spoiled"
        setIsSpoiled(true)
        dispatch(clearReplyTo())
        // Ẩn gợi ý trả lời từ AI
        setShowAnswerSuggestion(!showAnswerSuggestion)
      }
    }
  }

  // Hàm xử lý chuyển đổi định dạng văn bản (in đậm, in nghiêng, gạch chân)
  const toggleInlineStyle = (style) => {
    switch (style) {
      case 'bold':
        setBoldActive(!boldActive)
        break
      case 'italic':
        setItalicActive(!italicActive)
        break
      case 'underline':
        setUnderlineActive(!underlineActive)
        break
      default:
        break
    }
  }

  // Hàm xử lý khi chọn file đính kèm
  const handleFileChange = async (event, type) => {
    const file = event.target.files[0]
    // Nếu không có file được chọn, thoát khỏi hàm
    if (!file) return

    // Kiểm tra kích thước file dựa trên loại file
    if (file) {
      switch (type) {
        case 'image':
          if (file.size > 3 * 1048576) {
            // Nếu file ảnh quá lớn, hiển thị thông báo lỗi
            alert('Hình ảnh quá lớn, vui lòng chọn ảnh khác')
            return
          }
          break
        case 'audio':
          if (file.size > 3 * 1048576) {
            // Nếu file audio quá lớn, hiển thị thông báo lỗi
            alert('File audio quá lớn, vui lòng chọn file khác')
            return
          }
          break
        case 'video':
          if (file.size > 30 * 1048576) {
            // Nếu file video quá lớn, hiển thị thông báo lỗi
            alert('File video quá lớn, vui lòng chọn file khác')
            return
          }
          break
        default:
          break
      }
      // Cập nhật state selectedFile với file được chọn và loại file
      setSelectedFile({ file: file, type: type })
      // Tạo URL xem trước cho file
      setPreviewUrl({ url: URL.createObjectURL(file), type: type })
    }
  }

  // Hàm xử lý gửi file đính kèm
  const handleSendFile = async () => {
    // Tạo đường dẫn lưu trữ trên Firebase Storage
    const storageRef = ref(storage, `${selectedFile.type}/${selectedFile.file.name}`)
    // Tải file lên Firebase Storage
    uploadBytes(storageRef, selectedFile.file)
      .then((snapshot) => {
        // Lấy URL tải xuống của file sau khi tải lên thành công
        return getDownloadURL(snapshot.ref)
      })
      .then((downloadURL) => {
        // Cập nhật state downloadURL
        // Tạo object messageData chứa thông tin tin nhắn
        const messageData = {
          message: downloadURL, // URL tải xuống của file
          styles: {
            // Định dạng văn bản (không sử dụng cho file)
            fontSize: 10,
            bold: false,
            italic: false,
            underline: false,
          },
          emojiBy: [],
          isSpoiled: isSpoiled,
          idConversation: param,
          messageType: selectedFile.type,
        }
        // Dispatch action gửi tin nhắn
        dispatch(sendMessage(messageData))
        // Reset state previewUrl và selectedFile sau khi gửi thành công
        setPreviewUrl(null)
        setSelectedFile(null)
        setIsUploading(false)
      })
      .catch((error) => {
        // Xử lý lỗi khi tải file lên
        console.error('Error uploading file:', error)
      })
  }

  // Hàm xử lý khi click vào nút đính kèm
  const handleFileButtonClick = (type) => {
    // Kích hoạt sự kiện click vào input file tương ứng với loại file
    fileInputRefs[type].current.click()
    // Ẩn menu đính kèm
    setShowAttachments(false)
  }

  // Hàm xử lý hiển thị/ẩn menu đính kèm
  const toggleAttachments = () => {
    setShowAttachments(!showAttachments)
  }

  // Hàm xử lý chuyển đổi trạng thái tin nhắn "spoiled"
  const handleSpoiledClick = () => {
    setIsSpoiled(!isSpoiled)
  }

  // Hàm xử lý khi bắt đầu ghi âm
  const startRecording = () => {
    // Kiểm tra trình duyệt có hỗ trợ Speech Recognition hay không
    if (!browserSupportsSpeechRecognition) {
      console.error('Trình duyệt không hỗ trợ Speech Recognition.')
      return
    }
    // Cập nhật trạng thái đang ghi âm
    setIsRecording(true)
    // Bắt đầu ghi âm
    SpeechRecognition.startListening({ continuous: true })
  }

  // Hàm xử lý khi dừng ghi âm
  const stopRecording = () => {
    // Cập nhật trạng thái đang ghi âm
    setIsRecording(false)
    // Dừng ghi âm
    SpeechRecognition.stopListening()
  }

  // Hàm xử lý khi click vào nút emoji
  const handleEmojiMsgClick = (e) => {
    e.preventDefault()
    setIsEmojiMsgClick(!isEmojiMsgClick)
  }

  // Hàm xử lý khi dữ liệu âm thanh được ghi
  const onDataRecorded = (data) => {
    // Cập nhật state audioBlob
    setAudioBlob(data.blob)
  }

  // Hàm xử lý khi click chuột ra ngoài vùng emoji picker và menu đính kèm
  const handleClickOutside = (e) => {
    if (
      emoteRef.current &&
      !emoteRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      // Ẩn emoji picker
      setIsEmojiMsgClick(false)
    }
  }

  // Hàm xử lý khi focus vào input field
  const handleFocus = () => {
    // Thêm event listener để theo dõi sự thay đổi selection
    document.addEventListener('selectionchange', checkSelection)
  }

  // Hàm kiểm tra vùng văn bản được chọn trong input field
  const checkSelection = () => {
    // Lấy vùng văn bản được chọn
    const selection = window.getSelection()
    // Kiểm tra nếu có vùng văn bản được chọn
    if (selection && selection.toString()) {
      // Cập nhật trạng thái văn bản được chọn
      setIsTextSelected(true)
      // Cập nhật nội dung văn bản được chọn
      setSelectedInput(selection.toString())
    } else {
      // Cập nhật trạng thái văn bản được chọn
      setIsTextSelected(false)
      // Reset nội dung văn bản được chọn
      setSelectedInput('')
    }
  }

  // useEffect hook để thêm và xóa event listener
  useEffect(() => {
    // Thêm event listener khi component được mount
    document.addEventListener('mousedown', handleClickOutside)
    // Xóa event listener khi component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Hàm xử lý khi nội dung input field thay đổi
  const handleChangeInput = (e) => {
    dispatch(typingSlice(conversation._id))
    setInputStr(e.target.value)
  }

  // Hàm xử lý khi click vào câu trả lời gợi ý từ AI
  const handleAnswerTextClick = (answerText, index) => {
    // Cập nhật nội dung input field với câu trả lời được chọn
    setInputStr(answerText)
    // Kích hoạt sự kiện click vào tham chiếu của câu trả lời
    answerSuggRefs[index].current.click()
    // Cập nhật chỉ số câu trả lời được chọn
    setIndexAnswerText(index)
  }

  // Hàm xử lý đóng gợi ý trả lời từ AI
  const onClose = (e) => {
    // Ẩn gợi ý trả lời
    setShowAnswerSuggestion(!showAnswerSuggestion)
  }

  return (
    <>
      {/* Hiển thị gợi ý trả lời từ AI */}
      {showAnswerSuggestion && isAiSuggestionClick ? (
        <div className='relative flex w-full select-none items-center justify-center space-x-2 font-mono'>
          <button
            className='absolute right-8 top-0 text-gray-500 hover:text-gray-700'
            onClick={onClose}
          >
            ×
          </button>
          {/* Hiển thị tối đa 4 câu trả lời */}
          {answerArray.map(
            (answerText, index) =>
              index < 4 &&
              indexAnswerText != index && (
                <h1
                  key={index}
                  ref={answerSuggRefs[index]}
                  className='cursor-pointer rounded-lg bg-[#93c5fd] px-3 py-1 text-[15px] text-white shadow-lg shadow-gray-500/50 active:scale-[.97]'
                  onClick={() => handleAnswerTextClick(answerText, index)}
                >
                  {answerText}
                </h1>
              ),
          )}
        </div>
      ) : (
        <></>
      )}
      {/* Nếu user đã bị chặn */}
      {idUserBlocked ? (
        <div className='mb-4 flex w-full select-none items-center justify-center space-x-2 font-mono italic text-gray-500'>
          {idUserBlocked === userId ? (
            <p> Bạn tạm thời không thể contact với người này</p>
          ) : (
            <p> Bạn đã chặn người dùng này </p>
          )}
        </div>
      ) : (
        // {/* Hiển thị xem trước file được chọn */}
        <div>
          {previewUrl && (
            <Preview
              previewUrl={previewUrl}
              onDelete={handleDeletePreview}
              isUploading={isUploading}
            />
          )}

          {/* Input nhập liệu và các nút chức năng */}
          <div className='relative flex items-center rounded-lg bg-mainBlue px-4 pb-4 pt-1 dark:bg-darkBlack'>
            {replyMessage && (
              <div className='absolute left-0 top-[-60px] w-full rounded-md bg-gray-100 p-2 shadow-md'>
                <p className='text-sm text-gray-500'>Replying to: {replyMessage.message}</p>
                <button
                  onClick={() => dispatch(clearReplyTo())}
                  className='text-xs text-red-500 underline'
                >
                  Cancel
                </button>
              </div>
            )}
            {/* Hiển thị input field hoặc trạng thái đang tải */}
            {!isAiSuggestionClick ? (
              <div className='loader-dots relative mt-2 h-5 w-10/12'>
                <div className='absolute top-0 mt-1 h-3 w-3 rounded-full bg-[#93c5fd]'></div>
                <div className='absolute top-0 mt-1 h-3 w-3 rounded-full bg-[#93c5fd]'></div>
                <div className='absolute top-0 mt-1 h-3 w-3 rounded-full bg-[#93c5fd]'></div>
                <div className='absolute top-0 mt-1 h-3 w-3 rounded-full bg-[#93c5fd]'></div>
              </div>
            ) : (
              <input
                placeholder='Nhập tin nhắn...'
                onChange={handleChangeInput}
                onKeyDown={handleKeyPress}
                onFocus={handleFocus}
                ref={inputRef}
                value={inputStr}
                className={`mr-2 flex-1 rounded-full border bg-white px-4 py-2 outline-cyan-600 focus:outline dark:bg-black dark:text-white ${
                  isSpoiled ? 'show' : 'hide'
                }`}
                style={{
                  fontWeight: boldActive ? 'bold' : 'normal',
                  fontStyle: italicActive ? 'italic' : 'normal',
                  textDecoration: underlineActive ? 'underline' : 'none',
                }}
              />
            )}

            {/* Hiển thị menu định dạng văn bản */}
            {isTextSelected && (
              <div className='absolute -top-3 mx-auto flex cursor-pointer items-center justify-around rounded-lg bg-slate-200 p-2 shadow-lg'>
                <button
                  className={`tool-btn ${
                    isSpoiled ? 'hover:bg-neutral-300' : 'bg-blue-500 text-white'
                  }`}
                  onClick={handleSpoiledClick}
                >
                  <BiHide size={22} />
                </button>
                <div className='divider'></div>
                <button onClick={() => toggleInlineStyle('bold')}>
                  <VscBold
                    size={22}
                    className={`tool-btn ${
                      boldActive ? 'bg-blue-500 text-white' : 'hover:bg-neutral-300'
                    }`}
                  />
                </button>
                <button onClick={() => toggleInlineStyle('italic')}>
                  <GoItalic
                    size={22}
                    className={`tool-btn ${
                      italicActive ? 'bg-blue-500 text-white' : 'hover:bg-neutral-300'
                    }`}
                  />
                </button>
                <button onClick={() => toggleInlineStyle('underline')}>
                  <BsTypeUnderline
                    size={22}
                    className={`tool-btn ${
                      underlineActive ? 'bg-blue-500 text-white' : 'hover:bg-neutral-300'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Hiển thị bảng chọn emoji */}
            <div
              className='absolute bottom-12 right-12 mx-auto flex cursor-pointer items-center justify-between rounded-full p-2'
              ref={emoteRef}
            >
              {isEmojiMsgClick && <EmojiMessage />}
            </div>

            {/* Các nút chức năng: đính kèm, emoji, gửi */}
            <div className='mx-auto overflow-x-hidden font-semibold md:flex md:items-center'>
              <div className='flex items-center justify-between'>
                {/* Ghi âm giọng nói */}
                <AudioRecorder
                  onRecordingComplete={addAudioElement}
                  record={isRecording}
                  title={'Ghi âm tin nhắn'}
                  onStop={(data) => onDataRecorded(data)}
                  audioURL={(audioBlob && URL.createObjectURL(audioBlob)) || ''}
                />
                <div
                  ref={audioContainerRef}
                  className={audioContainerRef === null ? 'hidden' : 'mx-1 flex items-center'}
                ></div>
                {/* Nút đính kèm file */}
                <button
                  className='rounded-md p-1 hover:bg-blue-400 dark:text-white md:block'
                  onClick={toggleAttachments}
                >
                  <MdAttachFile size={24} />
                </button>
                {/* Nút chọn emoji */}
                <button
                  className='mr-2 rounded-md p-1 hover:bg-blue-400 dark:text-white md:block'
                  ref={buttonRef}
                  onClick={handleEmojiMsgClick}
                >
                  <MdInsertEmoticon size={24} />
                </button>
                {/* Nút gửi tin nhắn */}
                <button
                  className='mx-auto rounded-full bg-blue-400 p-4 text-black hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white'
                  onClick={handleSendMsg}
                >
                  <LuSend size={18} />
                </button>
              </div>
            </div>

            {/* Menu đính kèm */}
            <div
              className={`absolute bottom-20 right-[6rem] flex flex-col space-y-2 transition-transform duration-300 ease-in-out md:right-[6rem] ${
                showAttachments
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-4 opacity-0'
              }`}
            >
              <AttachmentButton
                icon={FaFile}
                color={'blue'}
                onAttachBtnClick={() => handleFileButtonClick('file')}
              />
              <AttachmentButton
                icon={FaImage}
                color={'blue'}
                onAttachBtnClick={() => handleFileButtonClick('image')}
              />
              <AttachmentButton
                icon={FaVideo}
                color={'red'}
                onAttachBtnClick={() => handleFileButtonClick('video')}
              />
              {/* Nút ghi âm giọng nói */}
              <button
                className={`mx-auto rounded-full p-3 focus:outline-none dark:text-white ${
                  listening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
                }`}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
              >
                <MdOutlineKeyboardVoice size={22} />
              </button>
            </div>

            {/* Input file ẩn */}
            <input
              type='file'
              accept='.zip,.rar,.7z,.tar,.pdf,.doc,.docx,.xls,.xlsx,.txt'
              ref={fileInputRefs.file}
              className='hidden'
              onChange={(e) => handleFileChange(e, 'file')}
            />
            <input
              type='file'
              accept='image/*'
              ref={fileInputRefs.image}
              className='hidden'
              onChange={(e) => handleFileChange(e, 'image')}
            />
            <input
              type='file'
              accept='video/*'
              ref={fileInputRefs.video}
              className='hidden'
              onChange={(e) => handleFileChange(e, 'video')}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatFooter

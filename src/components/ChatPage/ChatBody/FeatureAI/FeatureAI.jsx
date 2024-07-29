import { RiTranslate } from 'react-icons/ri' // Import icon Dịch
import { MdOutlineQuickreply } from 'react-icons/md' // Import icon Trả lời nhanh
import { SlOptions } from 'react-icons/sl' // Import icon Thêm tùy chọn
import DropdownOption from './DropdownOption/DropdownOption' // Import component DropdownOption
import { setAnswerSuggestion, translationMessage } from '../../../../redux/Slice/messageSlice' // Import actions Redux cho việc dịch và trả lời tin nhắn
import { setAnswerClick } from '../../../../redux/Slice/messageSlice' // Import action Redux cho việc cập nhật trạng thái click của nút "Trả lời nhanh"
import { answerSuggestion } from '@/utils/answerSuggestion' // Import hàm xử lý logic trả lời câu hỏi tự động
import { useDispatch } from 'react-redux' // Import useDispatch để gửi actions Redux
import { useRef, useState, useEffect, memo } from 'react' // Import các hooks từ React
import { textToSpeech } from '@/services/TranslationService'
import { TiMicrophoneOutline } from 'react-icons/ti'

const FeatureAI = memo(function FeatureAI(props) {
  // Refs
  const buttonRef = useRef(null) // Ref cho nút "Thêm tùy chọn"
  const dropdownRef = useRef(null) // Ref cho dropdown menu

  // Redux
  const dispatch = useDispatch() // Khởi tạo dispatch để gửi actions Redux

  // States
  const [isOptionBtnClick, setIsOptionBtnClick] = useState(false) // State quản lý hiển thị/ẩn dropdown menu
  const [isAnswerSuggClick, setIsAnswerSuggClick] = useState(true) // State quản lý trạng thái click của nút "Trả lời nhanh"
  const [typeAnswered, setTypeAnswered] = useState('') // State lưu trữ trạng thái trả lời câu hỏi (thành công hoặc lỗi)

  // Hàm xử lý sự kiện click vào nút "Thêm tùy chọn"
  const handleMoreClick = (e) => {
    e.preventDefault() // Ngăn chặn hành vi mặc định của thẻ <button>
    setIsOptionBtnClick(!isOptionBtnClick) // Toggle state hiển thị/ẩn dropdown menu
    props.callBackOptionClick() // Gọi callback function từ component cha (nếu có)
    // props.isActiveOption(!isOptionBtnClick); // (Đoạn code này bị comment out, có thể là code cũ không dùng nữa)
  }

  // Hàm xử lý sự kiện click bên ngoài dropdown menu và nút "Thêm tùy chọn"
  const handleClickOutside = (e) => {
    // Kiểm tra xem click có nằm ngoài dropdown menu và nút "Thêm tùy chọn" hay không
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsOptionBtnClick(false) // Ẩn dropdown menu
    }
  }

  // Hàm xử lý sự kiện click vào nút "Trả lời nhanh"
  const handleClickAnswer = () => {
    if (isAnswerSuggClick) {
      dispatch(setAnswerClick(false)) // Cập nhật state đã click của nút "Trả lời nhanh" thành false
    }
    if (typeAnswered === 'error') {
      dispatch(setAnswerClick(true)) // Cập nhật state đã click của nút "Trả lời nhanh" thành true nếu trạng thái trả lời là lỗi
    }
  }

  // Hàm xử lý logic trả lời câu hỏi tự động
  const handleAnswerQuestion = async (message) => {
    try {
      const answer = await answerSuggestion(message) // Gọi hàm answerSuggestion để nhận câu trả lời gợi ý
      const itemAnswer = {
        message: answer,
        isAIClick: true,
      }
      setTypeAnswered('success') // Cập nhật trạng thái trả lời là thành công
      setIsAnswerSuggClick(true) // Cập nhật state đã click của nút "Trả lời nhanh" thành true
      dispatch(setAnswerSuggestion(itemAnswer)) // Gửi action Redux để hiển thị câu trả lời gợi ý
    } catch (error) {
      console.log(error)
      setTypeAnswered('error') // Cập nhật trạng thái trả lời là lỗi
      throw error // Ném lỗi để xử lý ở cấp độ cao hơn
    }
  }

  // useEffect để thêm và xóa event listener cho việc click bên ngoài dropdown menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside) // Thêm event listener khi component được mount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside) // Xóa event listener khi component bị unmount
    }
  }, [])

  // Hàm xử lý sự kiện click vào nút "Dịch"
  const handleTranslation = () => {
    dispatch(translationMessage({ message: props.message, id: props.id })) // Gửi action Redux để dịch nội dung tin nhắn
  }
  //ham xu ly su kien text to speech
  function base64ToBlob(base64, mime) {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mime })
  }
  const handleTextToSpeech = async () => {
    try {
      const response = await textToSpeech(props.message, 'en-US', 'emily')
      const audioBlob = base64ToBlob(response.audio_data, `audio/${response.audio_format}`)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (err) {
      console.log('Error:', err)
    }
  }
  // Render component
  return (
    <div className='relative'>
      <ul className='mr-4 overflow-x-hidden font-semibold md:flex md:items-center'>
        {/* Nút "Dịch" */}
        <li className='mr-1 p-1'>
          <button
            id='setting'
            className='rounded-md p-1 hover:bg-blue-400'
            onClick={handleTranslation}
          >
            <RiTranslate size={14} />
          </button>
        </li>
        {/* Nút text to speech" */}
        <li className='mr-1 p-1'>
          <button
            id='setting'
            className='rounded-md p-1 hover:bg-blue-400'
            onClick={handleTextToSpeech}
          >
            <TiMicrophoneOutline size={14} />
          </button>
        </li>
        {/* Nút "Trả lời nhanh" */}
        <li className='mr-1 p-1'>
          <button
            id='setting'
            className='rounded-md p-1 hover:bg-blue-400'
            onClick={() => {
              console.log(props.message)
              handleClickAnswer()
              handleAnswerQuestion(props.message)
            }}
          >
            <MdOutlineQuickreply size={14} />
          </button>
        </li>
        {/* Nút "Thêm tùy chọn" */}
        <li className='mr-1 p-1'>
          <button
            id='setting'
            className='rounded-md p-1 hover:bg-blue-400'
            ref={buttonRef}
            onClick={handleMoreClick}
          >
            <SlOptions size={14} />
          </button>
        </li>
      </ul>
      {/* Dropdown menu */}
      <div className='' ref={dropdownRef}>
        {isOptionBtnClick && (
          <DropdownOption
            idMessage={props.id}
            owner={props.owner}
            message={props.message}
            sender={props.sender}
          />
        )}
      </div>
    </div>
  )
})

export default FeatureAI

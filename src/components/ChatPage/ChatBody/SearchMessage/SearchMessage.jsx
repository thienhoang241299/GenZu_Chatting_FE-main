import { IoIosSearch, IoIosClose, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { updateStateSearch } from '@/redux/Slice/messageSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { searchMessageByKeyword } from '@/redux/Slice/chatSlice'
// import { searchMessage } from '@/redux/Slice/messageSlice'

export default function SearchMessage(props) {
  const resultMessage = useSelector((state) => state.message.resultMessage)
  const [index, setIndex] = useState()
  const [inputStr, setInputStr] = useState('')
  const dispatch = useDispatch()
  // Xử lý đóng search message
  const handleCloseBtn = (e) => {
    dispatch(updateStateSearch(false))
  }
  const handleDeleteStr = (e) => {
    setInputStr('')
  }
  // Hàm xử lý khi nội dung input field thay đổi
  const handleChangeInput = (e) => {
    setInputStr(e.target.value)
  }
  // Xử lý sự kiện nhấn phím Enter trong input field
  const handleKeyPress = (e) => {
    // Kiểm tra nếu phím Enter được nhấn
    if (e.keyCode === 13) {
      // Gửi tin nhắn
      handleSearchMsg()
    }
  }
  // Hàm xử lý gửi tin nhắn
  const handleSearchMsg = () => {
    // Kiểm tra text khác null, undefined và rỗng
    if (inputStr != null && inputStr != undefined && inputStr != '') {
      const searchItem = {
        idConversation: props.idConversation,
        keyword: inputStr,
      }
      // Dispatch action gửi tin nhắn
      dispatch(searchMessageByKeyword(searchItem))
    }
  }
  useEffect(() => {
    setIndex(props.indexMgs)
  }, [props.indexMgs])
  return (
    <div className='relative flex items-center space-x-2 rounded-lg bg-mainBlue px-4 pb-4 pt-1 dark:bg-darkBlack'>
      <button className='items-center rounded-full hover:bg-blue-400 dark:hover:bg-[#357ABD]'>
        <IoIosSearch size={24} />
      </button>
      <input
        placeholder='Nhập tin nhắn...'
        onChange={handleChangeInput}
        onKeyDown={handleKeyPress}
        value={inputStr}
        className='mr-2 flex-1 rounded-full border bg-white px-4 py-2 outline-cyan-600 focus:outline dark:bg-black dark:text-white'
      />
      {inputStr && (
        <button
          title='Xóa'
          className='items-center rounded-md hover:bg-blue-400 dark:hover:bg-[#357ABD]'
          onClick={handleDeleteStr}
        >
          <IoIosClose size={24} />
        </button>
      )}
      {/* {(resultMessage != undefined) && (index > 0 && index < resultMessage.length) 
                    ? 
                    (   <button className='items-center rounded-md  hover:bg-blue-400 dark:hover:bg-[#357ABD]'
                                onClick={props.handleArrowUpBtn}>
                                    <IoIosArrowUp size={24}/>
                        </button>)
                    : ( <button type="button" className="text-gray-300" disabled>
                                    <IoIosArrowUp size={24}/>
                        </button>)} */}

      {/* {(resultMessage != undefined) && (index >= 0 && index < resultMessage.length-1) ? (<button className='items-center rounded-md  hover:bg-blue-400 dark:hover:bg-[#357ABD]'
                                                            onClick={props.handleArrowDownBtn}>
                                                        <IoIosArrowDown size={24}/>
                                                    </button>)
                                                : (<button type="button" className="text-gray-300" disabled>
                                                        <IoIosArrowDown size={24}/>
                                                    </button>)}
                 */}
      <button
        title='Đóng tìm kiếm'
        className='rounded-ms items-center hover:bg-blue-400 dark:hover:bg-[#357ABD]'
        onClick={handleCloseBtn}
      >
        <span className='dark:text-white'> Đóng</span>
      </button>
    </div>
  )
}

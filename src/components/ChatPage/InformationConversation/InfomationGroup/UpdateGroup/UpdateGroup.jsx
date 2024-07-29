import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { updateGroupChat } from '@/redux/Slice/userSlice'

const UpdateGroup = ({ isVisible, onClose, group }) => {
  const [groupName, setGroupName] = useState(group?.chatName || '')
  const [groupImage, setGroupImage] = useState(group?.avatar || '')
  const [background, setBackground] = useState(group?.background?.url || '#ffffff')
  const [backgroundType, setBackgroundType] = useState(group?.background?.backgroundType || 'color')
  const popupRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    setGroupName(group?.chatName || '')
    setGroupImage(group?.avatar || '')
    setBackground(group?.background?.url || '#ffffff')
    setBackgroundType(group?.background?.backgroundType || 'color')
  }, [group])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  const handleUpdateGroup = (e) => {
    e.preventDefault()
    const backgroundObject = {
      url: background,
      backgroundType: backgroundType,
    }
    console.log({
      groupId: group._id,
      chatName: groupName,
      avatar: groupImage,
      background: backgroundObject,
    })
    dispatch(
      updateGroupChat({
        groupId: group._id,
        chatName: groupName,
        avatar: groupImage,
        background: backgroundObject,
      }),
    )
    onClose()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGroupImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundChange = (e) => {
    if (e.target.type === 'color') {
      setBackground(e.target.value)
      setBackgroundType('color')
    } else {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setBackground(reader.result)
          setBackgroundType('image')
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const isColorValue = (value) => {
    return typeof value === 'string' && value.match(/^#[0-9A-Fa-f]{6}$/)
  }

  if (!isVisible) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg' ref={popupRef}>
        <button
          className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
          onClick={onClose}
        >
          <MdOutlineClose size={24} />
        </button>
        <h2 className='mb-4 text-2xl font-bold'>Update Group</h2>
        <form onSubmit={handleUpdateGroup}>
          <div className='mb-4'>
            <label className='block text-sm font-semibold text-gray-700'>Group Name</label>
            <input
              type='text'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className='w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-semibold text-gray-700'>Group Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring'
            />
            {groupImage && (
              <img src={groupImage} alt='Group' className='mt-2 h-24 w-24 rounded-full' />
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-semibold text-gray-700'>Background</label>
            <div className='flex items-center'>
              <input
                type='color'
                value={isColorValue(background) ? background : '#ffffff'}
                onChange={handleBackgroundChange}
                className='h-10 w-10 rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring'
              />
              <input
                type='file'
                accept='image/*'
                onChange={handleBackgroundChange}
                className='ml-4 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring'
              />
            </div>
            {backgroundType === 'image' && background && (
              <img
                src={background}
                alt='Background'
                className='mt-2 h-24 w-full rounded-md object-cover'
              />
            )}
          </div>
          <button
            type='submit'
            className='w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring'
          >
            Update Group
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateGroup

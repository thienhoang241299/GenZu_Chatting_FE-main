import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './EditAndSetting.scss'

import EditProfile from './EditProfile/EditProfile'
import SettingGenerate from './SettingGenerate/SettingGenerate'
import { checkCookie, getCookie } from '../../../services/Cookies'

import ToastSuccesful from '../Toast/ToastSuccesful/ToastSuccesful'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../../redux/Slice/userSlice'
import { useTranslation } from 'react-i18next'

export default function EditAndSetting({ isVisible, onClose }) {
  const { t } = useTranslation()

  const [user, setUser] = useState({
    name: { value: 'Hoang Ba Thien', isDisable: true },
    email: { value: 'thienhoang241299@gmail.com', isDisable: true },
    password: { value: '********', isDisable: true },
    phoneNumber: { value: '0345678912', isDisable: true },
    dob: { value: '24/12/1999', isDisable: true },
  })
  const cookie = getCookie('userLogin')
  const [token, SetToken] = useState('')
  const dispatch = useDispatch()
  /// create popup
  const popupRef = useRef()
  const isUpdate = useSelector((state) => state.user.editUser)
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
  useLayoutEffect(() => {
    if (checkCookie) {
      if (getCookie('userLogin')) {
        const userLogin = JSON.parse(getCookie('userLogin'))
        SetToken(userLogin.accessToken)
        setUser(userLogin.user)
      } else {
        const userLogin = JSON.parse(sessionStorage.getItem('userLogin'))
        SetToken(userLogin.accessToken)
        setUser(userLogin.user)
      }
    }
  }, [cookie])

  useEffect(() => {
    if (isUpdate) {
      setTimeout(() => {
        dispatch(updateUser(false))
      }, 3000)
    }
  })

  ////
  if (!isVisible) {
    return null
  }

  return (
    <>
      {isUpdate && <ToastSuccesful message={t('change_success')} />}
      <div className='EditAndSetting fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='relative flex h-screen justify-around rounded-lg bg-white p-6 shadow-lg'>
          <button
            className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
            onClick={onClose}
          >
            &times;
          </button>
          <EditProfile user={user} token={token} />
          <SettingGenerate user={user} />
        </div>
      </div>
    </>
  )
}

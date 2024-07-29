import { useState, useEffect } from 'react'
import { getCookie, setCookie } from '../../../../services/Cookies'
import { useDispatch } from 'react-redux'
import userService from '@/services/userService'
import { updateUser } from '../../../../redux/Slice/userSlice'
import { useTranslation } from 'react-i18next'
import { storage } from '@/utils/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const EditProfile = ({ user, token }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    address: user?.address || '',
    gender: user?.gender || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber,
    picture: user?.picture || '',
  })
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(profile.picture || '/default-avatar.png')

  useEffect(() => {
    return () => {
      // Cleanup URL object to avoid memory leaks
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userId = user?._id
    let imageUrl = profile.picture

    if (image) {
      const storageRef = ref(storage, `avatars/${userId}/${image.name}`)
      await uploadBytes(storageRef, image)
      imageUrl = await getDownloadURL(storageRef)
    }

    const updatedProfile = { ...profile, picture: imageUrl }
    try {
      const updatedUser = await userService.updateUser(userId, updatedProfile)
      dispatch(updateUser(true))
      if (getCookie('userLogin')) {
        let jsonUser = JSON.parse(getCookie('userLogin'))
        setCookie(
          'userLogin',
          JSON.stringify({
            accessToken: jsonUser.accessToken,
            refreshToken: jsonUser.refreshToken,
            user: updatedUser.user,
          }),
          7,
        )
      }
    } catch (error) {
      console.error('Failed to update user', error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mr-2 h-full w-full overflow-y-auto rounded-lg bg-white p-4 shadow-md dark:bg-[#1E1E1E] md:w-6/12'
    >
      <h2 className='mb-4 text-center text-2xl font-semibold dark:text-white'>
        {t('edit_profile')}
      </h2>
      <div className='mb-4 flex justify-center'>
        <label htmlFor='upload-image' className='cursor-pointer'>
          <img
            src={previewImage}
            alt='User avatar'
            className='h-32 w-32 rounded-full border-2 border-gray-200 object-cover hover:border-blue-500'
          />
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
            id='upload-image'
          />
        </label>
      </div>
      {Object.keys(profile).map((key) => (
        <div key={key} className='mb-4'>
          <label className='mb-2 block text-sm font-bold capitalize text-gray-700 dark:text-white'>
            {t(key)}
          </label>
          {key === 'gender' ? (
            <select
              name={key}
              value={profile[key]}
              onChange={handleChange}
              className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:text-white'
            >
              <option value='male'>{t('male')}</option>
              <option value='female'>{t('female')}</option>
              <option value='other'>{t('other')}</option>
            </select>
          ) : (
            <input
              type={key === 'email' ? 'email' : 'text'}
              name={key}
              value={profile[key]}
              onChange={handleChange}
              className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
            />
          )}
        </div>
      ))}
      <button
        type='submit'
        className='focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none md:w-auto'
      >
        {t('update_profile')}
      </button>
    </form>
  )
}

export default EditProfile

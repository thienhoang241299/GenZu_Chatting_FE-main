import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { setCookie } from '../../../services/Cookies'
import { storage } from '@/utils/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import logo from '../../../assets/logo.png'
const SignUpComponent = () => {
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('male')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [imageFile, setImageFile] = useState()
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (imageFile) {
        console.log('Input là một file')
        await uploadAndSignUp()
      } else if (imageUrl) {
        console.log('Input là một string')
        await signUpWithExistingPicture()
      }
    } catch (err) {
      console.error('Sign up failed:', err)
      setError('Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  const signUpWithExistingPicture = async (imgUrl = imageUrl) => {
    console.log(imgUrl)
    try {
      const response = await axios.post(
        'https://genzu-chatting-be.onrender.com/auth/sign-up',
        {
          fullName,
          address,
          gender,
          email,
          password,
          picture: imgUrl,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      setIsSuccess('Sign Up successful, please confirm in your email')
    } catch (error) {
      // Xử lý lỗi ở đây, ví dụ:
      // console.error('Sign up failed:', error.response.data.message)
      // Hiển thị thông báo lỗi cho người dùng
      setError(error.response.data.message)

      // return error;
    }
  }
  const uploadAndSignUp = async () => {
    console.log(imageFile)
    const storageRef = ref(storage, `image/${imageFile.name}`)
    uploadBytes(storageRef, imageFile)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref)
      })
      .then((downloadURL) => {
        setImageUrl(downloadURL)
        signUpWithExistingPicture(downloadURL)
      })
  }
  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
      setImageUrl(URL.createObjectURL(e.target.files[0])) // Hiển thị preview
    } else if (e.target.value) {
      setImageUrl(e.target.value)
    }
  }
  const handleSelectFile = () => {
    document.getElementById('picture-file').click()
  }
  return (
    <div className='flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <img className='mx-auto h-12 w-auto' src={logo} alt='Logo' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSignUp}>
          <input type='hidden' name='remember' value='true' />
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='fullName' className='sr-only'>
                Full Name
              </label>
              <input
                id='fullName'
                name='fullName'
                type='text'
                autoComplete='name'
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Full Name'
              />
            </div>
            <div>
              <label htmlFor='address' className='sr-only'>
                Address
              </label>
              <input
                id='address'
                name='address'
                type='text'
                autoComplete='address'
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Address'
              />
            </div>
            <div>
              <label htmlFor='gender' className='sr-only'>
                Gender
              </label>
              <select
                id='gender'
                name='gender'
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className='relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Email address'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Password'
              />
            </div>
            <div className='flex'>
              <label htmlFor='picture' className='sr-only'>
                Profile Picture
              </label>
              <input
                id='picture'
                name='picture'
                type='text'
                autoComplete='url'
                value={imageFile ? imageFile?.name : ''}
                onChange={handlePictureChange}
                className='relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Profile Picture URL'
              />
              <input
                id='picture-file'
                name='picture'
                type='file'
                accept='image/*'
                onChange={handlePictureChange}
                className='hidden'
              />
              <button type='button' onClick={handleSelectFile}>
                Select Image
              </button>
            </div>
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}
          {isSuccess && <p className='text-sm text-green-500'>{isSuccess}</p>}

          <div>
            <button
              type='submit'
              className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Or
              <a
                onClick={() => {
                  navigate('/login')
                }}
                href='#'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Sign in your account
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUpComponent

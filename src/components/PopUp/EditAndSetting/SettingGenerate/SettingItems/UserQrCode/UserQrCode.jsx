import QRCode from 'react-qr-code'
import { IoMdArrowBack } from 'react-icons/io'

const UserQrCode = ({ user, onBack }) => {
  const profileUrl = `${window.location.origin}/profile/${user?._id}`

  return (
    <div className='z-10 flex w-full translate-x-0 transform flex-col transition-transform'>
      <div className='flex w-full cursor-pointer items-center justify-start border-b-2 border-gray-200 bg-white p-2'>
        <button onClick={onBack} className='mr-4'>
          <IoMdArrowBack size={22} />
        </button>
        <h3 className='text-xl font-semibold'>QR Code</h3>
      </div>
      <div className='flex flex-col items-center justify-center p-4'>
        <div className='rounded-lg bg-white p-4 shadow-lg'>
          <QRCode value={profileUrl} size={256} />
        </div>
        <p className='mt-4 text-center text-lg font-medium'>{user?.fullName}</p>
      </div>
    </div>
  )
}

export default UserQrCode


import DetailProfile from './DetailProfile/DetailProfile'

export default function ViewProfile({ user, onClose }) {
  return (
    <div className='ViewProfile fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative flex justify-around rounded-lg bg-mainBlue p-6 shadow-lg'>
        <button
          className='absolute right-2 top-2 transition ease-in-out delay-75  hover:-translate-y-1 hover:scale-110 hover:text-gray-700 duration-300 text-gray-500'
          onClick={onClose}
        >
          &times;
        </button>
        <DetailProfile user={user} />
      </div>
    </div>
  )
}

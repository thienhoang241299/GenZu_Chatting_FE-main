import { SlOptions } from 'react-icons/sl'
import { MdPhone, MdVideocam } from 'react-icons/md'

const ChatHeaderSkeleton = () => {
  // Replace with actual Redux state selector

  return (
    <header className='mb-2 flex items-center justify-between rounded-lg bg-mainBlue px-8 py-4 shadow-xl dark:bg-[#6c8ea3]'>
      <div className='flex cursor-pointer items-center space-x-4'>
        {/* User Avatar Placeholder with pulse animation */}
        <div className='h-16 w-16 animate-pulse rounded-full bg-gray-300'></div>
        <div className='flex flex-col'>
          {/* User Name Placeholder with pulse animation */}
          <div className='mb-1 h-6 w-32 animate-pulse bg-gray-300'></div>
          {/* Active Time Placeholder with pulse animation */}
          <div className='h-4 w-20 animate-pulse bg-gray-200'></div>
        </div>
      </div>
      {/* Action Buttons Placeholder */}
      <div className='flex space-x-2 md:space-x-6'>
        <button className='rounded-md p-2 hover:bg-blue-400 dark:hover:opacity-85'>
          <MdPhone size={22} />
        </button>
        <button className='rounded-md p-2 hover:bg-blue-400 dark:hover:opacity-85'>
          <MdVideocam size={22} />
        </button>
        <button className='rounded-md p-2 hover:bg-blue-400 dark:hover:opacity-85'>
          <SlOptions size={22} />
        </button>
      </div>
    </header>
  )
}

export default ChatHeaderSkeleton

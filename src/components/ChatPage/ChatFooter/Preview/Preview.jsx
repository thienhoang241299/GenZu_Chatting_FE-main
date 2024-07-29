import { TiDeleteOutline } from 'react-icons/ti'

export default function Preview({ previewUrl, onDelete, isUploading }) {
  return (
    <div className='px-6'>
      <div className='relative inline-block'>
        {previewUrl.type === 'image' ? (
          <img src={previewUrl.url} alt='Preview' style={{ width: 'auto', height: '160px' }} />
        ) : previewUrl.type === 'video' ? (
          <video src={previewUrl.url} alt='Preview' style={{ width: 'auto', height: '160px' }} />
        ) : previewUrl.type === 'file' ? (
          <a href={previewUrl.url} download>
            <img
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAzHuAroNuDhtPXeGxXfL-Idoctgcv2wPggA&s'
              alt='image file'
              style={{ width: 'auto', height: '160px' }}
            />
          </a>
        ) : null}

        <button className='absolute -right-3 -top-3' onClick={onDelete}>
          <TiDeleteOutline />
        </button>

        {isUploading && (
          <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
            <div className='flex flex-col items-center rounded-md p-4'>
              <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-gray-200'></div>
              <p className='mt-2 text-white'>Uploading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { IoMdArrowBack } from 'react-icons/io'
import { CiImageOn } from 'react-icons/ci'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const GeneralSettings = ({ onBack }) => {
  const [textSize, setTextSize] = useState(14)
  const { t } = useTranslation()

  const handleSliderChange = (event) => {
    setTextSize(event.target.value)
  }
  return (
    <div className='z-10 flex w-full translate-x-0 transform flex-col transition-transform'>
      <div className='flex w-auto cursor-pointer items-center justify-start border-b-2 border-gray-200 bg-white p-2'>
        <button onClick={onBack} className='mr-4'>
          <IoMdArrowBack size={22} />
        </button>
        <h3 className='text-xl font-semibold'>{t('general')}</h3>
      </div>
      <h4 className='mt-2 text-base text-slate-500'>{t('setting')}</h4>

      <div className='flex w-full flex-col rounded-lg'>
        <div className='flex flex-col items-center space-x-4 p-2'>
          <div className='my-2 flex w-full items-center justify-between'>
            <span className='space-x-4 text-black'>Message Text Size</span>
            <span className='ml-8 text-gray-500'>{textSize}</span>
          </div>
          <input
            type='range'
            min='10'
            max='30'
            value={textSize}
            defaultValue={textSize}
            onChange={handleSliderChange}
            className='my-2 w-full'
          />
        </div>
        <div className='mb-2 flex w-full items-center justify-start space-x-4 rounded-lg px-2 py-4 hover:bg-slate-100'>
          <CiImageOn size={24} />
          <p>Chat Wallpaper</p>
        </div>
        <div className='top-0 my-auto w-full rounded-md border bg-slate-200'></div>
        <label className='mt-2 text-base text-slate-500'>Time Format</label>
        <div className='flex w-full flex-col rounded-lg p-4'>
          <div className='flex-start flex flex-col'>
            <div className='flex-start my-2 flex cursor-pointer items-center'>
              <input
                type='radio'
                id='12-hour'
                name='time-format'
                value='12-hour'
                className='mr-2 cursor-pointer'
              />
              <span htmlFor='12-hour' className='ml-8'>
                12-hour
              </span>
            </div>
            <div className='flex-start my-2 flex items-center'>
              <input
                type='radio'
                id='24-hour'
                name='time-format'
                value='24-hour'
                className='mr-2 cursor-pointer'
              />
              <span htmlFor='24-hour' className='ml-8'>
                24-hour
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralSettings

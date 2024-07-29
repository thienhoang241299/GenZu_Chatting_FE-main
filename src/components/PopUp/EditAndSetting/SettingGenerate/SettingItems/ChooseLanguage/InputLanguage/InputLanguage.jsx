import React from 'react'

const InputLanguage = ({ languageValue, labelName, onChange, checked }) => {
  return (
    <div className='flex cursor-pointer items-center py-2'>
      <input
        type='radio'
        id={languageValue}
        name='language'
        value={languageValue}
        className='mr-2 h-5 w-5 cursor-pointer'
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={languageValue} className='ml-2 text-sm'>
        {labelName}
      </label>
    </div>
  )
}

export default InputLanguage

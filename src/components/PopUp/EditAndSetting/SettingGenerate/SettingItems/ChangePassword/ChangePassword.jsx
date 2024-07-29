import userService from '@/services/userService'
import axios from 'axios'
import React, { useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'

export default function ChangePassword({ onBack }) {
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (password === rePassword) {
      try {
        await userService.ChangePassword(oldPassword, password)
        setLoading(false)
        // Optionally reset form fields or show success message here
      } catch (err) {
        console.error(err)
        setError('Có lỗi xảy ra khi đổi mật khẩu')
        setLoading(false)
      }
    } else {
      setError('Mật khẩu không khớp')
      setLoading(false)
    }
  }
  return (
    <div className='flex justify-center bg-gray-100'>
      <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md'>
        <div className='flex items-center justify-between border-b pb-4'>
          <button onClick={onBack} className='text-gray-600 hover:text-gray-900'>
            <IoMdArrowBack size={24} />
          </button>
          <h3 className='text-xl font-semibold'>Đổi Mật Khẩu</h3>
        </div>
        <form className='space-y-6' onSubmit={handleChangePassword}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='oldPassword' className='sr-only'>
                Mật Khẩu Cũ
              </label>
              <input
                id='oldPassword'
                name='oldPassword'
                type='password'
                autoComplete='current-password'
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className='block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Nhập mật khẩu cũ của bạn'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Mật Khẩu Mới
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Nhập mật khẩu mới'
              />
            </div>
            <div>
              <label htmlFor='rePassword' className='sr-only'>
                Xác Nhận Mật Khẩu Mới
              </label>
              <input
                id='rePassword'
                name='rePassword'
                type='password'
                autoComplete='new-password'
                required
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className='block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Xác nhận mật khẩu mới'
              />
            </div>
          </div>

          {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}

          <div>
            <button
              type='submit'
              className={`w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={loading}
            >
              {loading ? 'Đang đổi mật khẩu...' : 'Đổi Mật Khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

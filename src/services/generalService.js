import axiosClient from '@/utils/axiosClient'

const changeLanguage = async (language) => {
  try {
    const formData = new FormData()
    formData.append('language', language)

    const response = await axiosClient.patch('/auth/update-language', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Failed to change language', error)
    throw error
  }
}

export default { changeLanguage }

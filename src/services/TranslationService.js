// src/services/translationService.js
import axiosClient from '@/utils/axiosClient'
import axios from 'axios'

const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATION_API_KEY_TRANSLATION
const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

export const translateText = async (id = '', targetLang = 'en') => {
  console.log(id, targetLang)
  try {
    const response = await axiosClient.post('messages/translate', {
      messageIds: [id],
      languageCode: targetLang,
    })
    console.log(response.data)
    if (response.data.data && response.data.data[0].translations[targetLang]) {
      return response.data.data[0].translations[targetLang]
    } else {
      throw new Error('Unexpected response format from translation service')
    }
  } catch (error) {
    console.error('Error translating text:', error)
    throw error // Rethrow the error to propagate it further
  }
}

export const textToSpeech = async (
  input = 'Hello, This is Genzu Chat',
  language = 'en-US',
  voice_id = 'emily',
) => {
  console.log(input, language, voice_id)
  const options = {
    method: 'POST',
    url: 'https://api.sws.speechify.com/v1/audio/speech',
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
      Authorization: import.meta.env.VITE_API_TTS_KEY,
    },
    data: {
      audio_format: 'mp3',
      input: input,
      language: language,
      model: 'simba-base',
      options: { loudness_normalization: true },
      voice_id: voice_id,
    },
  }
  try {
    const response = await axios.request(options)
    return response.data // Đảm bảo trả về dữ liệu
  } catch (error) {
    console.error('Error fetching TTS:', error)
    throw error // Ném lại lỗi để có thể xử lý ở nơi gọi hàm
  }
}

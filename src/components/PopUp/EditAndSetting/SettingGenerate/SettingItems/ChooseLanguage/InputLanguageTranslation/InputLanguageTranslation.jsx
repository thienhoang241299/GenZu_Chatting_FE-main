import { getCookie, setCookie } from '@/services/Cookies'
import axios from 'axios'
import { useState } from 'react'
export default function InputLanguageTranslation() {
  const options = [
    { value: 'af', label: 'Afrikaans' },
    { value: 'sq', label: 'Albanian' },
    { value: 'am', label: 'Amharic' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hy', label: 'Armenian' },
    { value: 'az', label: 'Azerbaijani' },
    { value: 'eu', label: 'Basque' },
    { value: 'be', label: 'Belarusian' },
    { value: 'bn', label: 'Bengali' },
    { value: 'bs', label: 'Bosnian' },
    { value: 'ca', label: 'Catalan' },
    { value: 'hr', label: 'Croatian' },
    { value: 'cs', label: 'Czech' },
    { value: 'da', label: 'Danish' },
    { value: 'nl', label: 'Dutch' },
    { value: 'en', label: 'English' },
    { value: 'eo', label: 'Esperanto' },
    { value: 'et', label: 'Estonian' },
    { value: 'fi', label: 'Finnish' },
    { value: 'fr', label: 'French' },
    { value: 'gl', label: 'Galician' },
    { value: 'ka', label: 'Georgian' },
    { value: 'de', label: 'German' },
    { value: 'el', label: 'Greek' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'ht', label: 'Haitian Creole' },
    { value: 'ha', label: 'Hausa' },
    { value: 'haw', label: 'Hawaiian' },
    { value: 'he', label: 'Hebrew' },
    { value: 'hi', label: 'Hindi' },
    { value: 'hu', label: 'Hungarian' },
    { value: 'is', label: 'Icelandic' },
    { value: 'id', label: 'Indonesian' },
    { value: 'ia', label: 'Interlingua' },
    { value: 'ie', label: 'Interlingue' },
    { value: 'ga', label: 'Irish' },
    { value: 'it', label: 'Italian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'jw', label: 'Javanese' },
    { value: 'kn', label: 'Kannada' },
    { value: 'km', label: 'Khmer' },
    { value: 'ko', label: 'Korean' },
    { value: 'la', label: 'Latin' },
    { value: 'lv', label: 'Latvian' },
    { value: 'lt', label: 'Lithuanian' },
    { value: 'lb', label: 'Luxembourgish' },
    { value: 'mk', label: 'Macedonian' },
    { value: 'mg', label: 'Malagasy' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'ms', label: 'Malay' },
    { value: 'mt', label: 'Maltese' },
    { value: 'mi', label: 'Maori' },
    { value: 'mr', label: 'Marathi' },
    { value: 'my', label: 'Burmese' },
    { value: 'mn', label: 'Mongolian' },
    { value: 'my', label: 'Myanmar (Burmese)' },
    { value: 'ne', label: 'Nepali' },
    { value: 'no', label: 'Norwegian' },
    { value: 'or', label: 'Odia' },
    { value: 'ps', label: 'Pashto' },
    { value: 'fa', label: 'Persian' },
    { value: 'pl', label: 'Polish' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'ro', label: 'Romanian' },
    { value: 'ru', label: 'Russian' },
    { value: 'sm', label: 'Samoan' },
    { value: 'sg', label: 'Sango' },
    { value: 'sa', label: 'Sanskrit' },
    { value: 'sr', label: 'Serbian' },
    { value: 'st', label: 'Sesotho' },
    { value: 'sn', label: 'Shona' },
    { value: 'sd', label: 'Sindhi' },
    { value: 'si', label: 'Sinhala' },
    { value: 'sk', label: 'Slovak' },
    { value: 'sl', label: 'Slovenian' },
    { value: 'so', label: 'Somali' },
    { value: 'es', label: 'Spanish' },
    { value: 'su', label: 'Sundanese' },
    { value: 'sw', label: 'Swahili' },
    { value: 'sv', label: 'Swedish' },
    { value: 'tl', label: 'Tagalog' },
    { value: 'tg', label: 'Tajik' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'th', label: 'Thai' },
    { value: 'tr', label: 'Turkish' },
    { value: 'uk', label: 'Ukrainian' },
    { value: 'ur', label: 'Urdu' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'cy', label: 'Welsh' },
    { value: 'xh', label: 'Xhosa' },
    { value: 'yi', label: 'Yiddish' },
    { value: 'yo', label: 'Yoruba' },
    { value: 'zu', label: 'Zulu' },
  ]

  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const url = 'https://genzu-chatting-be.onrender.com/auth/update-language-translate'
  const userLanguage = JSON.parse(getCookie('userLogin'))?.user?.languageTranslate
  const handleChange = (event) => {
    axios
      .patch(
        url,
        { languageTranslate: event.target.value },
        {
          headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        const newDb = {
          ...JSON.parse(getCookie('userLogin')),
          user: {
            ...JSON.parse(getCookie('userLogin')).user,
            languageTranslate: event.target.value,
          },
        }
        setCookie('userLogin', JSON.stringify(newDb))
      })
      .catch((error) => {
        console.error('Lỗi cập nhật ngôn ngữ:', error)
      })
  }

  return (
    <div className='mt-5 w-full max-w-xs'>
      <select
        className='select select-info h-4 w-full max-w-xs overflow-y-auto'
        onChange={handleChange}
      >
        {options.map((option, index) => {
          const isSelected = userLanguage === option.value
          return (
            <option key={index} value={option.value} disabled={isSelected} selected={isSelected}>
              {option.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

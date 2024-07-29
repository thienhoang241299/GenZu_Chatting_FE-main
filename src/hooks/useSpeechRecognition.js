import { useEffect, useState } from 'react'

let recognition = null
if ('webkitSpeechRecognition' in window) {
  recognition = new window.webkitSpeechRecognition()
  recognition.continuous = true
  recognition.lang = 'en-US'
}

const useSpeechRecognition = () => {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    if (!recognition) return

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      setText(transcript)
      recognition.stop()
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      recognition.stop()
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognition) {
        recognition.onresult = null
        recognition.onerror = null
        recognition.onend = null
      }
    }
  }, [])

  const startListening = () => {
    if (!recognition) return

    setText('')
    setIsListening(true)
    recognition.start()
  }

  const stopListening = () => {
    if (!recognition) return

    setIsListening(false)
    recognition.stop()
  }

  return {
    text,
    isListening,
    startListening,
    stopListening,
    recognitionSupported: !!recognition,
  }
}

export default useSpeechRecognition

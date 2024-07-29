import { useEffect, useState } from 'react'

const useDarkMode = () => {
  const [isDarkMode, setDarkMode] = useState(() => localStorage.theme === 'light')
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode)
  }
  useEffect(() => {
    const html = window.document.documentElement
    const prev = isDarkMode ? 'dark' : 'light'
    html.classList.remove(prev)
    const next = isDarkMode ? 'light' : 'dark'
    html.classList.add(next)
    localStorage.setItem('theme', next)
  }, [isDarkMode])
  return [isDarkMode, toggleDarkMode]
}

export default useDarkMode

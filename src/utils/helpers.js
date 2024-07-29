const isLink = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/
  return urlRegex.test(text)
}

export default isLink

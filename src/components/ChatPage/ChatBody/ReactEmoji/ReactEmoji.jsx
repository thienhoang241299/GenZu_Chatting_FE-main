import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
export default function ReactEmoji() {
  const [chosenEmoji, setChosenEmoji] = useState(null)

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject)
    // handleEmote('hello')
  }

  // const handleEmote = (Id) =>{
  //   console.log(Id);
  //   props.callBackEmote(Id)
  // }
  return (
    <div>
      {/* {chosenEmoji ? (
          
          // <>
            // <img src={`${chosenEmoji.srcElement.currentSrc}`} 
            //     alt="smiley" 
            //     className={`${chosenEmoji.srcElement.className}`}
            //     loading="eager" />
          // </>
        ) : (
          // <span>No emoji Chosen</span>
          <></>
        )} */}
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  )
}

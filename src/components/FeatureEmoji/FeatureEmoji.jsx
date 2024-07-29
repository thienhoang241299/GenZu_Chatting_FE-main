import React, { useState } from 'react'
import Picker from 'emoji-picker-react'
import { useDispatch } from 'react-redux'
import { handleEmojiOnMessage } from '../../redux/Slice/messageSlice'

function FeatureEmoji(props) {
  const dispatch = useDispatch()

  const onEmojiClick = (event) => {
    let id_emoji
    props.item.emojiBy.map((emote) => {
      if (emote.sender._id == props.sessionId) {
        id_emoji = emote._id
      }
    })
    const itemMessage = {
      id_emoji,
      id_user: props.sessionId,
      id_message: props.item._id,
      emoji: event.emoji,
      idConversation: props.item.conversation._id,
    }
    dispatch(handleEmojiOnMessage(itemMessage))
    props.handleCallBack()
  }

  return (
    <div>
      <Picker
        reactionsDefaultOpen={props.isActive}
        onEmojiClick={onEmojiClick}
        lazyLoadEmojis={true}
      />
    </div>
  )
}

export default FeatureEmoji

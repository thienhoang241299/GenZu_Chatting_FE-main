import { getCookie } from '@/services/Cookies'

const RenderNotification = ({ item }) => {
  const userId = JSON.parse(getCookie('userLogin')).user._id

  if (item.message === '3001' || item.message === '3006') {
    if (item.affected_user_id && item.sender._id === userId && item.conversation.isGroupChat) {
      return (
        <p>
          {'Bạn vừa thêm ' +
            item?.affected_user_id?.fullName +
            ' vào nhóm ' +
            item.conversation?.chatName}
        </p>
      )
    } else if (
      item.affected_user_id &&
      item.affected_user_id?._id === userId &&
      item.conversation?.isGroupChat
    ) {
      return <p>{item.sender?.fullName + ' thêm bạn vào nhóm ' + item.conversation?.chatName}</p>
    } else if (item.affected_user_id && item.conversation?.isGroupChat) {
      return (
        <p>
          {item.sender?.fullName +
            ` thêm ${item.affected_user_id?.fullName} vào nhóm ` +
            item.conversation?.chatName}
        </p>
      )
    }
  }

  if (item.message === '7008') {
    return <p>{item.sender?.fullName + ` vừa thay đổi background`}</p>
  }

  if (item.message === '3007') {
    if (item.sender._id === userId && item.conversation.isGroupChat) {
      return <p>{"Bạn" + ` đã xoá ` + item.affected_user_id?.fullName}</p>
    } else {
      return <p>{item.sender?.fullName + ` đã xoá ` + item.affected_user_id?.fullName}</p>
    }
  }

  if (item.sender?._id !== userId && item.message === '3011') {
    if (item.conversation.isGroupChat) {
      return <p>{item.sender?.fullName + ` đã rời khỏi nhóm ` + item.conversation?.chatName}</p>
    }
  }
}
export default RenderNotification

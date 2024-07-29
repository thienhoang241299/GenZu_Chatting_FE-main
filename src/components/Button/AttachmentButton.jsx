const AttachmentButton = ({ icon: Icon, color, onAttachBtnClick }) => {
  return (
    <button
      className={`transform rounded-full bg-${color}-500 p-4 shadow-xl transition-transform duration-300 hover:scale-110 hover:bg-${color}-600`}
      onClick={onAttachBtnClick}
    >
      <Icon className='text-white' size={16} />
    </button>
  )
}

export default AttachmentButton

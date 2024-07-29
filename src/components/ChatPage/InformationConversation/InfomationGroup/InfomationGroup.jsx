import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { IoImageOutline } from 'react-icons/io5'
import { SlOptions } from 'react-icons/sl'
import { LiaUserFriendsSolid } from 'react-icons/lia'
import { MdDeleteOutline } from 'react-icons/md'
import { IoLogInOutline } from 'react-icons/io5'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { FaRegEdit, FaRegImage } from 'react-icons/fa'
import { MdOutlineAddLink } from 'react-icons/md'
import ViewProfile from '@/components/PopUp/ViewProfile/ViewProfile'
import DropdownItem from '@/components/Sidebar/DropdownItem/DropdownItem'
import { deleteGroupChat, setIsDeleteGroupChat } from '@/redux/Slice/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import AddNewMember from './AddNewMember/AddNewMember'
import ViewMember from './ViewMember/ViewMember'
import UpdateGroup from './UpdateGroup/UpdateGroup'
import { removeMemberFromGroup } from '@/redux/Slice/userSlice'
import { fetchLsImage, fetchLsVideo } from '@/services/messageService'
import { GoVideo } from 'react-icons/go'
import noImage from '../../../../assets/noImage.jpg'
import { getCookie } from '@/services/Cookies'

const InfomationGroup = ({ conversation }) => {
  const dispatch = useDispatch()
  // State to manage the visibility of the AddNewMember popup
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false)
  const [isViewMemberVisible, setIsViewMemberVisible] = useState(false)
  const [isUpdateGroupVisible, setIsUpdateGroupVisible] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [lsImage, setLsImage] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [lsVideo, setLsVideo] = useState()
  const { idConversation } = useParams()
  const [idConversationCurrent, setIdConversationCurrent] = useState(useParams())
  const currentUserId = JSON.parse(getCookie('userLogin')).user?._id
  console.log(JSON.parse(getCookie('userLogin')).user)
  const listGroupChats = useSelector((state) => state.user?.lsGroupChats)
  const groupAdminId = listGroupChats.find((group) => group._id === idConversation)?.groupAdmin?._id
  const totalMembers = listGroupChats.find((group) => group._id === idConversation)?.users || []
  const countMembers = listGroupChats.find((group) => group._id === idConversation)?.users.length

  const handleDeleteGroup = (idGroup) => {
    dispatch(setIsDeleteGroupChat())
    dispatch(deleteGroupChat({ id: idGroup }))
  }

  const handleAddNewMemberClick = () => {
    setIsAddMemberVisible(true) // Show the AddNewMember popup
  }

  const handleLeaveGroup = (idConversation, idMember) => {
    const groupId = idConversation
    const memberId = idMember
    dispatch(removeMemberFromGroup({ groupId, memberId }))
  }

  const handleViewMemberClick = () => {
    setIsViewMemberVisible(true)
  }

  const handleOpenUpdateGroup = () => {
    setIsUpdateGroupVisible(true)
  }

  const handleViewMemberClose = () => {
    setIsViewMemberVisible(false)
  }

  const handleAddMemberClose = () => {
    setIsAddMemberVisible(false) // Hide the AddNewMember popup
  }

  const handleUpdateGroupClose = () => {
    setIsUpdateGroupVisible(false) // Hide the Update group popup
  }
  const hanldeGetLsImage = async () => {
    if (showImage == false) {
      GetLsImage()
    }
    setShowImage(!showImage)
  }
  const GetLsImage = async () => {
    const response = await fetchLsImage(idConversation)
    setLsImage(response)
  }
  const hanldeGetLsVideo = async () => {
    console.log(showVideo)
    if (showVideo == false) {
      GetLsVideo()
    }
    setShowVideo(!showVideo)
  }
  const GetLsVideo = async () => {
    const response = await fetchLsVideo(idConversation)
    setLsVideo(response)
  }
  useEffect(() => {
    idConversation != idConversationCurrent.idConversation && (setLsImage(null), setLsVideo(null))
  }, [idConversation])
  return (
    <div className='flex h-screen flex-col items-center pb-10'>
      <h3 className='my-2 text-xl font-medium text-gray-900 dark:text-white'>Thông tin nhóm</h3>
      <img
        className='mb-3 h-24 w-24 rounded-full shadow-lg'
        src={conversation?.avatar}
        alt={conversation?.chatName}
      />
      <h3 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
        {conversation?.chatName}
      </h3>

      <div>
        <ul className='mb-2 cursor-pointer flex-col gap-2 overflow-x-hidden rounded-lg bg-white px-4 py-2 shadow-lg dark:bg-[#1E1E1E]'>
          <DropdownItem
            icon={LiaUserFriendsSolid}
            label={`${countMembers} thành viên`}
            dropdownStyle={'p-2 dark:text-white'}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={handleViewMemberClick}
          />
          <DropdownItem
            icon={MdOutlineAddLink}
            label={'Link tham gia nhóm'}
            dropdownStyle={'p-2 dark:text-white'}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={() => {}}
          />
        </ul>
      </div>
      <div className='overflow-y-auto'>
        <ul className='mx-2 flex-col overflow-x-hidden rounded-lg bg-white px-6 py-2 font-semibold shadow-lg dark:bg-[#1E1E1E] md:flex'>
          <DropdownItem
            icon={IoIosSearch}
            label={'Search chat'}
            dropdownStyle={'p-2 dark:text-white'}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={() => {}}
          />
          <DropdownItem
            icon={FaRegImage}
            label={'List of images'}
            dropdownStyle={'p-2 text-black dark:text-white '}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={hanldeGetLsImage}
          />
          {showImage ? (
            lsImage ? (
              <div className='flex max-h-[calc(3*100px)] flex-wrap gap-[3%] overflow-y-auto'>
                {lsImage?.map((image, index) => (
                  <div key={index} className='my-2 h-[5.5rem] w-[5.5rem]'>
                    <img
                      src={image.message || noImage}
                      className='h-full w-full object-cover'
                      alt='Image not Found '
                      // onError={(e) => {
                      //   e.target.src = { noImage }
                      // }}
                    />
                  </div>
                ))}
              </div>
            ) : lsImage?.length == 0 ? (
              <></>
            ) : (
              <div className='flex'>
                <span className='loading loading-ring loading-xs'></span>
                <span className='loading loading-ring loading-sm'></span>
                <span className='loading loading-ring loading-md'></span>
              </div>
            )
          ) : (
            <></>
          )}
          <hr />
          <DropdownItem
            icon={GoVideo}
            label={'List of Video'}
            dropdownStyle={'p-2 text-black dark:text-white '}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={hanldeGetLsVideo}
          />
          {showVideo ? (
            lsVideo ? (
              <div className='flex max-h-[calc(3*100px)] flex-wrap gap-[2.45%] overflow-y-auto'>
                {lsVideo?.map((video, index) => (
                  <div key={index} className='my-2 h-28 w-28'>
                    <video
                      src={video.message || noImage}
                      className='h-full w-full object-cover'
                      controls
                      alt='Video not Found '
                      // onError={(e) => {
                      //   e.target.src = { noImage }
                      // }}
                    />
                  </div>
                ))}
              </div>
            ) : lsVideo?.length == 0 ? (
              <></>
            ) : (
              <div className='flex'>
                <span className='loading loading-ring loading-xs'></span>
                <span className='loading loading-ring loading-sm'></span>
                <span className='loading loading-ring loading-md'></span>
              </div>
            )
          ) : (
            <></>
          )}
          <hr />
          <DropdownItem
            icon={FaRegEdit}
            label={'Update group'}
            dropdownStyle={'p-2 dark:text-white'}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={handleOpenUpdateGroup}
          />
          <DropdownItem
            icon={IoIosAddCircleOutline}
            label={'Add new member'}
            dropdownStyle={'p-2 dark:text-white'}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={handleAddNewMemberClick} // Show the AddNewMember popup
          />
          {currentUserId === groupAdminId ? (
            <DropdownItem
              icon={MdDeleteOutline}
              label={'Delete group'}
              dropdownStyle={'p-2 dark:text-white'}
              iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
              onClick={() => handleDeleteGroup(conversation._id)}
            />
          ) : (
            <></>
          )}
          {/* <DropdownItem
            icon={MdDeleteOutline}
            label={'Delete group'}
            dropdownStyle={'p-2 dark:text-white'}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600'}
            onClick={() => handleDeleteGroup(conversation._id)}
          /> */}
          <DropdownItem
            icon={IoLogInOutline}
            label={'Leave group'}
            dropdownStyle={'p-2 dark:text-white'}
            iconStyle={'h-9 w-9 p-2 dark:bg-slate-600 da'}
            onClick={() => handleLeaveGroup(conversation._id, currentUserId)}
          />
        </ul>
      </div>

      {/* AddNewMember Popup */}
      {isAddMemberVisible && (
        <AddNewMember isVisible={isAddMemberVisible} onClose={handleAddMemberClose} />
      )}
      {isViewMemberVisible && (
        <ViewMember
          isVisible={isViewMemberVisible}
          members={totalMembers}
          groupAdminId={groupAdminId}
          onClose={handleViewMemberClose}
        />
      )}
      {/* Update group */}
      {isUpdateGroupVisible && (
        <UpdateGroup
          isVisible={isUpdateGroupVisible}
          onClose={handleUpdateGroupClose}
          group={conversation}
        />
      )}
    </div>
  )
}

export default InfomationGroup

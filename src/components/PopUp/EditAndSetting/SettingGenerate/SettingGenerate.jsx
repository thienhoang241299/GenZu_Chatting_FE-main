import { CiSettings } from 'react-icons/ci'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { GrSecure } from 'react-icons/gr'
import { GoDatabase } from 'react-icons/go'
import { IoLanguageOutline } from 'react-icons/io5'
import { PiPasswordFill, PiStickerLight } from 'react-icons/pi'
import { LuFileQuestion } from 'react-icons/lu'
import { MdOutlineWorkspacePremium } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import GeneralSettings from './SettingItems/GeneralSettings/GeneralSettings'
import FriendList from './SettingItems/FriendList/FriendList'
import { RiUser5Line } from 'react-icons/ri'
import SettingItems from './SettingItems/SettingItems'
import ChooseLanguage from './SettingItems/ChooseLanguage/ChooseLanguage'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import UserQrCode from './SettingItems/UserQrCode/UserQrCode'
import ChangePassword from './SettingItems/ChangePassword/ChangePassword'

export default function SettingGenerate({ user }) {
  const { t } = useTranslation()
  const [view, setView] = useState('list')

  const labels = {
    general: t('general_settings'),
    friends: t('friend_lists'),
    language: t('language'),
    profile: t('your_profile'),
    changePassword: t('change_password'),
  }

  const handleItemClick = (label) => {
    if (label === labels.general) {
      setView('general')
    } else if (label === labels.friends) {
      setView('friends')
    } else if (label === labels.language) {
      setView('language')
    } else if (label === labels.profile) {
      setView('profile')
    } else if (label === labels.changePassword) {
      setView('changePassword')
    }
  }

  const handleBack = () => {
    setView('list')
  }

  return (
    <div className='flex h-screen w-full flex-col items-center space-x-2 overflow-y-auto rounded-lg bg-white p-2 dark:bg-[#1E1E1E] md:h-full md:overflow-hidden'>
      {view === 'list' && (
        <>
          <h3 className='mb-2 ml-2 text-2xl font-semibold dark:text-white'>{t('setting')}</h3>
          <div className='w-full rounded-lg'>
            <SettingItems
              icon={CiSettings}
              size={24}
              label={t('general_settings')}
              onSettingItemClick={handleItemClick}
            />
            <SettingItems icon={IoIosNotificationsOutline} size={24} label={t('notification')} />
            <SettingItems icon={GrSecure} size={24} label={t('privacy_security')} />
            <SettingItems icon={GoDatabase} size={24} label={t('data_storage')} />
            <SettingItems
              icon={IoLanguageOutline}
              size={24}
              label={t('language')}
              onSettingItemClick={handleItemClick}
            />
            <SettingItems icon={PiStickerLight} size={24} label={t('stickers_emoji')} />
            <SettingItems
              icon={CgProfile}
              size={24}
              label={t('your_profile')}
              onSettingItemClick={handleItemClick}
            />
            <SettingItems icon={MdOutlineWorkspacePremium} size={24} label={t('get_premium')} />
            <SettingItems
              icon={RiUser5Line}
              size={24}
              label={t('friend_lists')}
              onSettingItemClick={handleItemClick}
            />
            <SettingItems
              icon={PiPasswordFill}
              size={24}
              label={t('change_password')}
              onSettingItemClick={handleItemClick}
            />
          </div>
        </>
      )}
      {view === 'general' && (
        <div className='mb-4 w-full rounded-lg bg-white p-4 shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold'>{t('general_settings')}</h3>
          <GeneralSettings onBack={handleBack} />
        </div>
      )}
      {view === 'friends' && (
        <div className='mb-4 w-full flex-1 overflow-y-auto rounded-lg bg-white p-4 shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold'>{t('friend_lists')}</h3>
          <FriendList onBack={handleBack} />
        </div>
      )}
      {view === 'language' && (
        <div className='mb-4 w-full rounded-lg bg-white p-4 shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold'>{t('language')}</h3>
          <ChooseLanguage onBack={handleBack} />
        </div>
      )}
      {view === 'profile' && (
        <div className='mb-4 w-full rounded-lg bg-white p-4 shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold'>{t('your_profile')}</h3>
          <UserQrCode onBack={handleBack} user={user} />
        </div>
      )}
      {view === 'changePassword' && (
        <div className='mb-4 w-full rounded-lg bg-white p-4 shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold'>{t('change_password')}</h3>
          <ChangePassword onBack={handleBack} />
        </div>
      )}
    </div>
  )
}

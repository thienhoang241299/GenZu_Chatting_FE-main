import { useState } from "react"

export default function DetailProfile({ user }){
    const [profile, setProfile] = useState({
        fullName: user.fullName ,
        address: user.address ,
        gender: user.gender ,
        email: user.email ,
        phoneNumber: user.phoneNumber,
        picture: user.picture ,
      })

    return (
        <div className='w-full rounded-lg bg-mainBlue dark:bg-darkTheme p-4 shadow-md'>
            <div className='flex space-x-2'>
                <h2 className='mb-4 text-2xl text-black dark:text-white font-semibold'>Detail Profile</h2>
                <img
                    className='mb-3 w-24 h-24 rounded-full shadow-lg'
                    src={user.picture}
                    alt='Bonnie image'
                />
            </div>
            {Object.keys(profile).map((key) => (
                <div key={key} className='mb-4'>
                    <label className='mb-2 block text-sm dark:text-white font-bold capitalize text-gray-700'>
                        {key.replace(/([A-Z])/g, ' $1')}
                    </label>

                    <input className='text-gray-600 bg-transparent dark:text-white ' type="text" id="fname" name="fname" Value={profile[key]} disabled/><br/>
                </div>
            ))}
        </div>
    )
}
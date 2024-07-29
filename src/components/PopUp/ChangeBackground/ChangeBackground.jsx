import { useCallback, useLayoutEffect, useState } from "react";
import ExampleBackground from "./ExampleBackground/ExampleBackground";
import SelectBackground from "./SelectBackground/SelectBackground";
import './ChangeBackground.scss'
import { useDispatch, useSelector } from "react-redux";
import { handleChangeBackground } from "@/redux/Slice/userSlice";

export default function ChangeBackground({ onClose}){
    const [previewUrl, setPreviewUrl] = useState({})
    const [imageUrl, setImageUrl] = useState('')
    const [color, setColor] = useState('')
    const conversation = useSelector((state) => state.user.conversation)
    const dispatch = useDispatch()
    const handleBackgroundSelected = useCallback((item) =>{
        switch(item.type){
            case 'color':
                setPreviewUrl({ url: item.colorItem, backgroundType: 'color'})
                break
            case 'image':
                setPreviewUrl({ url: item.url, backgroundType: 'image'})
        }
    })
    const handleChange = (e) =>{
        if(!conversation) return
        
        // const background = color ? { url: color, backgroundType: 'color'} : { url: previewUrl, backgroundType: 'image',}
        const itemBackground = {
            
            background: {background: previewUrl},
            idConversation: conversation._id
        }
        dispatch(handleChangeBackground(itemBackground))
        onClose()
    }
    return (
        <>
            {/* {isUpdate && <ToastSuccesful message={'Thay đổi background thành công'} />} */}
            <div className='changeBackground fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='relative flex flex-col justify-around rounded-lg bg-mainBlue p-6 shadow-lg'>
                
                    <button
                        className='absolute right-2 top-2 transition ease-in-out delay-75  hover:-translate-y-1 hover:scale-110 hover:text-gray-700 duration-300 text-gray-500 '
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    <div className="bg-white dark:bg-darkTheme">
                        <div className="flex text-black dark:text-white">
                            <div className="flex-initial w-56 px-2 border-4 ">
                                <SelectBackground handleCallBack={handleBackgroundSelected}/>

                            </div>
                            <div className="flex-initial w-full border-4">
                                <ExampleBackground previewUrl={previewUrl}/>

                            </div>

                        </div>
                        <div className="flex justify-end space-x-3">
                            <button className="inline-flex items-center rounded-md bg-transparent  text-sm font-semibold
                                            text-gray-400 shadow-sm hover:text-gray-600 focus-visible:outline 
                                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                    onClick={onClose}>
                                    <p> Hủy </p>
                            </button>

                            { !previewUrl.url ? <button disabled className="inline-flex items-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold
                                            text-black dark:text-white shadow-sm cursor-not-allowed"
                                    onClick={() =>{}}>
                                    <p> Xác nhận </p>
                            </button> 
                            :
                            <button className="inline-flex items-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold
                                            text-black dark:text-white shadow-sm hover:text-blue-500 dark:hover:text-neutral-300 focus-visible:outline 
                                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                    onClick={handleChange}>
                                    <p> Xác nhận </p>
                            </button>
                            }
                            
                        </div>
                    </div>

                    
                </div>
                
            </div>
    </>
    )
}
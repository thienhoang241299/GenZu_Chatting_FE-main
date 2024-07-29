import { useEffect, useRef, useState } from "react"
import { storage } from '@/utils/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default function SelectImage(props){
    // const [image, setImage] = useState('');
    const imageRef = useRef(null)
    const handleRemove = () =>{
      imageRef.current.value = ''
    }
    const handleFileChange = async (event, type) => {
       const image = event.target.files[0]
        // Nếu không có file được chọn, thoát khỏi hàm
        if(!image) return
        const storageRef = ref(storage, `image/${image.name}`)
        await uploadBytes(storageRef, image)
        const previewUrl = await getDownloadURL(storageRef)
        console.log('select image image:', previewUrl)
        props.handleCallBack({ url: previewUrl, type: type,  })
      }
      useEffect(()=>{
        handleRemove()
      }, [props.colorType])
    return (
        <div className="w-full">
            <label className="mb-1 font-semibold">Select a image</label>
            <br/>
            <span className="">
                Vui lòng tải ảnh lên
            </span>
            <input
                type='file'
                accept='image/*'
                className='w-full'
                ref={imageRef}
                onChange={(e) => handleFileChange(e, 'image')}
            />
            <button className="border-gray-400 italic font-light" onClick={handleRemove}>remove</button>
        </div>
    )
}
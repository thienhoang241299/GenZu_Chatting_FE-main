import { useLayoutEffect, useState } from "react"
export default function ExampleBackground(props){
    const [backgroundStyle, setBackgroundStyle] = useState({})
    // let backgroundStyle 
    useLayoutEffect(() =>{
        let style
        switch (props.previewUrl.backgroundType) {
            case 'color':
                style = {
                    backgroundColor: props.previewUrl.url
                }
                break;
        
            default:
                style = {
                    backgroundImage: `url(${props.previewUrl.url})`,
                    backgroundSize: 'cover'
                }
                break;
        }
        // if(props.imageUrl){

        //      style = {
        //         backgroundImage: `url(${props.imageUrl})`,
        //         backgroundSize: 'cover'
        //     }
        // }else{
        //      style = {
        //         backgroundColor: props.color
        //     }
            

        // }
        setBackgroundStyle(style)
    }, [props])
    return (
           <div className={`mx-2 flex flex-col h-full`}
                style={backgroundStyle}> 
            <div className="flex justify-end">
                <div
                    className={`my-4 max-w-xs break-words rounded-lg bg-blue-200 pr-2`}
                
                >
                    Theme của bạn sẽ như này
                </div>
            </div>

            <div
                className={`my-4 max-w-xs break-words rounded-lg bg-blue-200 pl-2`}
            
            >
                    Tin nhắn của bạn sẽ được hiện với nội dung theme như này
            </div>
        </div>
    )
}
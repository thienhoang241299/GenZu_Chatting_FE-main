import { useCallback, useState } from "react";
import SelectColor from "./SelectColor/SelectColor";
import SelectImage from "./SelectImage/SelectImage";

export default function SelectBackground(props){
    const [colorType, setColorType] = useState()
    const handleColor = useCallback((itemColor) =>{
        if(colorType != 'color'){
            setColorType(itemColor.type)
        }
        props.handleCallBack(itemColor)
    })

    return (
        <div className="flex flex-col">
            <SelectColor handleCallBack={handleColor}/>
            <div className="mt-5 border">
                <SelectImage handleCallBack={props.handleCallBack} colorType={colorType}/>
            </div>
        </div>
    )
}
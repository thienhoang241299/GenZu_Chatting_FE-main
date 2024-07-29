import { useState } from "react"

export default function SelectColor(props){
    const letterBg = 'bg'
    const letterRing = 'ring'
    // const lstColor = ['bg-black','bg-white','bg-orange','bg-yellow','bg-gray','bg-red','bg-green','bg-blue','bg-pink']
    const lstColor = ['#ffffff','#000000','#e2e8f0', '#cbd5e1', '#94a3b8', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', //Slate
                    '#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', //red
                    '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', //orange
                    '#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12', //yellow
                    '#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#3f6212', '#365314', // lime
                    '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#86efac0', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', //green
                    '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', //blue
                    '#fdf2f8', '#fce7f3', '#fce7f3', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', //pink
                ]
    // const lstVariant = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    const [color, setColor] = useState('#7f1d1d') // default red color
    // const [variant, setVariant] = useState(100)

    const handleColorClick = (itemColor) => {
        setColor(itemColor)
        props.handleCallBack({type: 'color', colorItem: itemColor})
    }
    return(
        <div>
            <label id="color-picker" className="w-5/12 mb-1 font-semibold">Select a color</label>
            <div className='flex flex-wrap'>
                {lstColor.map((item, index)=>
                    <div 
                        key={index}
                        className={`cursor-pointer w-6 h-6 rounded-full mx-1 my-1
                                    ring ring-blue-300`}
                        style={{
                            backgroundColor: `${item}`,
                        }}
                        onClick={() => {
                            handleColorClick(item)
                        }}
                        >

                    </div>
                    // lstVariant.map((blur) => 
                    //     // <div className={`cursor-pointer w-6 h-6 rounded-full mx-1 my-1
                    //     // ring ring-blue-300`}
                    //     //     style={{
                    //     //         backgroundColor: `${item}`,
                    //     //         fontStyle: item.styles.italic ? 'italic' : 'normal',
                    //     //         textDecoration: item.styles.underline ? 'underline' : 'none',
                    //     //       }}></div>
                    // )
                )}
            </div>
        </div>
    )
}
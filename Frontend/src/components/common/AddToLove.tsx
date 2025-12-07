import LoveIcon from "@/assets/icons/love.svg"
import {useEffect, useRef, useState} from "react";

export default function AddToLove({product_id} : {product_id: number}) {
    const [loveCount, setLoveCount] = useState(0);
    const [isLoved, setIsLoved] = useState(false);
    const isLovedRef= useRef(false);
    console.log ("Product id in AddToLove: ", product_id);
    const handleClick = () => {
        setIsLoved(!isLoved);
        setLoveCount(prev => isLoved ? prev - 1 : prev + 1);
        isLovedRef.current = !isLoved;
    }

    useEffect (() => {
        fetch(`http://localhost:5000/api/products/love_status?product_id=${product_id}`, {
            credentials: "include",
        })
        .then (res => res.json())
        .then (data => {
            if (data){
                setIsLoved(data.data.is_loved);
                setLoveCount(data.data.total_loves);
                isLovedRef.current = data.data.is_loved;
            }
        })
        .catch (e => {  
            console.log("Error fetching love status: ", e);
        });
    }, [])

    // Final post on unmount (USE REF TO CONTROL WHEN UNMOUNT ONLY)
    useEffect(() => {
        return () => {
            // Gửi request update backend với trạng thái cuối cùng từ ref
            console.log("Updating love status for product_id:", product_id, " to ", isLovedRef.current);   
            fetch("http://localhost:5000/api/products/update_love_status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    product_id: product_id,
                    love_status: isLovedRef.current,
                }),
            })
            .then(res =>{
                if (!res.ok){
                    throw new Error("Failed to update love status");
                }
                return res.json();
            })
            .then(data => {
                console.log("Successfully updated love status:", data);
            })
            .catch(e => {
                console.log("Error updating love status:", e);
            });

        };
    }, []); 

    return (
        <div className={`z-100 absolute w-fit h-[42px] top-5 right-5 bg-gray-200/50 backdrop-blur-sm rounded-xl flex flex-row items-center gap-1 \
            hover:cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-red-200/50 transition-all duration-300 border border-white/30 ${
                isLoved ? 'hover:bg-red-300/50 bg-red-300/50 scale-105 shadow-lg shadow-red-200/50' : 'hover:bg-red-300/50'
            }`}
            onClick={handleClick}
        >
            {/* Love icon */}
            <img src={LoveIcon} className="flex h-[70%] ml-1"></img>
            {/* Number of love */}
            <div className="text-xl text-white m-1">{loveCount}</div>
        </div>
    );
}
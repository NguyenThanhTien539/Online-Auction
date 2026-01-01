import LoveIcon from "@/assets/icons/love.svg"
import {useEffect, useRef, useState, useCallback} from "react";
import {cn} from "@/lib/utils"
import { toast } from "sonner";





export default function AddToLove({product_id, className} : {product_id: number, className?: string}) {
    const [loveCount, setLoveCount] = useState(0);
    const [isLoved, setIsLoved] = useState(false);
    const isLovedRef = useRef(false);
    const [isSubmit, setIsSubmit] = useState(false);
  

   
    const handleClick = () => {
        if (isSubmit) return; // Prevent multiple clicks while submitting
        setIsSubmit(true);
        const newLoveStatus = !isLoved;

        
        isLovedRef.current = newLoveStatus;
        // Send request to server
        fetch(`http://localhost:5000/api/products/update_love_status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                product_id: product_id,
                love_status: newLoveStatus,
            }),

        })
        .then (res => {
            if (!res.ok) {
                return res.json().then (data => {
                    throw Error ("Need to login to update love status");
                });
            }
            return res.json();
        })
        .then (data => {
            // Update local state immediately for better UX
            setIsLoved(newLoveStatus);
            setLoveCount(prev => newLoveStatus ? prev + 1 : prev - 1);
        })
        .catch ((error) => {
            toast.error(`${error.message}`);
        })
        .finally(()=> {
            setIsSubmit(false);
        });
    }

    useEffect (() => {
        const fetchLoveStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/love_status?product_id=${product_id}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch love status");
                }

                const data = await response.json();

                if(!response.ok){
                    throw Error (data.message);
                }
                setIsLoved(data.data.is_loved);
                setLoveCount(data.data.total_loves);
                isLovedRef.current = data.data.is_loved;
                

            } catch (error) {
                console.error("Error fetching love status: ", error);
            }
        };

        fetchLoveStatus();
    }, [])



    return (
        <div className={cn(`absolute w-fit  h-[42px] top-5 right-5 bg-gray-200/50 backdrop-blur-sm rounded-xl flex flex-row items-center gap-1 \
            hover:cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-red-200/50 transition-all duration-300 border border-white/30 ${
                isLoved ? 'hover:bg-red-400/50 bg-red-300/50 scale-105 shadow-lg shadow-red-200/50' : 'hover:bg-red-300/50'
            }`, className)}
            onClick={handleClick}
        >
            {/* Love icon */}
            <img src={LoveIcon} className="flex h-[70%] ml-1"></img>
            {/* Number of love */}
            <div className="text-xl text-white m-1">{loveCount}</div>
        </div>
    );
}
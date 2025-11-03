import {useEffect, useState, useRef} from "react";



let HoverDropMenu = (handler : any) =>{
    let domRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!domRef.current) return;

        domRef.current.addEventListener("mouseenter", handler);
        domRef.current.addEventListener("mouseleave", handler);
        return () => {
            if (!domRef.current) return;
            domRef.current.removeEventListener("mouseenter", handler);
            domRef.current.removeEventListener("mouseleave", handler);
        }
    }, []);
    return domRef;
}



function DropDownMenuAlpha ({items = [
    {link: "#", option: "Option 1"},
    {link: "#", option: "Option 2"},
    {link: "#", option: "Option 3"}], name = "My dropdown menu"}
){

    const [open, handleOpen] = useState(false);

 

    let domRefHover = HoverDropMenu(() => {
        handleOpen(o => !o);
    });

    return(
        <div ref = {domRefHover} className = "flex w-fit m-5 p-3">
            <div className = "flex relative w-full bg-neutral-800 text-white font-bold justify-center items-center \
                px-4 py-3 rounded-[10px] mb-2">
                <button>
                    {name}
                </button>
                <span className = "pl-1">
                    <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`fill-current ${open ? "rotate-180" : "rotate-0"} transition-all duration-300`}
                      >
                        <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
                      </svg>

                </span>
                <div className = {`flex flex-col shadow-[10px_15px_10px] shadow-black absolute bg-gray-700 w-full mt-4 ${open ? "top-full visible opacity-100" : " top-[150%] invisible opacity-0"} \
                    transition-all duration-300 rounded-[5px] z-50`}>
                        {(items).map((item, index) => (
                            <a key = {index} href = {item.link} className = " p-1 w-full m-1 text-neutral-300 font-semibold hover:text-white">{item.option}</a>
                        ))}
                        

                </div>
            </div>
        </div>
    );
};


export default DropDownMenuAlpha;
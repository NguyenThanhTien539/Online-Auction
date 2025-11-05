import React, { useEffect, useRef, useState } from "react";
import {Link} from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const categoriesData = [
  {
    name: "Thời Trang",
    items: [
      { name: "Áo sơ mi", image: "@/assets/icons/love.svg", link: "/ao-so-mi" },
      { name: "Quần jean", image: "/img/jean.jpg", link: "/quan-jean" },
      { name: "Giày dép", image: "/img/shoes.jpg", link: "/giay-dep" },
    ],
  },
  {
    name: "Điện Tử",
    items: [
      { name: "Laptop", image: "/img/laptop.jpg", link: "/laptop" },
      { name: "Điện thoại", image: "/img/phone.jpg", link: "/dien-thoai" },
      { name: "Tai nghe", image: "/img/headphone.jpg", link: "/tai-nghe" },
    ],
  },

];




function CatagoriesMiniItem({image, name, link} : {image?: string, name?: string, link?: string}){
  if (!name) name = "Category";
  return(
    <Link to = {link ? link : "#"} title = {name}>
      <div className = " h-[130px] aspect-square flex flex-col shrink-0 items-center justify-center ml-2 rounded-2xl border-2\
          hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)] hover:scale-105 hover:cursor-pointer transition-all duration-300 bg-white ">
        {/* Image */}
        <img className = "object-cover h-[80%] aspect-square flex rounded-xl border-2 flex items-center justify-center" src = {image}></img>

      </div>
    </Link>
  );
}

function CatagoriesDetailContent({title, items} : {title: string, items: {name: string, image: string, link: string}[] }){
  return (
    <div className = "bg-gray-300 w-[500px] h-[300px] flex flex-col overflow-y-scroll scrollbar-hide">
      {/* Tittle */}
      <div className = "font-bold text-2xl ml-3 text-black/80 mb-[20px]">{title}</div>

      {/* Content */}
      <div className = "m-5 grid grid-cols-3 gap-3 mx-auto">
        {items.map((item, i) => (
          <CatagoriesMiniItem key={i} image={item.image} name={item.name} link={item.link} />
        ))}

      </div>
    </div>
  );
}



function CatagoriesDropdownMenu(){
  return (
    
      
      <NavigationMenu className = "rounded-2xl min-w-[200px]">
        <NavigationMenuList className = "flex-col w-[100%] flex ">

          {categoriesData.map((category, i) => (
            <React.Fragment key={i}>
              <NavigationMenuItem className="w-full flex">
                <NavigationMenuTrigger className="bg-transparent w-full font-bold min-w-[200px] py-4 h-fit">
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-full flex">
                  <CatagoriesDetailContent title={category.name} items={category.items} />
                </NavigationMenuContent>
              </NavigationMenuItem>

           
              {i !== categoriesData.length - 1 && (
                <div className="block h-[2px] w-[80%] bg-white/50 flex"></div>
              )}
            </React.Fragment>
          ))}

        </NavigationMenuList>

        <NavigationMenuViewport outerClassName = "-top-1 left-[100%]"/>
      </NavigationMenu>
    
  );
}






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



function CatagoriesButton (
   {name = "Categories"} : {name?: string}
){

    const [open, handleOpen] = useState(false);

 

    let domRefHover = HoverDropMenu(() => {
        handleOpen(o => !o);
    });

    return(
        <div ref = {domRefHover} className = "flex w-fit relative py-10 px-3">

            {/* trigger */}
            <div className = "flex relative w-full bg-neutral-800 text-white font-bold justify-center items-center \
                px-4 py-3 rounded-[10px] mb-2 hover:cursor-pointer hover:bg-neutral-500 transition-all duration-300">
                {name}
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
            {/* Drop menu */}
            {open &&
                <div className = "absolute top-[130%] left-0 bg-blue-300 w-fit rounded-2xl shadow-lg shadow-gray-900/10">
                    <CatagoriesDropdownMenu/>
                </div>
            }

            </div>


        </div>
    );
};
export default CatagoriesButton;
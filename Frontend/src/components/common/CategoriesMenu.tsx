import React, { useEffect, useRef, useState } from "react";
import {Link} from "react-router-dom";
import Ronaldo from "@/assets/images/Cristiano.jpg"
import {toast} from "sonner"
import {useNavigate} from "react-router-dom"
import {slugify} from "@/utils/make_slug"

import {
  NavigationMenu,
  NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";









interface catData{
  cat1_id: number,
  name: string,
  items: any
}

function CatagoriesDropdownMenu(){
  const navigate = useNavigate();
  const [catData, setCatData] = useState<catData[]>([]);
  useEffect(()=>{

    const loadData = async () => {
      let response = await fetch("http://localhost:5000/api/categories/all")
      let data = await response.json();
      if (!response.ok){
        console.log("Error in loading all categories ", data.message)
        toast.error("Lỗi kết nối server lấy thông tin categories")
        return;
      }
      else{
        setCatData(data.data);
        console.log("Success in loading all cats");
      }
    }

    loadData();

  }, [])

  const handleClickCat1 = (cat1_id : number, cat1_name : string) => {
    const slug = slugify(cat1_name);
    navigate(`/categories/${slug}-${cat1_id}`)
  }
  


  return (
    
      
      <NavigationMenu className = "min-w-[200px]">
        <NavigationMenuList className = "flex-col w-[100%] flex bg-transparent">

          {catData && catData.map((category, i) => {

              return(
                <div key={i}>
                  <NavigationMenuItem className="w-full flex ">
                    <NavigationMenuTrigger className="bg-transparent w-full font-bold min-w-[200px] py-4 h-fit" 
                    onClick = {()=>handleClickCat1(category.cat1_id, category.name)}>
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-full flex bg-black/90 shadow-lg shadow-gray-900/10">
                      <CatagoriesDetailContent title={category.name} items={category.items} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {i !== catData.length - 1 && (
                    <div className="block h-[2px] w-[100%] bg-white/50 flex"></div>
                  )}
                </div>
              )
            })}

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
  {name = "Categories"} : {name?: string}){
    const navigate = useNavigate();
    const [open, handleOpen] = useState(false);

    const handleClick = () =>{
      navigate("/categories")
    }

    let domRefHover = HoverDropMenu(() => {
        handleOpen(o => !o);
    });

    return(
        <div ref = {domRefHover} className = "flex w-fit relative mt-3 py-10 px-3 self-center" >

            {/* trigger */}
            <div className = "flex relative w-full font-semibold  text-black justify-center items-center \
                px-3 py-2 rounded-[10px] mb-2 hover:cursor-pointer hover:bg-gray-100/70 transition-all duration-300 text-sm"
                >
                <div onClick = {handleClick}>
                  {name}
                </div>
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
                <div className = "absolute top-[130%] left-0 bg-black/90 text-white w-fit shadow-lg shadow-gray-900/10">
                    <CatagoriesDropdownMenu/>
                </div>
            }

            </div>


        </div>
    );
};

function CatagoriesMiniItem({image, name, handleClick} : {image?: string, name?: string, handleClick : any}){
  if (!name) name = "Category";
  return(
    
      <div className = " h-[130px] aspect-square flex flex-col shrink-0 items-center justify-center ml-1 rounded-2xl border-2\
          hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)] hover:scale-105 hover:cursor-pointer transition-all duration-300 bg-white "
          onClick = {handleClick}>
        {/* Image */}
        <img className = "object-cover h-[100%] aspect-square flex rounded-xl border-2 flex items-center justify-center" src = {image}></img>

      </div>
    
  );
}

function CatagoriesDetailContent({title, items} : {title: string, items: {cat2_id : number,name: string, image: string}[] }){
  const navigate = useNavigate();
  const handleClickCat2 = (cat2_id: number) => {
    navigate(`/products?cat2_id=${cat2_id}&page=${1}`)
  }
  return (
    <div className = "bg-transparent w-[500px] h-[300px] flex flex-col overflow-y-scroll scrollbar-hide rounded-[20px] z-1000 m-3">
      {/* Tittle */}
      <div className = "font-bold text-2xl ml-3 text-white mb-[20px]">{title}</div>

      {/* Content */}
      <div className = "m-5 grid grid-cols-3 gap-3 mx-auto">
        {items.map((item, i) => (
          <CatagoriesMiniItem key={i} image={item.image} name={item.name} handleClick = {()=>handleClickCat2(item.cat2_id)}/>
        ))}

      </div>
    </div>
  );
}
export default CatagoriesButton;
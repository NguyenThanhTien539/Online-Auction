import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Ronaldo from "@/assets/images/Cristiano.jpg";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/utils/make_slug";
import { ChevronRight, Grid3X3, ArrowRight } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

interface catData {
  id: number;
  name: string;
  children: any[];
}

let HoverDropMenu = (handler: any) => {
  let domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!domRef.current) return;

    domRef.current.addEventListener("mouseenter", handler);
    domRef.current.addEventListener("mouseleave", handler);
    return () => {
      if (!domRef.current) return;
      domRef.current.removeEventListener("mouseenter", handler);
      domRef.current.removeEventListener("mouseleave", handler);
    };
  }, []);
  return domRef;
};

//  Export default component
function CatagoriesButton({ name = "Danh mục" }: { name?: string }) {
  const navigate = useNavigate();
  const [open, handleOpen] = useState(false);

  const handleClick = () => {
    navigate("/categories");
  };

  let domRefHover = HoverDropMenu(() => {
    handleOpen((o) => !o);
  });

  return (
    <div
      ref={domRefHover}
      className="flex w-fit relative mt-3 py-10 px-3 self-center"
    >
      {/* trigger */}
      <div className="flex relative w-full font-semibold text-black justify-center items-center \
                px-4 py-3 rounded-xl mb-2 hover:cursor-pointer hover:bg-gray-100/70 transition-all duration-300 text-sm hover:shadow-xl border-1 border-gray-200/50 hover:border-gray-300/70 backdrop-blur-sm">
        <div onClick={handleClick} className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-gray-600" />
          {name}
        </div>
        <span className="pl-1">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            className={`fill-current ${
              open ? "rotate-180" : "rotate-0"
            } transition-all duration-300`}
          >
            <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
          </svg>
        </span>
        {/* Drop menu */}
        {open && (
          <div className="animate__animated animate__fadeInUp absolute top-[130%] left-0 bg-black/90 text-white w-fit shadow-lg shadow-gray-900/10">
            <CatagoriesDropdownMenu />
          </div>
        )}
      </div>
    </div>
  );
}

function CatagoriesDropdownMenu() {
  const navigate = useNavigate();
  const [catData, setCatData] = useState<catData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      let response = await fetch("http://localhost:5000/api/categories/all");
      let data = await response.json();
      if (!response.ok) {
        console.log("Error in loading all categories ", data.message);
        toast.error("Lỗi kết nối server lấy thông tin categories");
        return;
      } else {
        setCatData(data.data);
      }
    };
    loadData();
    setIsLoading(false);
  }, []);

  const handleClickCat1 = (cat1_id: number, cat1_name: string) => {
    const slug = slugify(cat1_name);
    navigate(`/categories/${slug}-${cat1_id}`);
  };

  return catData.length === 0 ? null : (
    <NavigationMenu className="min-w-[240px]">
      <NavigationMenuList className="flex-col w-full flex bg-transparent p-2">
        {catData &&
          catData.map((category, i) => {
            return (
              <div key={i}>
                <NavigationMenuItem className="w-full flex ">
                  <NavigationMenuTrigger
                    className="bg-transparent w-full font-semibold min-w-[240px] py-3 px-4 h-fit cursor-pointer hover:bg-gray-800/60 transition-all duration-100 rounded-lg text-white hover:text-gray-100 border border-transparent hover:border-gray-600/50 flex items-center justify-between"
                    onClick={() => handleClickCat1(category.id, category.name)}
                  >
                    <span>{category.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="animate__animated animate__fadeIn animate__faster w-full flex bg-black/95 backdrop-blur-md shadow-2xl shadow-black/60 border border-gray-700/60 rounded-xl overflow-hidden">
                    <CatagoriesDetailContent
                      title={category.name}
                      items={category.children}
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {i !== catData.length - 1 && (
                  <div className="block h-[1px] w-[90%] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mx-auto"></div>
                )}
              </div>
            );
          })}
      </NavigationMenuList>

      <NavigationMenuViewport outerClassName="-top-1 left-[100%]" />
    </NavigationMenu>
  );
}

function CatagoriesDetailContent({
  title,
  items,
}: {
  title: string;
  items: { id: number; name: string; cat_image: string }[];
}) {
  const navigate = useNavigate();
  const handleClickCat2 = (cat2_id: number) => {
    navigate(`/products?cat2_id=${cat2_id}&page=${1}`);
  };

  return (
    <div className=" bg-transparent w-[500px] h-[300px] flex flex-col overflow-y-scroll scrollbar-hide rounded-2xl z-1000 m-3 cursor-auto animate__animated animate__fadeInUp">
      {/* Tittle */}
      <div className="font-bold text-2xl ml-3 text-white mb-5 flex items-center gap-2">
        <Grid3X3 className="w-6 h-6 text-blue-400" />
        <span>{title}</span>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-4 px-3 pb-4">
        {items.map((item, i) => (
          <CatagoriesMiniItem
            key={i}
            image={item?.cat_image}
            name={item.name}
            handleClick={() => handleClickCat2(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CatagoriesMiniItem({
  image,
  name,
  handleClick,
}: {
  image?: string;
  name?: string;
  handleClick: any;
}) {
  if (!name) name = "Category";
  return (
    <div className="group relative flex flex-col items-center">
      <div
        className="h-[130px] aspect-square flex flex-col shrink-0 items-center justify-center rounded-2xl border-2 border-gray-600/60 \
          hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.8)] hover:scale-110 hover:cursor-pointer transition-all duration-500 bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-sm \
          hover:border-gray-500/80 transform hover:-translate-y-1 relative overflow-hidden mb-3"
        onClick={handleClick}
      >
        {/* Image */}
        <img
          className="object-cover h-[85%] aspect-square rounded-xl border border-gray-500/60 group-hover:border-gray-400/80 transition-all duration-500 shadow-lg"
          src={image || Ronaldo}
          alt={name}
        ></img>

        {/* Hover overlay with icon */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
          <ArrowRight className="w-6 h-6 text-white transform translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300" />
        </div>
      </div>
      <div className="text-center font-medium text-white/80 group-hover:text-white transition-all duration-300 text-sm tracking-wide">
        {name}
      </div>
    </div>
  );
}
export default CatagoriesButton;

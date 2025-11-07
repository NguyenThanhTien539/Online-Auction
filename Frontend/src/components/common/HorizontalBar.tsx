import {Link} from "react-router-dom";  
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useRef, type JSX} from "react";
import { cn } from "@/lib/utils"





function HorizontalBar({data, className, children, Card} : {data? : any, className?: string, children? : any, Card? : React.ComponentType<any>}) {
  // Format data  
  // json{{image: string, name: string, link: string}[]}

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const move = 500; //pixels to move
      const { scrollLeft,  } = scrollRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - move : scrollLeft + move;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };


  return (
    <div className = {cn("w-[90%] rounded-2xl h-[200px]  relative mx-auto my-[50px] bg-gray-100", className)}>    
      <div ref = {scrollRef} className = "rounded-2xl h-full relative flex flex-row gap-1.5 overflow-x-auto items-center justify-start scrollbar-hide">
{/*         
        {data && data.map((item : any, index : any) => {
          const C = Card ?? CatagoriesMiniItem;
          // const C = Card;
          return <C key={index} image={item.image} name={item.name} link={item.link} />;
        })} */}
        {children}
      </div>
      
      {/* Button move left */}
      <button onClick = {() => scroll("left")}
      className = "absolute top-1/2 -translate-y-1/2 left-5 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-105 hover:cursor-pointer ">
        <ChevronLeft></ChevronLeft>
      </button>

      {/* Button move right */}
      <button onClick = {() => scroll("right")}
       className = "absolute top-1/2 -translate-y-1/2 right-5 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-105 hover:cursor-pointer ">
        <ChevronRight></ChevronRight>
      </button>

      {/* Fade left */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent rounded-l-2xl" />

      {/* Fade right */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent rounded-r-2xl" />

    </div>
  );
};


function CatagoriesMiniItem({image, name, link} : {image?: string, name?: string, link?: string}){
  if (!name) name = "Category";
  return(
    <Link to = {link ? link : "#"}>
      <div className = " h-[150px] w-fit pl-[30px] pr-[30px] flex flex-col shrink-0 items-center ml-2 rounded-2xl border-2\
          hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)] hover:scale-105 hover:cursor-pointer transition-all duration-300 bg-white ">
        {/* Image */}
        <div className = "flex h-[80%] w-full mt-0  justify-center items-center">
          <img className = "object-cover h-[80%] aspect-square flex rounded-xl border-2" src = {image}></img>
        </div>
        {/* Words */}
        <div className = "flex w-full flex-1 text-sm text-gray-600 justify-center items-center text-center">{name}</div>
      </div>
    </Link>
  );
}

export {CatagoriesMiniItem};
export default HorizontalBar;
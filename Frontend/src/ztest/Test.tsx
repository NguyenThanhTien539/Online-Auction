"use client"
import {useEffect, useState, useRef} from "react";
import * as React from "react"
import {Link} from "react-router-dom"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Navigation } from "lucide-react"


import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"


const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]
export function NavigationMenuDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <NavigationMenu viewport = {false} className = "ml-[500px]">
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    href="/"
                  >
                    <div className="mb-2 text-lg font-medium sm:mt-4">
                      shadcn/ui
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Beautifully designed components built with Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/docs">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>List</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Components</div>
                    <div className="text-muted-foreground">
                      Browse all components in the library.
                    </div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Documentation</div>
                    <div className="text-muted-foreground">
                      Learn how to use the library.
                    </div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Blog</div>
                    <div className="text-muted-foreground">
                      Read our latest blog posts.
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <div>
              <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
              <NavigationMenuContent asChild>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <a href="#">Components</a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a href="#">Documentation</a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a href="#">Blocks</a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
          </div>
          
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Backlog
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    To Do
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    Done
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}





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
        <div ref = {domRefHover} className = "flex w-fit m-5 p-3 relative">

            {/* trigger */}
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
            {/* Drop menu */}
            {open &&
                <div className = "absolute top-[110%] left-0 bg-blue-300 w-fit rounded-2xl shadow-lg shadow-gray-900/10">
                    <CatagoriesDropdownMenu/>
                </div>
            }

            </div>


        </div>
    );
};


function Test(){
  return (
    <div >

      <CatagoriesDropdownMenu/>
      <CatagoriesButton/>

    </div>
  );
}

export default Test;
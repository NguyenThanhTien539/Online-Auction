import  {useState} from "react";
import cat from "../assets/react.svg";




interface ListItemProps {
  index: number;
  link: string;
  children: string;
}



function NavbarAlpha () {
    const [open, setOpen] = useState(false);
    const navbarItems = [{link: "#", option: "Home"}, {link: "#", option: "About"}, {link: "#", option: "Payment"},
        {link: "#", option: "Contact"}
    ];
    return(
        // Header section
   
        <header className = "fixed w-full z-100">
            <div className = "bg-gray-600/50 w-full h-[70px] lg:h-20 flex relative backdrop-blur-2xl">
                {/*Responsize Block */}
                <div className = "container ml-3 flex items-center ">

                    {/* Logo */}
                    <div className = "flex w-fit max-w-full h-full p-2 justify-center">
                        <a href = "# b" className = "0 w-full flex items-center pl-2.5">
                            <img src = {cat} alt = "logo" className = "flex  h-[80%] my-auto object-cover ring-2 rounded-[50%] hover:rotate-30 transition-all duration-300"></img>
                            <span className = "text-2xl mx-2 font-bold w-full text-blue-500 hover:text-blue-300 transition-all duration-300">Miracle1412</span>
                        </a>
                    </div>
                    {/* List center content */}
                    <div className = {`absolute right-4 top-[110%] w-full max-w-[300px] py-3 z-40 rounded-2xl justify-center items-center font-semibold text-2xl mx-2 \
                        ${open ? "top-[110%] opacity-100 visible bg-gray-700" : "top-[150%] opacity-0 "} transition-opacity duration-3000 \ 
                        lg:flex lg:static lg:flex-1 lg:max-w-full lg:opacity-100 lg:visible lg:bg-transparent`}>
                        <ul>
                            {navbarItems.map((item, idx) => ( 
                                <ListItem key = {idx} index = {idx} link = {item.link}>{item.option}</ListItem>
                            ))}
                        </ul>
                    </div>

        

                    {/* button */}
                    <div className = "hidden justify-end md:flex md:absolute md:right-15 lg:static max-w-[250px]w-fit m-4 p-4 ml-0">
                        <a href = "#" className="bg-neutral-300 m-2 p-2 rounded-2xl text-blue-500 text-xl font-bold hover:text-white">Sign in</a>
                        <a href = "#" className="bg-neutral-300 m-2 p-2 rounded-2xl text-blue-500 text-xl font-bold hover:text-white">Sign up</a>

                    </div>

                    {/* Toggle button for small device */}
                    <div>
                            <button onClick = {() => setOpen(!open)}
                            className = {`absolute right-6 rounded-xl top-1/2 -translate-y-1/2 bg-gray-500 w-[50px] aspect-square lg:hidden`}>
                                <span className = "h-[3px] w-[30px] bg-white block m-auto my-2"></span>
                                <span className = "h-[3px] w-[30px] bg-white block m-auto my-2"></span>
                                <span className = "h-[3px] w-[30px] bg-white block m-auto my-2"></span>
                            </button>
                    </div>
                </div> 
            </div>
        </header>

 

    );
}
export default NavbarAlpha;

function ListItem ({index, children, link} : ListItemProps) {
    return (
        <li key = {index} className = "flex lg:inline-flex text-amber-300 text-xl m-2 p-1 my-3 hover:text-white">
            <a href = {link} title = {children}>{children}</a>
        </li>
    );
}
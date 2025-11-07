import {Link, useLocation} from  "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon } from "lucide-react"
function Breadcrumbs() {

  const Location = useLocation();
  const list = Location.pathname.split("/").filter((i) => i);


  return(
    <div>
      <Breadcrumb>
        <BreadcrumbList>

        {/* First Item: Home */}
        <BreadcrumbItem>
          <Link to = "/" className = "hover:text-gray-300 transition-all duration-100">Home</Link>
        </BreadcrumbItem>
        {/* {list.length > 0 && <BreadcrumbSeparator/>} */}
        <BreadcrumbSeparator/>
    
        {/* Dynamic Items */}
        {list.map((item, index) => {
          const path = "/" + list.slice(0, index + 1).join("/");
          const isLast = index === list.length - 1;
          return (

            <BreadcrumbItem key={path}>
                <Link to = {path} className = "hover:text-gray-300 transition-all duration-100">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
                {isLast ? null : <BreadcrumbSeparator/>}
            </BreadcrumbItem>
    
          )
        })}

        </BreadcrumbList>
      </Breadcrumb>

    </div>
  );

}

export default Breadcrumbs;
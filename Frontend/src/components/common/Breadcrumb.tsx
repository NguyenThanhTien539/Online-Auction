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

function formatSlug(slug: string) {
  // loại bỏ id nếu có
  const parts = slug.split("-");
  if (!isNaN(Number(parts[parts.length - 1]))) parts.pop();
  return parts.join(" "); // "dien thoai"
}

function Breadcrumbs() {

  const Location = useLocation();
  const pathname = location.pathname.split("?")[0]; // No query
  const pathSegments = pathname.split("/").filter(Boolean);
  


  return(
    <div>
      <Breadcrumb>
        <BreadcrumbList>

        {/* First Item: Home */}
        {pathSegments.length > 0 ?
          <>
          <BreadcrumbItem>
            <Link to = "/" className = "hover:text-gray-300 transition-all duration-100">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          </>
          : null
        }
    
        {/* Dynamic Items */}
        {pathSegments.map((item, index) => {
          const path = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;
          const displayName = formatSlug(item);
          return (
            <BreadcrumbItem key={index}>
                <Link to = {path}
                 className = {`hover:text-gray-300 transition-all duration-100 `}>
                    {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                </Link>
                {!isLast ? <BreadcrumbSeparator/> : null}
            </BreadcrumbItem>
    
          )
        })}

        </BreadcrumbList>
      </Breadcrumb>

    </div>
  );

}

export default Breadcrumbs;
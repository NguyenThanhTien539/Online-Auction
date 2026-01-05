import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

function Breadcrumbs() {
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
  const location = useLocation();

  // Tự động clear breadcrumb khi chuyển route
  useEffect(() => {
    setBreadcrumbs([]);
  }, [location.pathname]);

  // Không hiển thị gì nếu breadcrumbs rỗng
  if (breadcrumbs.length === 0) return (
    null
  ); 

  return (
    <div className="border-b border-gray-200 animate__animated animate__fadeIn">
      <div className="max-w-7xl mx-auto px-4 pb-3 ">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <BreadcrumbItem key={index}>
                  {item.path ? (
                    // Link nếu có path
                    <Link
                      to={item.path}
                      className="text-gray-500 hover:text-gray-300 font-bold transition-all duration-100 max-w-[500px] truncate"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    // Text thường nếu là trang hiện tại (path = null)
                    <span className="text-gray-400 font-medium max-w-[500px] truncate">{item.label}</span>
                  )}
                  {!isLast ? <BreadcrumbSeparator /> : null}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

export default Breadcrumbs;
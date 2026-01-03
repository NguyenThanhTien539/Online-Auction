import {
  FiHome,
  FiTag,
  FiPackage,
  FiUsers,
  FiFileText,
  FiUser,
  FiSettings,
  FiUserCheck,
  FiLogOut,
} from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const baseLinkClass =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[500]";
const activeClass = "bg-blue-500 text-white hover:bg-blue-500/90";
const normalClass = "text-gray-800 hover:bg-gray-100";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isCategoryActive = pathname.startsWith(
    `/${import.meta.env.VITE_PATH_ADMIN}/category`
  ); //đường dẫn cha
  const isUserActive = pathname.startsWith(
    `/${import.meta.env.VITE_PATH_ADMIN}/user`
  );
  const isBidderFormActive =
    pathname.startsWith(
      `/${import.meta.env.VITE_PATH_ADMIN}/seller/applications`
    ) ||
    pathname.startsWith(
      `/${import.meta.env.VITE_PATH_ADMIN}/seller/application/`
    );

  return (
    <nav className="p-3 space-y-1">
      <NavLink
        to={`/${import.meta.env.VITE_PATH_ADMIN}/dashboard`}
        end //trùng với đường dẫn
        className={({ isActive }) =>
          `${baseLinkClass} ${isActive ? activeClass : normalClass}`
        }
      >
        <FiHome className="text-lg" />
        <span>Tổng quan</span>
      </NavLink>

      <NavLink
        to={`/${import.meta.env.VITE_PATH_ADMIN}/category/list`}
        className={() =>
          `${baseLinkClass} ${isCategoryActive ? activeClass : normalClass}`
        }
      >
        <FiTag className="text-lg" />
        <span>Quản lý danh mục</span>
      </NavLink>

      <NavLink
        to={`/${import.meta.env.VITE_PATH_ADMIN}/product/list`}
        className={({ isActive }) =>
          `${baseLinkClass} ${isActive ? activeClass : normalClass}`
        }
      >
        <FiPackage className="text-lg" />
        <span>Quản lý sản phẩm</span>
      </NavLink>

      <NavLink
        to={`/${import.meta.env.VITE_PATH_ADMIN}/user/list`}
        className={() =>
          `${baseLinkClass} ${isUserActive ? activeClass : normalClass}`
        }
      >
        <FiUsers className="text-lg" />
        <span>Quản lý người dùng</span>
      </NavLink>

      <NavLink
        to={`/${import.meta.env.VITE_PATH_ADMIN}/seller/applications`}
        className={() =>
          `${baseLinkClass} ${isBidderFormActive ? activeClass : normalClass}`
        }
      >
        <FiFileText className="text-lg" />
        <span>Quản lý form đăng ký</span>
      </NavLink>

      <div className="pt-4 mt-4 border-t">
        <NavLink
          to={`/${import.meta.env.VITE_PATH_ADMIN}/profile`}
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeClass : normalClass}`
          }
        >
          <FiUserCheck className="text-lg" />
          <span>Thông tin cá nhân</span>
        </NavLink>

        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[500] text-red-600 hover:bg-red-50 cursor-pointer"
          onClick={() => {
            fetch(`${import.meta.env.VITE_API_URL}/accounts/logout`, {
              credentials: "include",
              method: "POST",
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.code === "success") {
                  toast.success(data.message);
                  navigate(`/`);
                }
              });
          }}
        >
          <FiLogOut className="text-lg" />
          <span>Đăng xuất</span>
        </div>
      </div>
    </nav>
  );
}

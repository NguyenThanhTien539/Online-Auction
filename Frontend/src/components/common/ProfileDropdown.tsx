import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/routes/ProtectedRouter";
import { ChevronDown, User, Package, Lock, LogOut, Heart } from "lucide-react";
import {toast } from "sonner";
interface ProfileMenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  danger?: boolean;
}

interface ProfileDropdownProps {
  menuItems?: ProfileMenuItem[];
}

export default function ProfileDropdown({ menuItems }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const {auth, setAuth} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = auth?.full_name
    ? auth.full_name
        .split(" ")
        .map((n : any) => n[0])
        .join("")
        .toUpperCase()
    : auth?.username
    ? auth.username.charAt(0).toUpperCase()
    : "";

  const defaultMenuItems: ProfileMenuItem[] = [
    {
      label: "Trang cá nhân",
      icon: <User size={16} />,
      action: () => {
        navigate(`/profile/${auth?.username}_${auth?.user_id}`);
        setIsOpen(false);
      }
    },
    {
      label: "Sản phẩm",
      icon: <Package size={16} />,
      action: () => {
        navigate("/my-products");
        setIsOpen(false);   
      }
    },
    {
      label: "Đổi mật khẩu",
      icon: <Lock size={16} />,
      action: () => {
        navigate("/profile/change-password");
        setIsOpen(false);
      }
    },
    {
      label: "Đăng xuất",
      icon: <LogOut size={16} />,
      action: () => {
        // Handle logout logic here
        fetch(`${import.meta.env.VITE_API_URL}/accounts/logout`, {
          method: "POST",
          credentials: "include"
        }).then((res) => {
          if (res.ok) {
            setAuth(null);
            navigate("/");
          }
        })
        .catch ((e) => {
          toast.error("Không thể kết nối đến máy chủ để đăng xuất!");
        })

      },
      danger: true
    }
  ];

  const itemsToRender = menuItems || defaultMenuItems;

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      

      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer space-x-3 px-3 py-2 rounded-full hover:shadow-md transition-all duration-200 bg-white/90 hover:bg-white"
      >
        <div className="w-10 h-10 rounded-full bg-linear-30 from-black via-blue-500 to-blue-300 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>

        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-700">
            {auth?.full_name || auth?.username}
          </span>
          <span className="text-xs text-gray-500">{auth?.email}</span>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full bg-white/90 shadow-lg border-2 border-gray-300 py-2 z-50">
          {itemsToRender.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-full flex items-center px-4 py-3 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-150 ${
                item.danger ? 'text-red-600 hover:bg-red-100' : 'text-gray-700'
              }`}
            >
              <span className={`mr-3 ${item.danger ? 'text-red-500' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
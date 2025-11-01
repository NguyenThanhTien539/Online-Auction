import logo from "../../../assets/react.svg";
import { HeaderMenu } from "./HeaderMenu";
import { HeaderAccount } from "./HeaderAccount";
export const Header = () => {
  return (
    <>
      <header className="bg-blue-500 py-[15px] px-[16px]">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo + Tên */}
          <div className="flex items-center gap-2">
            <a href="/">
              <img
                src={logo}
                alt="logo"
                className="object-cover ring-2 rounded-full bg-white hover:rotate-30 transition-all duration-300 w-12 h-12"
              />
            </a>
            <span className="text-2xl font-bold text-white hover:text-gray-300 transition-all duration-300">
              Miracle1412
            </span>
          </div>

          {/* Menu */}
          <HeaderMenu />

          {/* Account */}
          <HeaderAccount />
        </div>
      </header>
    </>
  );
};

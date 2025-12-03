import { useState } from "react";
import auction from "@/assets/logos/auction-logo.svg";
import { Link } from "react-router-dom";
import CatagoriseButton from "@/components/common/CategoriesMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/ProtectedRouter";

function Navbar() {
  // const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const auth = useAuth();
  return (
    // Header section

    <header className="fixed w-full z-100">
      <div className="bg-white/85 w-full h-[50px] lg:h-[70px] flex relative backdrop-blur-2xl shadow-md shadow-gray-900/5">
        {/*Responsize Block */}
        <div className="container lg:max-w-full ml-3 flex items-center ">
          {/* Logo */}
          <div
            className="flex w-fit max-w-full h-full p-2 justify-center"
            onClick={() => {
              navigate("/");
            }}
          >
            <a href="# b" className="0 w-full flex items-center pl-2.5">
              <img
                src={auction}
                alt="logo"
                className="flex  h-[90%] my-auto object-cover rounded-[50%] hover:rotate-30 transition-all duration-300"
              ></img>
              <span className="text-xl mx-2 font-bold w-full text-blue-500 hover:text-blue-300 transition-all duration-300">
                Miracle
              </span>
            </a>
          </div>

          <CatagoriseButton />

          {/* Search Bar */}

          {/* </div>  */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <SearchBar />
          </div>

          {/* button */}
          {!auth ? (
            <div className=" hidden justify-end md:flex md:absolute md:right-15 lg:static max-w-[250px] w-fit m-4 p-4">
              <Link
                to="/accounts/login"
                className=" my-2 py-2 mr-1 rounded-2xl text-black text-lg font-bold hover:text-blue-300"
              >
                Sign in
              </Link>
              <div className="w-[2px] rounded-[2px] h-[20px] self-center bg-black mr-1"></div>
              <Link
                to="/accounts/register"
                className="my-2 py-2 rounded-2xl text-black text-lg font-bold hover:text-blue-300"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <ProfileMenu></ProfileMenu>
          )}
        </div>
      </div>
    </header>
  );
}
export default Navbar;

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 max-w-[500px] mx-4 ml-10 text-sm">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
      />
    </div>
  );
}

function ProfileMenu() {
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div>
      <div
        className="relative w-fit h-fit justify-end flex m-6"
        onClick={() => {
          navigate(`/profile/${auth?.user_id}`);
        }}
      >
        <a
          className="rounded-full flex w-fit p-2 justify-center items-center font-semibold shadow-[0px_5px_10px] shadow-blue-100 \
                hover:scale-105 cursor-pointer transition-all duration-300"
        >
          {auth?.username}
        </a>
      </div>
    </div>
  );
}

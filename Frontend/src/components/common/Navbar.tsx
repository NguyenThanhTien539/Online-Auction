import { useState, useEffect, useRef } from "react";
import auction from "@/assets/logos/auction-logo.svg";
import { Link } from "react-router-dom";
import CatagoriseButton from "@/components/common/CategoriesMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/ProtectedRouter";
import {LucideSearch, Heart, Plus, UserPlus} from "lucide-react"
import ProfileDropdown from "@/components/common/ProfileDropdown";



function Navbar() {

  const navigate = useNavigate();

  const {auth}= useAuth();
  return (
    // Header section

    <header className="fixed w-full z-100">
      <div className="bg-white/85 w-full h-[50px] lg:h-[70px] flex relative backdrop-blur-2xl shadow-md shadow-gray-900/5">
        {/*Responsize Block */}
        <div className="container lg:max-w-full ml-3 flex items-center ">
          {/* Logo */}
          <div
            className="flex w-fit max-w-full h-full p-2 justify-center cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <div className="0 w-full flex items-center pl-2.5">
              <img
                src={auction}
                alt="logo"
                className="flex  h-[90%] my-auto object-cover rounded-[50%] hover:rotate-30 transition-all duration-300"
              ></img>
              <span className="text-2xl mx-2 font-[1000] w-full text-blue-500 hover:text-blue-300 transition-all duration-300 ">
                Miracle
              </span>
            </div>
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
      
            <>
              <Link to = "/my-products"
                
                className="cursor-pointer hover:shadow-[0px_0px_5px] p-2 rounded-full hover:shadow-gray-400 transition-all duration-200 mr-2"
              >
                <Heart size={20} className="text-gray-600 hover:text-red-500 transition-colors" />
              </Link>

              {/* Add Product or register to be seller */}

              {(auth.role == "user") ?
               (<Link to="/register-seller" title = "Wanna be seller ?" 
                className="cursor-pointer hover:shadow-[0px_0px_5px] p-2 rounded-full hover:shadow-gray-400 transition-all duration-200 mr-2"
              >
                <UserPlus size={20} className="text-gray-600 hover:text-green-500 transition-colors" />
              </Link>)
              :
              (<Link to="/products/post" title = "Add new product"
                className="cursor-pointer hover:shadow-[0px_0px_5px] p-2 rounded-full hover:shadow-gray-400 transition-all duration-200 mr-2"
              >
                <Plus size={20} className="text-gray-600 hover:text-blue-500 transition-colors" />
              </Link>)
              }
              <ProfileDropdown />
            </>

          )}
        </div>
      </div>
    </header>
  );
}
export default Navbar;


function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e : any) => {
    e.preventDefault();
    navigate(`/products/search?query=${searchQuery}`);
  }


  return (
    <div className="flex-1 max-w-[500px] mx-4 ml-10 text-sm relative">
      <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <form onSubmit = {handleSubmit}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[150px] lg:w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
        />
      </form>
      
    </div>
  );
}


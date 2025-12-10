import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

function MainLayout() {
    return (
        <div className = "min-h-screen w-full flex flex-col">
            <Navbar/>
            
            <main className = "flex-1 pt-[100px]">
                <div className = "ml-[50px]">
                </div>
                <Outlet/>
            </main>
            <Footer/>
        </div>  
    )
};
export default MainLayout;

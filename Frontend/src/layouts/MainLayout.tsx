import {Outlet} from "react-router-dom";
import Navbar from "@/components/layout/Navbar";


function MainLayout() {
    return (
        <div className = "min-h-screen w-full flex flex-col">
            <Navbar/>
            <main className = "flex-1 pt-[100px]">
                <Outlet/>
            </main>
        </div>  
    )
};
export default MainLayout;
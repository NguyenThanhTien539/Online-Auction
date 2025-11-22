import {Outlet} from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Breadcrumbs from "@/components/common/Breadcrumb";

function MainLayout() {
    return (
        <div className = "min-h-screen w-full flex flex-col">
            <Navbar/>
            
            <main className = "flex-1 pt-[100px]">
                <div className = "ml-[50px]">
                    {/*     <Breadcrumbs/> */}
                </div>
                <Outlet/>
            </main>
        </div>  
    )
};
export default MainLayout;
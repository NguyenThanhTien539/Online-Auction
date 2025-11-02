import {createBrowserRouter} from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";


const routers = createBrowserRouter([
    {
        path : "/",
        element : <MainLayout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            }
        ]
    }
]);

export default routers;
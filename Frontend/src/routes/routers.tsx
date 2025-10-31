import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layouts/MainLayout.tsx";
import Home from "../pages/Home.tsx";


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
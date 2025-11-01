import {createBrowserRouter} from "react-router-dom";
import Home from "../views/client/pages/Home";
import Default from "../views/client/layouts/Default";

const routers = createBrowserRouter([
    {
        path : "/",
        element : <Default/>,
        children: [
            {
                path: "/",
                element: <Home/>
            }
        ]
    }
]);

export default routers;
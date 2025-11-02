import { createBrowserRouter } from "react-router-dom";
import Home from "../views/client/pages/Home";
import Default from "../views/client/layouts/Default";
import AccountRegister from "../views/client/pages/AccountRegister";
import AccountVerify from "../views/client/pages/AccountVerify";
import AccountLogin from "../views/client/pages/AccountLogin";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/accounts",
    children: [
      {
        path: "register",
        element: <AccountRegister />,
      },
      {
        path: "verify",
        element: <AccountVerify />,
      },
      {
        path: "login",
        element: <AccountLogin />,
      },
    ],
  },
]);

export default routers;

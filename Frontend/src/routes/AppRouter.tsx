import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import MainLayout from "@/layouts/MainLayout";
import AccountRegister from "@/features/auth/pages/AccountRegister";
import AccountVerify from "@/features/auth/pages/AccountVerify";
import AccountLogin from "@/features/auth/pages/AccountLogin";
import Test from "@/ztest/Test"
const routers = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

    ],
  },
  {
    path: "/test",
    element: <Test/>
  }
  ,
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
  {
    path: "/test",
    element: <Test/>
  }
]);

export default routers;

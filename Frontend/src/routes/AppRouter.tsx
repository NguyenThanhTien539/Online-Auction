import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/Home";
import MainLayout from "@/layouts/MainLayout";
import AccountRegister from "@/pages/auth/AccountRegister";
import AccountVerify from "@/pages/auth/AccountVerify";
import AccountLogin from "@/pages/auth/AccountLogin";
import Test from "@/ztest/Test"
import ForgotPassword from "@/pages/auth/ForgotPassword";
import AllCategoriesPage from "@/components/common/AllCategories";
const routers = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/categories",
        element: <AllCategoriesPage/>
      }

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
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test/>
  }
]);

export default routers;

import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/HomePage";
import MainLayout from "@/layouts/MainLayout";
import AccountRegister from "@/pages/auth/AccountRegisterPage";
import AccountVerify from "@/pages/auth/AccountVerifyPage";
import AccountLogin from "@/pages/auth/AccountLoginPage";
import Test from "@/ztest/Test"
import ForgotPassword from "@/pages/auth/ForgotPasswordPage";
import AllCategoriesPage from "@/pages/client/CategoriesPage";
import ListProductsPage from "@/pages/client/ListProductsPage";
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
        path: "/categories/:slugid",
        element: <AllCategoriesPage level = {2}/>
      },
      {
        path: "/categories",
        element: <AllCategoriesPage level = {1}/>,
      },
      {
        path: "/products",
        element: <ListProductsPage/>
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

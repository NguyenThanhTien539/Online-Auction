import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/HomePage";
import MainLayout from "@/layouts/MainLayout";
import AdminMainLayout from "@/layouts/AdminMainLayout";
import AccountRegister from "@/pages/auth/AccountRegisterPage";
import AccountVerify from "@/pages/auth/AccountVerifyPage";
import AccountLogin from "@/pages/auth/AccountLoginPage";
import Test from "@/ztest/Test";
import ForgotPassword from "@/pages/auth/ForgotPasswordPage";
import AllCategoriesPage from "@/pages/client/CategoriesPage";
import ListProductsPage from "@/pages/client/ListProductsPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import CategoryList from "@/pages/admin/CategoryListPage";
import CategoryCreate from "@/pages/admin/CategoryCreatePage";
const routers = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/categories/:slugid",
        element: <AllCategoriesPage level={2} />,
      },
      {
        path: "/categories",
        element: <AllCategoriesPage level={1} />,
      },
      {
        path: "/products",
        element: <ListProductsPage />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
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
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },


  {
    path: "/admin",
    element: <AdminMainLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "category/list",
        element: <CategoryList />,
      },
      {
        path: "category/create",
        element: <CategoryCreate />,
      },
    ],
  },
]);

export default routers;

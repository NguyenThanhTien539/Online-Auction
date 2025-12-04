import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/routes/ProtectedRouter";
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
import DetailProductPage from "@/pages/client/DetailProductPage/DetailProductPage";
import ResetPassword from "@/pages/auth/ResetPasswordPage";
import CategoryEdit from "@/pages/admin/CategoryEditPage";
import ProductListPage from "@/pages/admin/ProductListPage";
import ProductDetailPage from "@/pages/admin/ProductDetailPage";
import UserListPage from "@/pages/admin/UserListPage";
import BidderFormListPage from "@/pages/admin/SellerApplicationPage";

import UserDetailPage from "@/pages/admin/UserDetailPage";
import BidderFormDetailPage from "@/pages/admin/SellerApplicationDetailPage";
import PostProductPage from "@/pages/client/ProfilePage/components/PostProductPage";
import ProfilePage from "@/pages/client/ProfilePage/ProfilePage";
import MyProductsPage from "@/pages/client/ProfilePage/components/MyProductsPage";
import RegisterSellerPage from "@/pages/client/ProfilePage/components/RegisterSellerPage";
import EditProfilePage from "@/pages/client/ProfilePage/components/EditProfilePage";
import SellerApplicationDetailPage from "@/pages/admin/SellerApplicationDetailPage";
const routers = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    ),
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
      {
        path: "product/:slugid",
        element: <DetailProductPage />,
      },
      {
        path: "products/post",
        element: <PostProductPage />,
      },
      {
        path: "my-products",
        element: <MyProductsPage />,
      },
      {
        path: "register-seller",
        element: <RegisterSellerPage />,
      },
      {
        path: "profile/edit",
        element : <EditProfilePage />
      }
    ],
  },
  {
    path: "/profile",
    element: <AuthProvider><ProfilePage /></AuthProvider>,
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
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <AuthProvider>
        <AdminMainLayout />
      </AuthProvider>
    ),
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
      {
        path: "category/edit/:id",
        element: <CategoryEdit />,
      },
      {
        path: "product/list",
        element: <ProductListPage />,
      },
      {
        path: "product/detail",
        element: <ProductDetailPage />,
      },
      {
        path: "user/list",
        element: <UserListPage />,
      },
      {
        path: "user/detail/:id",
        element: <UserDetailPage />,
      },
      {
        path: "seller/applications",
        element: <BidderFormListPage />,
      },
      {
        path: "seller/application/detail/:id",
        element: <SellerApplicationDetailPage />,
      },
    ],
  },
]);

export default routers;

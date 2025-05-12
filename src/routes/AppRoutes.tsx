import { Routes, Route, RouteObject } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProductsPage from "@/pages/ProductsPage";
import React from "react";
import LoginPage from "@/pages/auth/LoginPage";
import CreatePRoductsPage from "@/pages/CreatePRoductsPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import RecoveryPassword from "@/pages/auth/RecoveryPassword";
import DetailPRoduct from "@/pages/DetailPRoduct";
import EditProductPage from "@/pages/editProduct";
import useAuth from "@/hooks/useAuth";

const AppRoutes = () => {
  const { withAdminAuth } = useAuth();
  const WithAdminEditPRoductPage = withAdminAuth(EditProductPage);
  const WithAdminCreateProductPage = withAdminAuth(CreatePRoductsPage);
  const routers: RouteObject[] = [
    {
      path: "products",
      element: <ProductsPage />,
      children: [
        { element: <DetailPRoduct />, path: ":id/detail" },
        { element: <WithAdminCreateProductPage />, path: "create" },
        { element: <WithAdminEditPRoductPage />, path: ":id/edit" },
      ],
    },

    {
      path: "*",
      element: <>NotFound</>,
    },
    {
      path: "about",
      element: <AboutPage />,
    },
  ];
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recovery-password" element={<RecoveryPassword />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {routers.map((r) => (
          <React.Fragment key={r.path}>
            <Route path={r.path} element={r.element} />
            {r.children?.map((c) => (
              <Route
                key={`${r.path}/${c.path}`}
                path={`${r.path}/${c.path}`}
                element={c.element}
              />
            ))}
          </React.Fragment>
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

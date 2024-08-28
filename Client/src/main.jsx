import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import ReactDom from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Profile from "./pages/User/Profile.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import UserList from "./pages/Admin/UserList.jsx";
import ProductTypesList from "./pages/Admin/ProductTypesList.jsx";
import BrandsList from "./pages/Admin/BrandsList.jsx";
import AttributesList from "./pages/Admin/AttributesList.jsx";
import ProductesList from "./pages/Admin/ProductesList.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userList" element={<UserList />} />
        <Route path="productTypesList" element={<ProductTypesList />} />
        <Route path="brandsList" element={<BrandsList />} />
        <Route path="attributesList" element={<AttributesList />} />
        <Route path="productesList" element={<ProductesList />} />
      </Route>
    </Route>
  )
);
ReactDom.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

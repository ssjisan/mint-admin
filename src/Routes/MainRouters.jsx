import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Page/Dashboard";
import { Toaster } from "react-hot-toast";
import Login from "../UserAuth/Login";
import AddUser from "../Page/User/AddUser";
import ChangePassword from "../Page/User/ChangePassword";
import UserList from "../Page/User/UserList";
import AddCoverageArea from "../Page/Coverage/AddCoverageArea";
import CoverageAreaList from "../Page/Coverage/CoverageAreaList";
import AddZone from "../Page/Coverage/AddZone";
import AddPackage from "../Page/Package/AddPackage";
import PackageList from "../Page/Package/PackageList";
import ConnectionRequest from "../Page/ConnectionRequest";
import SuccessStoriesEditor from "../Page/SuccessStories/SuccessStoriesEditor";
import SuccessStoriesList from "../Page/SuccessStories/SuccessStoriesList";
import SuccessStoriesPreview from "../Page/SuccessStories/SuccessStoriesPreview";
import ProductList from "../Page/Product/ProductList";
import Brand from "../Page/Brand";
import Category from "../Page/Category";
import ProductSetup from "../Page/Product/ProductSetup";
import ProductPreview from "../Page/Product/ProductPreview";
import PasswordChange from "../UserAuth/PasswordChange";
import Pages from "../Page/Pages/Pages";
import CreatePages from "../Page/Pages/CreatePages";
import PreOrder from "../Page/PreOrder";
export default function MainRouters() {
  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#59B259",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#59B259",
            },
          },
          error: {
            style: {
              background: "#EC4034",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#EC4034",
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/brands" element={<Brand />} />
          <Route path="/category" element={<Category />} />
          <Route path="/product-setup" element={<ProductSetup />} />
          <Route path="/product-setup/:id" element={<ProductSetup />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductPreview />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/pages-steup" element={<CreatePages />} />

          <Route path="/connection-request" element={<ConnectionRequest />} />
          <Route path="/pre-order" element={<PreOrder />} />

          {/* User Routes Start */}
          <Route path="/create_use" element={<AddUser />} />
          <Route path="change_password" element={<ChangePassword />} />
          <Route path="user_list" element={<UserList />} />
          {/* User Routes End */}

          {/* Coverage Area Route Start Here */}
          <Route path="/add-coverage" element={<AddCoverageArea />} />
          <Route path="/edit-coverage/:id" element={<AddCoverageArea />} />
          <Route path="/coverage-list" element={<CoverageAreaList />} />
          <Route path="/add-zone" element={<AddZone />} />
          {/* Coverage Area Route End Here */}

          {/* Coverage Area Route Start Here */}
          <Route path="/package-list" element={<PackageList />} />
          <Route path="/add-package" element={<AddPackage />} />
          <Route path="/edit-package/:id" element={<AddPackage />} />
          {/* Coverage Area Route End Here */}

          <Route
            path="/success-stories-editor"
            element={<SuccessStoriesEditor />}
          />
          <Route
            path="/success-stories-editor/:id"
            element={<SuccessStoriesEditor />}
          />
          <Route
            path="/success-stories-list"
            element={<SuccessStoriesList />}
          />
          <Route
            path="/success-stories-preview/:id"
            element={<SuccessStoriesPreview />}
          />
        </Route>
        {/* <Route path="*" element={<ErrorPage />} replace /> */}
      </Routes>
    </>
  );
}

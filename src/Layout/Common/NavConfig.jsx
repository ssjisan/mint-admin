import { DataContext } from "../../DataProcessing/DataProcessing";
import { useContext } from "react";
import {
  Dashboard,
  Coverage,
  Package,
  ConnectionRequest,
  HappyClient,
  Blog,
  SuccessStories,
  Product,
} from "../../assets/IconSet";

const navConfig = ({ pathname }) => {
  const { auth } = useContext(DataContext);
  const role = auth?.user?.role;

  // Configuration for role 0 and 1 (Full Access)
  const ForCommonRole = [
    {
      title: "Overview",
      icon: (
        <Dashboard color={pathname === "/" ? "#792df8" : "#637381"} size={20} />
      ),
      items: [
        {
          title: "Dashboard",
          link: "/",
        },
      ],
    },
    {
      title: "Connection Request",
      icon: (
        <ConnectionRequest
          color={pathname === "/connection-request" ? "#792df8" : "#637381"}
          size={20}
        />
      ),
      items: [
        {
          title: "Connection Request",
          link: "/connection-request",
        },
      ],
    },
    {
      title: "Product",
      icon: (
        <Product
          color={
            pathname.startsWith("/product-list") ||
            pathname.startsWith("/product-setup") ||
            pathname.startsWith("/brands") ||
            pathname.startsWith("/category")
              ? "#792df8"
              : "#637381"
          }
          size={20}
        />
      ),
      items: [
        {
          title: "Product List",
          link: "/product-list",
        },
        {
          title: "Product Setup",
          link: "/product-setup",
        },
        {
          title: "Brands",
          link: "/brands",
        },
        {
          title: "Category",
          link: "/category",
        },
      ],
    },
    {
      title: "Success Stories",
      icon: (
        <SuccessStories
          color={
            pathname.startsWith("/success-stories-editor") ||
            pathname.startsWith("/success-stories-list")
              ? "#792df8"
              : "#637381"
          }
          size={20}
        />
      ),
      items: [
        {
          title: "Editor",
          link: "/success-stories-editor",
        },
        {
          title: "All Success Stories",
          link: "/success-stories-list",
        },
      ],
    },
    {
      title: "Packages",
      icon: (
        <Package
          color={
            pathname.startsWith("/package-list") ||
            pathname.startsWith("/add-package")
              ? "#792df8"
              : "#637381"
          }
          size={20}
        />
      ),
      items: [
        {
          title: "Add Package",
          link: "/add-package",
        },
        {
          title: "Package List",
          link: "/package-list",
        },
      ],
    },
    {
      title: "Client",
      icon: (
        <HappyClient
          color={pathname === "/client" ? "#792df8" : "#637381"}
          size={20}
        />
      ),
      items: [
        {
          title: "Client",
          link: "/client",
        },
      ],
    },
  ];

  // Only show Students for role 2
  const ForRole2 = [
    {
      title: "Overview",
      icon: (
        <Dashboard color={pathname === "/" ? "#792df8" : "#637381"} size={20} />
      ),
      items: [
        {
          title: "Dashboard",
          link: "/",
        },
      ],
    },
    {
      title: "Coverage",
      icon: (
        <Coverage
          color={
            pathname.startsWith("/coverage-list") ||
            pathname.startsWith("/add-coverage") ||
            pathname.startsWith("/add-zone")
              ? "#792df8"
              : "#637381"
          }
          size={20}
        />
      ),
      items: [
        {
          title: "Add Zone",
          link: "/add-zone",
        },
        {
          title: "Add Coverage",
          link: "/add-coverage",
        },
        {
          title: "Coverage List",
          link: "/coverage-list",
        },
      ],
    },
    {
      title: "Packages",
      icon: (
        <Package
          color={
            pathname.startsWith("/package-list") ||
            pathname.startsWith("/add-package")
              ? "#792df8"
              : "#637381"
          }
          size={20}
        />
      ),
      items: [
        {
          title: "Add Package",
          link: "/add-package",
        },
        {
          title: "Package List",
          link: "/package-list",
        },
      ],
    },
  ];
  return role === 2 ? ForRole2 : ForCommonRole;
};

export default navConfig;

import {
  Dashboard,
  Package,
  ConnectionRequest,
  SuccessStories,
  Product,
  Users,
} from "../../assets/IconSet";

const navConfig = ({ pathname }) => [
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
    title: "Pre Order",
    icon: (
      <ConnectionRequest
        color={pathname === "/pre-order" ? "#792df8" : "#637381"}
        size={20}
      />
    ),
    items: [
      {
        title: "Pre Order",
        link: "/pre-order",
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
    title: "User",
    icon: (
      <Users
        color={
          pathname.startsWith("/create_user") ||
          pathname.startsWith("/user_list")
            ? "#792df8"
            : "#637381"
        }
        size={20}
      />
    ),
    items: [
      {
        title: "Create User",
        link: "/create_use",
      },
      {
        title: "User List",
        link: "/user_list",
      },
    ],
  },
];

export default navConfig;

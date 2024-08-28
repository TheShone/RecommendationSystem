import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { PiUserListDuotone } from "react-icons/pi";
import { TbBrandBooking } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { IoMdAddCircle } from "react-icons/io";
import { FaProductHunt } from "react-icons/fa";
const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const logOut = async () => {
    try {
      console.log("KURCINA");
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(error);
    }
  };
  return (
    <div
      style={{ zIndex: 999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] fixed`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>{" "}
        </Link>
        {!userInfo ||
          (userInfo.role == "user" && (
            <Link
              to="/shop"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">SHOP</span>{" "}
            </Link>
          ))}
        {userInfo && userInfo.role == "user" && (
          <Link
            to="/cart"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">CART</span>{" "}
          </Link>
        )}
        {userInfo && (
          <Link
            to="/profile"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <CgProfile className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">
              {userInfo.username}
            </span>{" "}
          </Link>
        )}
        {userInfo && userInfo.role == "admin" && (
          <Link
            to="/admin/userList"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <PiUserListDuotone className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Users</span>{" "}
          </Link>
        )}
        {userInfo && userInfo.role == "admin" && (
          <Link
            to="/admin/brandsList"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <TbBrandBooking className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Brands</span>{" "}
          </Link>
        )}
        {userInfo && userInfo.role == "admin" && (
          <Link
            to="/admin/producttypeslist"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <BiCategoryAlt className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">
              Categories
            </span>{" "}
          </Link>
        )}
        {userInfo && userInfo.role == "admin" && (
          <Link
            to="/admin/attributesList"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <IoMdAddCircle className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">
              Attributes
            </span>{" "}
          </Link>
        )}
        {userInfo && userInfo.role == "admin" && (
          <Link
            to="/admin/productesList"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <FaProductHunt className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">
              Productes
            </span>{" "}
          </Link>
        )}
      </div>
      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">LOGIN</span>{" "}
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">
                REGISTER
              </span>{" "}
            </Link>
          </li>
        </ul>
      )}
      {userInfo && (
        <Link className="flex items-center transition-transform transform hover:translate-x-2">
          <CiLogout className="mr-2 " size={26} onClick={logOut} />
          <span className="hidden nav-item-name " onClick={logOut}>
            LOGOUT
          </span>{" "}
        </Link>
      )}
    </div>
  );
};
export default Navigation;

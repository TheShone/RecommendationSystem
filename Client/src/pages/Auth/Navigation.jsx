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
import { IoBag } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { clearCarItems } from "../../redux/features/cart/cartSlice";

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
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const logOut = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(clearCarItems());
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
      <div className="flex flex-col justify-center space-y-2">
      {(!userInfo || (userInfo && userInfo.role != "admin")) && (
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-1"
        >
          <AiOutlineHome className="mr-2 mt-[2rem]" size={26} />
          <span className="hidden nav-item-name mt-[2rem]">Home</span>{" "}
        </Link>
      )}
      {(!userInfo || (userInfo && userInfo.role != "admin")) && (
        <>
        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Shop</span>{" "}
        </Link>
        <div className="">
        {cartItems?.length > 0 && (
          <span className="px-1 py-0 text-sm text-white bg-red-500 rounded-full mr-[2rem] absolute mt-[2.5rem]">
            {cartItems.reduce((acc, product) => acc + product.qty, 0)}
          </span>
        )}
      </div>
      </>
      )}
        {(!userInfo || (userInfo && userInfo.role != "admin")) && (
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Cart</span>{" "}
        </Link>
        )}
        {userInfo && userInfo.role != "admin" && (
          <Link
            to="/userorders"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <IoBag className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">
              My Orders
            </span>{" "}
          </Link>
        )}
        {userInfo && userInfo.role == "admin" && (
          <Link
            to="/admin/allproductslist"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <MdAdminPanelSettings className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">
              Admin panel
            </span>{" "}
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
      </div>
      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Login</span>{" "}
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">
                Register
              </span>{" "}
            </Link>
          </li>
        </ul>
      )}
      {userInfo && (
        <Link className="flex items-center transition-transform transform hover:translate-x-2">
          <CiLogout className="mr-2 " size={26} onClick={logOut} />
          <span className="hidden nav-item-name " onClick={logOut}>
            Logout
          </span>{" "}
        </Link>
      )}
    </div>
  );
};
export default Navigation;

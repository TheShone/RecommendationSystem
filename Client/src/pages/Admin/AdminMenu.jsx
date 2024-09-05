import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-[#151515] p-2 fixed rounded-lg`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
          </>
        )}
      </button>
      {isMenuOpen && (
        <section className="bg-[#151515] p-4 fixed right-7 top-5">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="list-item py-2 px-3 mb-5 hover:bg-[#2ED2D] rounded-sm"
                to="/admin/userList"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 mb-5 hover:bg-[#2ED2D] rounded-sm"
                to="/admin/brandsList"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Brands
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 mb-5 hover:bg-[#2ED2D] rounded-sm"
                to="/admin/producttypeslist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 mb-5 hover:bg-[#2ED2D] rounded-sm"
                to="/admin/attributesList"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Atributes
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 mb-5 hover:bg-[#2ED2D] rounded-sm"
                to="/admin/productesList"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Create product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 mb-5 hover:bg-[#2ED2D] rounded-sm"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 mb-5 hover:bg-[#2ED2D] rounded-sm"
                to="/admin/orders"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Order list
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;

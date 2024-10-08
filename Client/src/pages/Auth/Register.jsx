import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import "react-datepicker/dist/react-datepicker.css";
import {
  useRegisterMutation,
  useCreatePreferencesMutation,
} from "../../redux/api/usersApiSlice";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useGetProductTypesQuery } from "../../redux/api/productTypesApiSlice";
import { useGetBrandsQuery } from "../../redux/api/brandsApiSlice";
import { v4 } from "uuid";
import { storage } from "../../firabse";
const Register = () => {
  const [username, setUsername] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateBirth, setDateBirth] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/login";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
  const [createPreferences] = useCreatePreferencesMutation();
  const { data: categories } = useGetProductTypesQuery();
  const { data: brands } = useGetBrandsQuery();
  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);
  const registUser = async (e) => {
    e.preventDefault();
    if (name && surname && username && email && password && confirmPassword && dateBirth && 
      photo && brand && category
    ) {
      if (password != confirmPassword) toast.error("Passwords do not match");
      else {
        try {
          const imageRef = ref(storage, `users/${photo.name + v4()}`);
          uploadBytes(imageRef, photo).then(() => {
            getDownloadURL(imageRef).then(async (res) => {
              try {
                const addedUser = await register({ name, surname, username, email,
                  password, dateBirth, address, photo: res,type_id: category,
                  brand_id: brand,
                }).unwrap();
                if (addedUser.id != undefined) {
                  toast.success(
                    "Added user " + addedUser.username + " successfully"
                  );
                  navigate(redirect);
                } else {
                  toast.error("Registration failed: User data is undefined.");
                }
              } catch (error) {
                toast.error(error.data);
                console.log("Error:", error);
              }
            });
          });
        } catch (error) {
          toast.error(error.data);
        }
      }
    } else toast.error("All fields are required");
  };
  return (
    <section className="pl-[45rem] flex flex-wrap">
      <div className="mt-[5rem] items-center">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <form onSubmit={registUser} className="container w-[60rem]">
          <div className="my-[2rem]">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="surname" className="block text-sm font-medium">
              Surname
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Enter name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="Date birth" className="block text-sm font-medium">
              Date birth
            </label>
            <DatePicker
              selected={dateBirth}
              onChange={(dateBirth) => setDateBirth(dateBirth)}
              icon="fa fa-calendar"
            />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="Address" className="block text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="Photo" className="block text-sm font-medium">
              Photo
            </label>
            <input
              type="file"
              id="photo"
              className="mt-1 p-2 border rounded w-full shadow-sm"
              placeholder="Address"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
          <div className="my-[2rem] justify-between">
            <label className="block text-sm font-medium ">Preferences</label>
            <select
              className="p-4 mb-3 w-[15rem] border rounded-lg text-black shadow-sm"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={isLoading || !brands}
            >
              <option value="" disabled>
                {isLoading ? "Loading brands..." : "Select Brand"}
              </option>
              {!isLoading &&
                brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>
            <select
              className="p-4 mb-3 w-[15rem] border rounded-lg shadow-sm text-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading || !categories}
            >
              <option value="" disabled>
                {isLoading ? "Loading categories..." : "Select categorie"}
              </option>
              {!isLoading &&
                categories?.map((categorie) => (
                  <option key={categorie.id} value={categorie.id}>
                    {categorie.name}
                  </option>
                ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-full text-lg"
          >
            Register
          </button>
        </form>

        <div className="mt-4">
          <p className="text-black">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;

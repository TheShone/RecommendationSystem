import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredientials } from "../../redux/features/auth/authSlice";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { useUpdateProfileMutation } from "../../redux/api/usersApiSlice";
import { useGetProfileQuery } from "../../redux/api/usersApiSlice";
import DatePicker from "react-datepicker";
import { FaCamera } from "react-icons/fa";
import { Image } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firabse";
import { v4 } from "uuid";

const Profile = () => {
  const icon = <FaCamera />;
  const [username, setUsername] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateBirth, setDateBirth] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const [newPhoto, setNewPhoto] = useState("");

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateProfileMutation();
  const {
    data: profile,
    isLoading: loadingGetProfile,
    refetch,
  } = useGetProfileQuery(userInfo.id);
  useEffect(() => {
    if (profile) {
      console.log(profile);
      setUsername(profile.username);
      setEmail(profile.email);
      setName(profile.name);
      setSurname(profile.surname);
      setDateBirth(profile.dateBirth);
      setAddress(profile.address);
      setPhoto(profile.photo);
    }
  }, [profile]);
  const dispatch = useDispatch();

  const updateUser = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) toast.error("Passwords do not match");
    else {
      try {
        const imageRef = ref(storage, `users/${newPhoto.name + v4()}`);
        uploadBytes(imageRef, newPhoto).then(() => {
          getDownloadURL(imageRef).then(async (res) => {
            try {
              console.log({
                name,
                surname,
                username,
                email,
                password,
                dateBirth,
                address,
                photo: res,
              });
              const updated = await updateProfile({
                id: userInfo.id,
                name,
                surname,
                username,
                email,
                password,
                dateBirth,
                address,
                photo: res,
              }).unwrap();
              toast.success("Profile successfully updated");
              dispatch(
                setCredientials({
                  id: updated.id,
                  username: updated.username,
                  email: updated.email,
                  role: updated.role,
                })
              );
              console.log("kao");
              refetch();
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
  };

  return (
    <section className="pl-[30rem] flex flex-wrap">
      <div className="mt-[2rem] items-center">
        <form onSubmit={updateUser} className="container w-[60rem]">
          <div className="my-[1rem]">
            <Image
              src={photo}
              indicatorIcon={icon}
              alt="Image"
              preview
              className="w-[250px] h-[250px] object-cover"
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="surname" className="block text-sm font-medium">
              Surname
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-[1rem]">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-[1rem]">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="Date birth" className="block text-sm font-medium">
              Date birth
            </label>
            <DatePicker
              selected={dateBirth}
              onChange={(dateBirth) => setDateBirth(dateBirth)}
              icon="fa fa-calendar"
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="Address" className="block text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="Photo" className="block text-sm font-medium">
              Photo
            </label>
            <input
              type="file"
              id="photo"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Address"
              onChange={(e) => setNewPhoto(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default Profile;

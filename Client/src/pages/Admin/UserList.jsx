import React from "react";
import { useEffect, useState } from "react";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import AdminMenu from "./AdminMenu";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [edittableUserId, setEditableUserId] = useState(null);
  const [edittableUserEmail, setEdittableUserEmail] = useState("");
  useEffect(() => {
    refetch();
  }, [refetch]);
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (error) {
        toast.error("Error " + error);
      }
    }
  };
  return (
    <div className="p-4 ml-[15rem]">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu/>
          <table className="w-full md:w-4-5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">USERNAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
                <th className="px-4 py-2 text-left">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {user.role === "user" ? (
                      <MdOutlineDoNotDisturbAlt size={26} />
                    ) : (
                      <CiCircleCheck size={27} />
                    )}
                  </td>
                  <td className="px-4 py-2 align-items: center">
                    {user.role === "user" ? (
                        <button onClick={() => deleteHandler(user.id)}>
                      <MdDeleteForever
                        size={26}
                      /></button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;

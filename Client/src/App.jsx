import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;
function App() {
  return (
      <>
        <ToastContainer />
        <Navigation />
        <main className="py-3">
          <Outlet />
        </main>
      </>
  );
}

export default App;

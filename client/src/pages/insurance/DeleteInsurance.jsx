import { useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Cookies from "js-cookie";

const DeleteInsurance = () => {
  const { fileId } = useParams(); // Get the fileId from the URL
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const deleteInsurance = async () => {
      try {
        const csrfToken = Cookies.get("csrftoken"); // Get the CSRF token from cookies

        // Log the CSRF token and fileId for debugging
        // console.log("CSRF Token:", csrfToken);
        // console.log("Deleting insurance with fileId:", fileId);

        const response = await axios.delete(
          `http://localhost:8000/insurance/file/delete/${fileId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "X-CSRFToken": csrfToken, 
            },
          }
        );

        console.log("Delete response:", response);

        // Redirect
        navigate(`/home`);
      } catch (err) {
        // Log the full error for debugging
        console.error("Error deleting chapter:", err);

      }
    };

    deleteInsurance();
  }, [fileId, authTokens, navigate, user.user_id]); 

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default DeleteInsurance;
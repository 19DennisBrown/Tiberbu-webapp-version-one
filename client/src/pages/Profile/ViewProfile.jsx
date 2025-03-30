import { useState, useEffect, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { FaUserDoctor, FaUserInjured } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authTokens, user } = useContext(AuthContext);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      if (user.role === "physician") {
        url = `http://localhost:8000/user/physician/${user.user_id}/`;
      } else if (user.role === "patient") {
        url = `http://localhost:8000/user/patient/${user.user_id}/`;
      } else {
        setError("Invalid user role");
        return;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setProfileData(response.data);
      console.log("Profile Data: ", response.data)

    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const toggleProfile = () => {
    if (!showProfile) {
      fetchProfileData();
    }
    setShowProfile(!showProfile);
  };

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfile && e.target.classList.contains('profile-overlay')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfile]);

  return (
    <>
      {/* Profile Trigger Button */}
      <div className="z-10">
        <button
          onClick={toggleProfile}
          className="relative p-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="View profile"
        >
          {user.role === "physician" ? (
            <FaUserDoctor className="w-6 h-6" />
          ) : (
            <FaUserInjured className="w-6 h-6" />
          )}
          {showProfile && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Profile Overlay */}
      {showProfile && (
        <div className="profile-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleProfile}
              aria-label="Close profile"
            >
              <AiOutlineClose className="w-5 h-5 text-gray-600" />
            </button>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AiOutlineClose className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Profile</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                  onClick={toggleProfile}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* Profile Content */}
            {!loading && !error && profileData && (
              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-blue-700">
                      {profileData.first_name?.charAt(0) || user.username?.charAt(0) || "U"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profileData.first_name || ""} {profileData.last_name || ""}
                  </h2>
                  <p className="text-blue-600 font-medium mt-1">
                    {user.role === "physician" ? "Physician" : "Patient"}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Physician Profile */}
                {user.role === "physician" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Specialisation</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {profileData.physician?.specialisation || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                        <p className="text-lg font-medium text-gray-800">{user.username}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                      <p className="text-lg font-medium text-gray-800">
                        {profileData.physician?.user?.email || "Not specified"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Patients</h4>
                      <p className="text-lg font-medium text-gray-800">
                        {profileData.patients?.length || 0} under care
                      </p>
                    </div>
                  </div>
                )}

                {/* Patient Profile */}
                {user.role === "patient" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Age Category</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {profileData.patient?.age_category || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                        <p className="text-lg font-medium text-gray-800">{user.username}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Physician</h4>
                      <p className="text-lg font-medium text-gray-800">
                        {profileData.patient
                          ? `Dr. ${profileData.patient?.physician?.first_name} ${profileData.patient?.physician?.last_name}`
                          : "Not assigned"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {profileData.patient?.user?.email || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Medical History</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {profileData.patient?.illnesses?.length || 0} recorded
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Button */}
                <div className="mt-8 flex justify-center">
                  <button 
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setShowProfile(false);
                      navigate(`/update_profile/${user.user_id}`)
                      // You might want to navigate to an edit page here
                    }}
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && !profileData && (
              <div className="p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {user.role === "physician" ? (
                    <FaUserDoctor className="w-10 h-10 text-gray-400" />
                  ) : (
                    <FaUserInjured className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Profile Not Found</h3>
                <p className="text-gray-500 mb-6">
                  Please complete your profile setup to view your information
                </p>
                <button
                  onClick={toggleProfile}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProfile;
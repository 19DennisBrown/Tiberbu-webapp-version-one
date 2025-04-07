import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../pages/Chat/Chat";
import ViewInsuranceDocs from "../pages/insurance/ViewInsuranceDocs";
import { FiArrowLeft, FiUser,  FiFileText, FiShield } from "react-icons/fi";

const PatientForPhysician = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const { authTokens, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:8000/user/patient/${user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient data: ", error);
        setError("Failed to load patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user_id, authTokens.access]);

  const renderInitials = () => {
    if (patientData?.patient?.first_name && patientData?.patient?.last_name) {
      return patientData.patient.first_name.charAt(0) + patientData.patient.last_name.charAt(0);
    }
    return user?.username?.charAt(0) || "U";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800">{error}</h3>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg max-w-md w-full text-center">
          <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700">No patient data available</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Patient Profile</h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Patient Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-blue-700">
                  {renderInitials()}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">
                  {patientData.patient?.first_name || "Unknown"} {patientData.patient?.last_name || ""}
                </h2>
                <p className="text-gray-600 mt-1">
                  {patientData.user?.email || "No email provided"}
                </p>
                {patientData.patient?.age_category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {patientData.patient.age_category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "profile" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiUser className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("insurance")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "insurance" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiShield className="inline mr-2" />
              Insurance
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "chat" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiFileText className="inline mr-2" />
              Messages
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  <FiUser className="inline mr-2 text-blue-500" />
                  Personal Information
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="mt-1 text-gray-900">
                      {patientData.patient?.first_name || "Unknown"} {patientData.patient?.last_name || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="mt-1 text-gray-900">
                      {patientData.user?.email || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age Category</p>
                    <p className="mt-1 text-gray-900">
                      {patientData.patient?.age_category || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  <FiFileText className="inline mr-2 text-blue-500" />
                  Medical Information
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Primary Physician</p>
                    <p className="mt-1 text-gray-900">
                      {patientData.patient?.physician
                        ? `Dr. ${patientData.patient.physician.first_name} ${patientData.patient.physician.last_name}`
                        : "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Illness</p>
                    <p className="mt-1 text-gray-900 font-medium">
                      {patientData.patient_illness?.title || "Not recorded"}
                    </p>
                    {patientData.patient_illness?.description && (
                      <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {patientData.patient_illness.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "insurance" && (
          <div className="mb-8">
            <ViewInsuranceDocs user_id={user_id} />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="mb-8">
            <Chat patientData={patientData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientForPhysician;
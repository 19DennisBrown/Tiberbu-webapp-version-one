import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
// import { AiOutlineClose } from "react-icons/ai";
// import { FaUserDoctor, FaUserInjured } from "react-icons/fa6";
// import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../pages/Chat/Chat"

const PatientForPhysician = () => {
  const navigate = useNavigate();
  const id = useParams();
  const [patientData, setPatientData] = useState();
  const { authTokens, user } = useContext(AuthContext);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchpatientData = async () => {
      setLoading(false);
      setError(null);
      // console.log("this is the id:", id.user_id)
      try {
        const response = await axios.get(
          `http://localhost:8000/user/patient/${id.user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPatientData(response.data);
        console.log("Patient Data: ", response.data);
      } catch (error) {
        console.log("Error: ", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchpatientData();
  }, [id.user_id, authTokens.access]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="">{error}</div>;
  }
  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="text-center mb-8">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-blue-700">
            {patientData.patient?.first_name?.charAt(0) +
              patientData.patient?.last_name?.charAt(0) ||
              user.username?.charAt(0) ||
              "U"}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {patientData.patient?.first_name || ""} {patientData.patient?.last_name || ""}
        </h2>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Age Category
            </h4>
            <p className="text-lg font-medium text-gray-800">
              {patientData.patient?.age_category || "Not specified"}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-1"> Guardian-Physician</h4>
          <p className="text-lg font-medium text-gray-800">
            {patientData.patient
              ? `Dr. ${patientData.patient?.physician?.first_name} ${patientData.patient?.physician?.last_name}`
              : "Not assigned"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
            <p className="text-lg font-medium text-gray-800">
              {patientData.patient?.user?.email || "Not specified"}
            </p>
          </div>

          {/* Illness SECTION */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Illness title
            </h4>
            <p className="text-lg font-medium text-gray-800">
              {patientData.patient_illness?.title || "not recorded."}
            </p>
            <p className="text-lg font-medium text-gray-800">
              <span className="text-orange-500"> Description?</span>{" "}
              {patientData.patient_illness?.description || "not recorded"}
            </p>
          </div>

          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Medical History
            </h4>
            <p className="text-lg font-medium text-gray-800">
              {patientData.patient_illness?.count || 0} recorded
            </p>
          </div> */}
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="border border-green-400 px-8 items-center text-red-400 rounded-2xl"
      >
        exit
      </button>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      <section className="grid">
        <Chat />
      </section>
    </div>
  );
};

export default PatientForPhysician;

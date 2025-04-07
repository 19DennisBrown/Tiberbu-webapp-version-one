import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const PhysicianPatient = () => {
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8000/user/physician-patient/${user.user_id}/patients/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPatients(response.data);
      } catch (err) {
        setError({
          message: err.response?.data?.error || "Failed to load patient data",
          details: err.response?.data?.detail || err.message,
        });
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user.user_id, authTokens.access]);

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      (patient.patient_illness?.title &&
        patient.patient_illness.title.toLowerCase().includes(searchLower)) ||
      (patient.patient_illness?.description &&
        patient.patient_illness.description.toLowerCase().includes(searchLower))
    );
  });

  // Error and Loading states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-8 w-8 border-t-4 border-blue-600 border-solid rounded-full"></div>
        <p className="ml-4 text-lg text-gray-700">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-medium text-gray-900">Error Loading Data</h3>
          <p className="text-sm text-gray-500">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Patients</h1>
        <p className="mt-2 text-gray-600">View and manage your assigned patients.</p>

        <div className="mt-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search patients by name or illness..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPatients.length === 0 ? (
          <p className="mt-6 text-gray-500">No patients found matching your search.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.user_id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:bg-gray-100 transition"
                onClick={() => navigate(`/patient/${patient.user_id}`)}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Age category: {patient.age_category || "Not specified"}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {patient.patient_illness?.title || "No illness records"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicianPatient;

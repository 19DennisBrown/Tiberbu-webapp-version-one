import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const PhysicianIllness = () => {
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [illnesses, setIllness] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIllnesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8000/user/physician-illness/${user.user_id}/illness/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "Content-Type": "application/json",
            },
          }
        );

        setIllness(response.data);
        console.log("Illness list", response.data);
      } catch (err) {
        setError({
          message: err.response?.data?.error || "Failed to load illness data",
          details: err.response?.data?.detail || err.message,
        });
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIllnesses();
  }, [user.user_id, authTokens.access]);

  const filteredIllnesses = illnesses.filter((illness) =>
    illness.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

// Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-8 w-8 border-t-4 border-blue-600 border-solid rounded-full"></div>
        <p className="ml-4 text-lg text-gray-700">Loading data...</p>
      </div>
    );
  }

  //  Error state
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
            Reload
          </button>
        </div>
      </div>
    );
  }

  //  Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">{"Illnesses You're Attending To"}</h1>
        <p className="mt-2 text-gray-600">{"View and manage your assigned patients' illnesses."}</p>

        <div className="mt-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search illness..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredIllnesses.length === 0 ? (
          <p className="mt-6 text-gray-500">No illness found matching your search.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredIllnesses.map((illness) => (
              <div
                key={illness.id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:bg-gray-100 transition"
                onClick={() => navigate(`/patient/${illness.user.id}`)}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{illness.title}</h3>
                  <p className="text-sm text-gray-500">
                    Description: {illness.description || "Not specified"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicianIllness;

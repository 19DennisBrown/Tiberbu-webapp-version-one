import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from 'axios';
// import Header from "../components/Header";

const ViewIllnesses = () => {
  const { user_id } = useParams();
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [illnesses, setIllnesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIllnesses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/illness/patient/${user.user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setIllnesses(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load illness records");
        console.error("Error fetching illnesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIllnesses();
  }, [user.user_id, authTokens.access]);

  const handleDelete = async (illnessId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await axios.delete(
        `http://localhost:8000/user/illness/${illnessId}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      setIllnesses(illnesses.filter(illness => illness.id !== illnessId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete record");
      console.error("Error deleting illness:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Header /> */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading illness records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Header /> */}
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Error Loading Data</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
                <p className="mt-1 text-gray-600">View and manage illness history</p>
              </div>
              <div className="mt-4 md:mt-0 space-x-3">
                <Link
                  to={`/create-illness`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add New Record
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            {illnesses.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No medical records found</h3>
                <p className="mt-1 text-gray-500">Get started by creating a new illness record.</p>
                <div className="mt-6">
                  <Link
                    to={`/create-illness`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add New Record
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {illnesses.map((illness) => (
                  <div key={illness.id} className="bg-gray-50 rounded-lg p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{illness.title}</h3>
                        <p className="mt-1 text-gray-600">{new Date(illness.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-3">
                        <Link
                          to={`/update-illness/${illness.user_id}`}
                          state={{ illness }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(illness.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Details:</h4>
                      <p className="mt-1 text-gray-600 whitespace-pre-wrap">{illness.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewIllnesses;
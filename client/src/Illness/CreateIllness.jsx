import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const CreateIllness = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    physician: "", // New field for the selected physician
  });

  const [physicians, setPhysicians] = useState([]); // To hold the list of physicians
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch physicians from API
    const fetchPhysicians = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/physicians/", {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        });
        setPhysicians(response.data);
      } catch (err) {
        setError("Failed to fetch physicians");
        console.error("Error fetching physicians:", err);
      }
    };

    fetchPhysicians();
  }, [authTokens.access]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const url = "http://localhost:8000/user/create/illness/";
  
    // Ensuring the physician is sent as a number (physician ID) not an object
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      physician: formData.physician, // Send physician as ID (this will be a number, not an object)
    };
  
    axios
      .post(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        navigate("/home"); // Adjust to your desired redirect
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Failed to create illness record. Please try again.");
        console.error("Error creating illness record:", error.response ? error.response.data : error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const handleCancel = () => navigate(-1); // Go back to previous page

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Illness Record</h1>
            <p className="text-gray-600">Document patient health information</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Condition Title
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-lg border"
                  placeholder="e.g. Diabetes Type 2, Hypertension"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Name of the medical condition</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Medical Details
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 sm:text-sm border border-gray-300 rounded-lg"
                  placeholder="Describe symptoms, diagnosis details, treatment plan..."
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Include relevant medical information</p>
            </div>

            <div>
              <label htmlFor="physician" className="block text-sm font-medium text-gray-700 mb-1">
                Select Physician
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  name="physician"
                  id="physician"
                  value={formData.physician}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-lg"
                  required
                >
                  <option value="">-- Select Physician --</option>
                  {physicians.map((physician) => (
                    <option key={physician.user_id} value={physician.user_id}>
                      Dr. {physician.first_name} {physician.last_name} ({physician.specialisation})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-75"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Record"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIllness;

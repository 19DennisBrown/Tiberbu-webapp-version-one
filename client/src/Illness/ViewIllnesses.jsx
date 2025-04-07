import { useState, useEffect, useContext } from "react";
import {  Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const ViewIllnesses = () => {
  const { authTokens, user } = useContext(AuthContext);

  // Use logged-in user's id instead of URL param
  const patient_id = user.user_id;

  const [illnesses, setIllnesses] = useState([]);
  const [physicians, setPhysicians] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIllnesses = async () => {
      // Check if patient_id is available
      if (!patient_id) {
        setError("Patient ID is missing");
        setLoading(false);
        return;
      }

      try {
        const illnessResponse = await axios.get(
          `http://localhost:8000/user/patients/${patient_id}/illnesses/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );

        const illnessesData = illnessResponse.data;

        // Extract unique physician IDs (filter out undefined/null)
        const physicianIds = [
          ...new Set(
            illnessesData
              .map((illness) => illness.physician)
              .filter((id) => id !== undefined && id !== null)
          ),
        ];

        if (physicianIds.length > 0) {
          const physicianPromises = physicianIds.map((id) =>
            axios.get(`http://localhost:8000/user/physician/${id}/`, {
              headers: {
                Authorization: `Bearer ${authTokens?.access}`,
              },
            })
          );

          const physicianResponses = await Promise.all(physicianPromises);
          const physiciansData = physicianResponses.reduce((acc, response) => {
            const physician = response.data;
            acc[physician.id] = physician;
            return acc;
          }, {});

          setPhysicians(physiciansData);
        }

        setIllnesses(illnessesData);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to load illness records. Please try again."
        );
        console.error("Error fetching illnesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIllnesses();
  }, [patient_id, authTokens?.access]);

  const filteredIllnesses = illnesses.filter((illness) =>
    illness.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    illness.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
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
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredIllnesses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p>No illnesses found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Illness Records
        </h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search records..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <Link
            to="/create-illness"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
          >
            Add New Record
          </Link>
        </div>
      </div>

      {filteredIllnesses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchTerm ? "No matching records found" : "No illness records yet"}
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? "Try a different search term"
              : "Get started by adding your first record"}
          </p>
          <div className="mt-6">
            <Link
              to="/create-illness"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add First Record
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIllnesses.map((illness) => (
            <div key={illness.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {illness.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(illness.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {illness.description}
                  </p>
                </div>
                {illness.physician && physicians[illness.physician] && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Physician Details
                    </h4>
                    <p className="text-sm text-gray-700">
                      {physicians[illness.physician].first_name}{" "}
                      {physicians[illness.physician].last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {physicians[illness.physician].specialisation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewIllnesses;

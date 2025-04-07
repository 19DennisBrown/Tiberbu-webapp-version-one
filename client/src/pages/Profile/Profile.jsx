import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import Header from '../../components/Header';

const Profile = () => {
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        specialisation: "",
        age_category: "",
        physician: "",
    });

    const [physicians, setPhysician] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch physicians when the user is a patient
    useEffect(() => {
        if (user?.role === "patient") {
            setLoading(true);
            axios
                .get("http://localhost:8000/user/physicians/", {
                    headers: { Authorization: `Bearer ${authTokens?.access}` },
                })
                .then((response) => {
                    setPhysician(response.data);
                    console.log("Physicians", response.data)
                })
                .catch((error) => {
                    console.error("Error fetching physicians:", error);
                    setError("Failed to load physicians. Please try again.");
                })
                .finally(() => setLoading(false));
        }
    }, [user?.role, authTokens]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authTokens) {
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const requestData = {
            first_name: profile.first_name,
            last_name: profile.last_name,
            ...(user.role === "physician"
                ? { specialisation: profile.specialisation }
                : { age_category: profile.age_category, physician: profile.physician }),
        };

        try {
            const url = user.role === "physician"
                ? "http://localhost:8000/user/create-profile/physician/"
                : "http://localhost:8000/user/create-profile/patient/";

            await axios.post(url, requestData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });

            setSuccess(true);
            setTimeout(() => navigate("/home"), 1500);
        } catch (error) {
            console.error("Error creating profile:", error);
            setError(error.response?.data?.message || "Failed to create profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => navigate(-1);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                        <h1 className="text-2xl font-bold"> {`Create Your Profile ${user.role == "physician" ? "Doc" : "Patient"}`} </h1>
                        <p className="text-blue-100">
                            {user?.role === "physician" ? 
                                "Complete your physician profile" : 
                                "Set up your patient profile"}
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-100 border-l-4 border-green-500 p-4 mx-6 mt-6">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p>Profile created successfully!</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 p-4 mx-6 mt-6">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={profile.first_name}
                                    onChange={handleChange}
                                    id="first_name"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={profile.last_name}
                                    onChange={handleChange}
                                    id="last_name"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Role-Specific Fields */}
                        {user?.role === "physician" ? (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                                    Specialisation
                                </label>
                                <input
                                    type="text"
                                    name="specialisation"
                                    value={profile.specialisation}
                                    onChange={handleChange}
                                    id="department"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                    placeholder="Enter your field of specialisation"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="programme">
                                        Age Category
                                    </label>
                                    <input
                                        type="text"
                                        name="age_category"
                                        value={profile.age_category}
                                        onChange={handleChange}
                                        id="programme"
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                        placeholder="Enter your Age category eg Child, Teenage.... "
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="supervisor">
                                        Physician
                                    </label>
                                    <select
                                        name="physician"
                                        value={profile.physician}
                                        onChange={handleChange}
                                        id="supervisor"
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                        disabled={loading || physicians.length === 0}
                                    >
                                        <option value="">Select a physician</option>
                                        {physicians.map((sup) => (
                                            <option key={sup.user_id} value={sup.user_id}>
                                                {sup.first_name} {sup.last_name} ({sup.department})
                                            </option>
                                        ))}
                                    </select>
                                    {physicians.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-1">Loading physicians...</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-5 py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
                                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    "Create Profile"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
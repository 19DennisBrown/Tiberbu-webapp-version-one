import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import loginSvg from "../../assets/images/svg/login.svg";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(e, setError);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col sm:flex-row">
      <div className="hidden sm:flex flex-1 items-center justify-center p-8">
        <div className="max-w-md w-full">
          <img src={loginSvg} alt="Login Illustration" className="w-full h-auto object-contain" />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to Tiberbu</h2>
            <p className="text-gray-600 mt-2">Your comprehensive health management solution</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl font-bold text-center">Sign In</h1>
            <p className="text-center text-blue-100 mt-1">Access your Tiberbu account</p>
          </div>
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input id="username" type="text" name="username" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input id="password" type="password" name="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <button type="submit" disabled={loading} className={`w-full py-3 text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}>{loading ? "Signing in..." : "Sign in"}</button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">{"Don't have an account? "}<Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Register here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <form
        onSubmit={loginUser}
        className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Login
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="submit"
          value="Login"
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 cursor-pointer transition"
        />
      </form>

      <div className="absolute bottom-10 text-center text-gray-700">
        Not yet registered?{" "}
        <Link to="/register" className="text-blue-500 font-semibold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

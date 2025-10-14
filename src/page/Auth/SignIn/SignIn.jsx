import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { loggedUser } from "../../../redux/features/auth/authSlice";
import signinImage from "../../../assets/auth/signIn.png";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, isSuccess, isError, error, data }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log('Login attempt with:', credentials);

    try {
      const result = await login(credentials).unwrap();
      console.log('Login API response:', result);
    } catch (err) {
      console.error("Login API error:", err);
      // Error handling is done in the useEffect below
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      console.log('Login successful - Full response:', data);
      
      // Dispatch the entire response to Redux
      dispatch(loggedUser(data));

      // Extract user for navigation from the exact structure
      let user = null;
      if (data.data && data.data.attributes) {
        user = data.data.attributes.user;
      }

      if (user) {
        console.log('User role detected:', user.role);
        
        // Show success message
        toast.success("Login successful!");
        
        // Redirect based on role with slight delay for better UX
        setTimeout(() => {
          switch (user.role) {
            case "admin":
              navigate("/");
              break;
            case "super_admin":
              navigate("/super-admin/dashboard");
              break;
            case "user":
              navigate("/");
              break;
            default:
              console.warn('Unknown role, redirecting to home');
              navigate("/");
          }
        }, 100);
      } else {
        console.error('User data not found in response');
        toast.error("Login successful but user data missing");
      }
    }
  }, [isSuccess, data, dispatch, navigate]);

  // Handle errors
  useEffect(() => {
    if (isError && error) {
      console.log('Login error details:', error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.data) {
        // Handle RTK Query error structure
        errorMessage = error.data.message || errorMessage;
      } else if (error.message) {
        // Handle general error
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  }, [isError, error]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex justify-center mb-6">
            <img src={signinImage} alt="JobPilot Logo" className="w-8 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">JobPilot</h1>
          </div>
          <h2 className="text-center text-gray-800 text-2xl font-bold mb-2">Sign in</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Enter your details to access your account
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                defaultValue="admin@example.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                defaultValue="strongPassword123"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2" /> 
                Remember password
              </label>
              <Link to="/auth/forgot-password" className="text-red-500 text-sm font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-lime-400 text-white p-2 rounded-lg hover:from-green-700 hover:to-lime-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          {/* Don't have account section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-green-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
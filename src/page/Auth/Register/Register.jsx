import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../../../redux/features/auth/authApi";
import { loggedUser } from "../../../redux/features/auth/authSlice";
import signinImage from "../../../assets/auth/signIn.png";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading, isSuccess, isError, error, data }] = useRegisterMutation();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    const formData = new FormData(e.target);
    
    // Use exact field names that match backend expectations
    const userData = {
      firstName: formData.get("firstName")?.trim(),
      lastName: formData.get("lastName")?.trim() || "",
      email: formData.get("email")?.trim().toLowerCase(),
      phoneNumber: formData.get("phoneNumber")?.trim(),
      Designation: formData.get("Designation"),
      password: formData.get("password"),
      ConfirmPassword: formData.get("ConfirmPassword"),
    };

    console.log('Registration attempt with:', userData);

    // Enhanced client-side validation
    if (!userData.firstName) {
      toast.error("First name is required");
      return;
    }

    if (!userData.email) {
      toast.error("Email is required");
      return;
    }

    if (!userData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    if (!userData.Designation) {
      toast.error("Designation is required");
      return;
    }

    if (userData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (userData.password !== userData.ConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await register(userData).unwrap();
      console.log('Registration API response:', result);
    } catch (err) {
      console.error("Registration API error:", err);
      // Error handling is done in the useEffect below
    }
  };

  // Handle successful registration
  useEffect(() => {
    if (isSuccess && data && hasSubmitted) {
      console.log('Registration successful - Full response:', data);
      
      // Reset submission state
      setHasSubmitted(false);

      // Check if user needs email verification
      if (data.message && data.message.includes("Need To Verify Email")) {
        toast.success("Registration successful! Please check your email for verification OTP.");
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
        return;
      }
      
      // Handle immediate login scenario (if applicable)
      if (data.data?.user && data.data?.token) {
        dispatch(loggedUser({ user: data.data.user, token: data.data.token }));
        toast.success("Registration successful! Welcome to JobPilot.");
        navigate("/dashboard");
        return;
      }

      // Default success handling
      toast.success("Registration successful! Please check your email for verification.");
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    }
  }, [isSuccess, data, dispatch, navigate, hasSubmitted]);

  // Handle errors
  useEffect(() => {
    if (isError && error && hasSubmitted) {
      console.log('Registration error details:', error);
      setHasSubmitted(false);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.data) {
        // Handle RTK Query error structure
        const errorData = error.data;
        
        // Extract message from different possible structures
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          if (Array.isArray(errorData.error)) {
            errorMessage = errorData.error.map(err => err.msg || err.message).join(', ');
          } else if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          }
        }
        
        // Handle specific error cases
        if (errorMessage.toLowerCase().includes('email already exists') || 
            errorMessage.toLowerCase().includes('user already exists')) {
          errorMessage = "An account with this email already exists. Please use a different email or try logging in.";
        }
        
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  }, [isError, error, hasSubmitted]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center mb-6">
            <img src={signinImage} alt="JobPilot Logo" className="w-8 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">JobPilot</h1>
          </div>
          <h2 className="text-center text-gray-800 text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Sign up to start your journey with us
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1 font-medium text-gray-700 text-sm">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 font-medium text-gray-700 text-sm">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700 text-sm">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-1 font-medium text-gray-700 text-sm">
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="Designation" className="block mb-1 font-medium text-gray-700 text-sm">
                Designation *
              </label>
              <select
                id="Designation"
                name="Designation"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              >
                <option value="">Select your designation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="System Administrator">System Administrator</option>
                <option value="Network Engineer">Network Engineer</option>
                <option value="Database Administrator">Database Administrator</option>
                <option value="Security Engineer">Security Engineer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Technical Lead">Technical Lead</option>
                <option value="CTO">CTO</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700 text-sm">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength="6"
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="ConfirmPassword" className="block mb-1 font-medium text-gray-700 text-sm">
                Confirm Password *
              </label>
              <input
                id="ConfirmPassword"
                name="ConfirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength="6"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center mb-4">
              <label className="flex items-center text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  required 
                  disabled={isLoading}
                /> 
                I agree to the Terms and Conditions
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-lime-400 text-white p-2 rounded-lg hover:from-green-700 hover:to-lime-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CREATING ACCOUNT...
                </span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          {/* Already have account section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/auth/login" 
                className="text-green-600 font-medium hover:underline"
                onClick={(e) => isLoading && e.preventDefault()}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
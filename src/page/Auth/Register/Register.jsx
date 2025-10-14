import React, { useEffect } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Use exact field names that match backend expectations (with capital letters)
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      Designation: formData.get("Designation"), // Capital D
      password: formData.get("password"),
      ConfirmPassword: formData.get("ConfirmPassword"), // Capital C and P
    };

    console.log('Registration attempt with:', userData);

    // Client-side validation
    if (userData.password !== userData.ConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (userData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
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

    try {
      const result = await register(userData).unwrap();
      console.log('Registration API response:', result);
    } catch (err) {
      console.error("Registration API error:", err);
      // Error handling is done in the useEffect below
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      console.log('Registration successful - Full response:', data);
      
      // Check if user needs email verification
      if (data.message && data.message.includes("Need To Verify Email")) {
        // Show success message with OTP information
        toast.success("Registration successful! Please check your email for verification OTP.");
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
        
        return; // Stop further execution
      }
      
   
      
    }
  }, [isSuccess, data, dispatch, navigate]);

  // Handle errors
  useEffect(() => {
    if (isError && error) {
      console.log('Registration error details:', error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.data) {
        // Handle RTK Query error structure
        errorMessage = error.data.message || errorMessage;
        
        // Show specific field errors if available
        if (error.data.error && Array.isArray(error.data.error)) {
          error.data.error.forEach((err) => {
            // Don't show toast for each error, just show the main message
            // The main message already contains all validation errors
          });
        }
        
        // Show the main error message
        toast.error(errorMessage);
      } else if (error.message) {
        // Handle general error
        errorMessage = error.message;
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  }, [isError, error]);

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
              />
            </div>

            <div className="mb-4">
              <label htmlFor="Designation" className="block mb-1 font-medium text-gray-700 text-sm">
                Designation *
              </label>
              <select
                id="Designation"
                name="Designation" // Capital D to match backend
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
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
              />
            </div>

            <div className="mb-4">
              <label htmlFor="ConfirmPassword" className="block mb-1 font-medium text-gray-700 text-sm">
                Confirm Password *
              </label>
              <input
                id="ConfirmPassword"
                name="ConfirmPassword" // Capital C and P to match backend
                type="password"
                placeholder="Confirm your password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength="6"
              />
            </div>

            <div className="flex items-center mb-4">
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2" required /> 
                I agree to the Terms and Conditions
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-lime-400 text-white p-2 rounded-lg hover:from-green-700 hover:to-lime-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* Already have account section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-green-600 font-medium hover:underline">
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
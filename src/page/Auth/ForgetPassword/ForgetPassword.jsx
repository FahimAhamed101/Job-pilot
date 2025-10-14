import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import { useState } from "react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const result = await forgotPassword({ email }).unwrap();
      
      if (result.code === 200) {
        toast.success(result.message || "OTP sent to your email successfully");
        
        // Store email in localStorage for OTP verification
        localStorage.setItem("resetEmail", email);
        
        // Navigate to OTP verification page with email as parameter
        navigate(`/auth/otp/${email}`, { 
          state: { 
            email: email,
            message: result.message,
            purpose: "password_reset" // Indicate this is for password reset
          } 
        });
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      const result = await forgotPassword({ email }).unwrap();
      if (result.code === 200) {
        toast.success("OTP resent successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <Link 
          to="/auth" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </Link>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Forgot Password
        </h2>
        
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email address and we'll send you a One Time Password (OTP) to reset your password.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700 text-sm">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-lime-400 text-white p-3 rounded-lg hover:from-green-700 hover:to-lime-500 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        {/* Additional Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the OTP?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading || !email}
              className="text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Resend OTP
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            🔒 Your security is important to us. The OTP will expire in 3 minutes for your protection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyEmailMutation, useResendOtpMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem("verifyEmail") || "";

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please restart the verification process.");
      navigate("/auth");
      return;
    }

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [email, navigate]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    if (pastedOtp.every(char => !isNaN(char))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus the last filled input
      const lastFilledIndex = pastedOtp.length - 1;
      if (lastFilledIndex < 6 && inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      const result = await verifyEmail({ 
        email: email,
        oneTimeCode: otpValue 
      }).unwrap();

      if (result.code === 200) {
        toast.success(result.message || "Email verified successfully!");
        
        // Clear stored email
        localStorage.removeItem("verifyEmail");
        
        // Navigate based on context (login or post-registration)
        if (location.state?.from === "register") {
          navigate(`/auth/new-password/${email}`, { 
            state: { message: "Email verified successfully! You can now login." } 
          });
        } else {
          navigate(`/auth/new-password/${email}`);
        }
      }
    } catch (error) {
      console.error("Verify email error:", error);
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
      
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) {
      toast.error(`Please wait ${timer} seconds before resending OTP`);
      return;
    }

    try {
      const result = await resendOtp({ email }).unwrap();
      
      if (result.code === 200) {
        toast.success("OTP resent successfully");
        setTimer(180);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        
        // Focus first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <button 
          onClick={() => navigate("/auth")}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Verify Email
        </h2>

        <p className="text-center text-gray-500 text-sm mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-center text-gray-700 font-medium mb-6 break-all">
          {email}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-3 font-medium text-gray-700 text-sm text-center">
              6-Digit Verification Code
            </label>
            <div 
              className="flex justify-center space-x-2"
              onPaste={handlePaste}
            >
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                  disabled={isVerifying}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              OTP expires in:{" "}
              <span className={`font-semibold ${timer < 60 ? "text-red-500" : "text-green-600"}`}>
                {formatTime(timer)}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.join("").length !== 6}
            className="w-full bg-gradient-to-r from-green-600 to-lime-400 text-white p-3 rounded-lg hover:from-green-700 hover:to-lime-500 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || !canResend}
              className="text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? "Resending..." : canResend ? "Resend OTP" : "Resend OTP"}
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            🔒 For your security, this OTP will expire in 3 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
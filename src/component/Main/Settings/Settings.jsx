import React, { useState } from 'react';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useChangePasswordMutation } from '../../../redux/features/auth/authApi';

const Settings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const [changePassword, { isLoading, error }] = useChangePasswordMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }).unwrap();

      if (result.success) {
        setIsModalOpen(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className="text-gray-600 mb-6">Manage your account preferences and system configuration</p>

      <button className="bg-green-500 text-white px-4 py-2 rounded mb-6 hover:bg-green-600">
        Reset Password
      </button>
      <div className="max-w-md mx-auto">

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Please Enter</h3>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2">Current Password</label>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full p-2 border rounded pr-10"
              />
              <span
                className="absolute right-2 top-10 transform -translate-y-2/2 cursor-pointer"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2">New Password</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full p-2 border rounded pr-10"
                placeholder="••••••••"
              />
              <span
                className="absolute right-2 top-10 transform -translate-y-2/2 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full p-2 border rounded pr-10"
              />
              <span
                className="absolute right-2 top-10 transform -translate-y-2/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error.data?.message || 'Failed to change password'}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
          
          {/* Keep the existing warning message */}
          <p className="text-yellow-600 bg-yellow-100 p-2 mt-4 rounded text-sm">
            Weak password! Please use a stronger one.
          </p>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-sm text-center relative">
              <div className="absolute top-0 left-0 w-full h-16 bg-green-100 rounded-t-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-white text-3xl" />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-200 rounded-full"
                    style={{
                      top: `${Math.random() * 40 + 20}%`,
                      left: `${Math.random() * 80 + 10}%`,
                    }}
                  />
                ))}
              </div>
              <h3 className="text-xl font-semibold mt-16 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600">Your password has been successfully updated. You can now log in with your new credentials.</p>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
/* eslint-disable react/prop-types */
import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoMdSearch, IoIosLogOut } from "react-icons/io";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { logoutUser } from "../../../redux/features/auth/authSlice";
import { 
  useLogoutMutation,
  useGetProfileQuery, 
  useUpdateProfileMutation
} from "../../../redux/features/auth/authApi"; // FIXED: Import from authApi
import notification from "../../../assets/icone/notification.png";
import image from "../../../../public/user.jpg";

// Bind modal to your appElement (required for accessibility)
Modal.setAppElement("#root");

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user from auth state - UNCOMMENT THIS
  const { user: authUser, token } = useSelector((state) => state.auth);
  
  // RTK Query hooks
  const { 
    data: profileResponse,
    isLoading: profileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useGetProfileQuery(undefined, {
    skip: !token, // FIXED: Add skip condition back
  });

  // Extract profile data from the nested structure
  const profile = profileResponse?.data?.attributes;

  // Debug: Log profile data
  useEffect(() => {
    console.log('Profile Response:', profileResponse);
    console.log('Extracted Profile:', profile);
    console.log('Token exists:', !!token);
  }, [profileResponse, profile, token]);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // State for modals and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    Designation: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      console.log('Initializing form with profile data:', profile);
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "", // Note: Your API doesn't return lastName
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        Designation: profile.Designation || "",
      });
      
      // Set image preview with proper baseURL
      if (profile.profileImage) {
        const baseURL = 'https://unirenic-twittery-cammie.ngrok-free.dev' || 'http://localhost:5000';
        const fullImageUrl = `${baseURL}${profile.profileImage.startsWith('/') ? profile.profileImage : `/${profile.profileImage}`}`;
        setImagePreview(fullImageUrl);
      } else {
        setImagePreview(image);
      }
    }
  }, [profile]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic file validation
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      dispatch(logoutUser());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/auth");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedImage(null);
    // Reset to current profile image
    if (profile?.profileImage) {
      const baseURL = 'https://unirenic-twittery-cammie.ngrok-free.dev' || 'http://localhost:5000';
      const fullImageUrl = `${baseURL}${profile.profileImage.startsWith('/') ? profile.profileImage : `/${profile.profileImage}`}`;
      setImagePreview(fullImageUrl);
    } else {
      setImagePreview(image);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object (matching Postman exactly)
      const formDataToSend = new FormData();
      
      // Append all text fields (exactly like Postman)
      formDataToSend.append('firstName', formData.firstName || '');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('phoneNumber', formData.phoneNumber || '');
      formDataToSend.append('address', formData.address || '');
      formDataToSend.append('Designation', formData.Designation || '');
      
      // Append lastName only if it exists (Note: Your API doesn't have lastName field)
      if (formData.lastName) {
        formDataToSend.append('lastName', formData.lastName);
      }
      
      // Append image file if selected
      if (selectedImage) {
        console.log(`Uploading image: ${selectedImage.name} (${(selectedImage.size / 1024).toFixed(2)}KB)`);
        formDataToSend.append('profileImage', selectedImage);
      }

      console.log('Sending FormData to backend');
      // Log FormData contents for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? 
          `${pair[1].name} (${(pair[1].size / 1024).toFixed(2)}KB)` : 
          pair[1]
        ));
      }

      await updateProfile(formDataToSend).unwrap();
      
      alert("Profile updated successfully!");
      setSelectedImage(null);
      closeEditModal();
      await refetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      
      // More helpful error messages
      if (error?.status === 413 || error?.message?.includes('too large')) {
        alert('Image is too large. Please try a smaller image (under 5MB).');
      } else if (error?.code === 500 && error?.message?.includes('duplicate key')) {
        alert('This email address is already in use by another account. Please use a different email.');
        // Reset email to original
        setFormData(prev => ({
          ...prev,
          email: profile?.email || ''
        }));
      } else if (error?.message?.includes('Unexpected token') || error?.message?.includes('JSON')) {
        alert('Server configuration error. Please contact support.');
      } else {
        alert(`Failed to update profile: ${error?.data?.message || error.message || 'Unknown error'}`);
      }
    }
  };

  // Get user display name - handle the nested data structure
  const getUserDisplayName = () => {
    if (profile?.firstName) {
      // Your API returns "Fahim undefined" for fullName, so just use firstName
      return profile.firstName;
    }
    return authUser?.name || "User";
  };

  // Get user role with fallback - handle nested data
  const getUserRole = () => {
    return profile?.role || authUser?.role || "User";
  };

  // Get profile image - handle nested data and add baseURL
  const getProfileImage = () => {
    const profileImage = profile?.profileImage;
    
    if (profileImage) {
      // If it's already a full URL, return as is
      if (profileImage.startsWith('http')) {
        return profileImage;
      }
      
      // If it's a relative path, prepend baseURL
      const baseURL = 'https://unirenic-twittery-cammie.ngrok-free.dev' || 'http://localhost:5000';
      return `${baseURL}${profileImage.startsWith('/') ? profileImage : `/${profileImage}`}`;
    }
    
    return image; // fallback image
  };

  // Show error state if profile fails to load
  if (profileError) {
    console.error('Profile loading error:', profileError);
    return (
      <div className="w-full px-5 py-3.5 bg-[#FFFFFF] flex justify-between items-center sticky top-0 left-0 z-10 ml-0.5">
        <div className="flex items-center gap-3">
          <div className="bg-[#F0F0F0] w-[340px] h-[54px] p-3 rounded-md flex items-center gap-2">
            <IoMdSearch className="text-gray-500 text-2xl" />
            <input
              type="text"
              placeholder="Search by user or Job..."
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>
          <button className="md:hidden text-3xl" onClick={toggleSidebar}>
            <FiMenu />
          </button>
        </div>
        <div className="flex items-center gap-3 text-red-500">
          <span>Error loading profile</span>
          <button onClick={() => refetchProfile()} className="text-blue-500 hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="w-full px-5 py-3.5 bg-[#FFFFFF] flex justify-between items-center sticky top-0 left-0 z-10 ml-0.5">
        <div className="flex items-center gap-3">
          <div className="bg-[#F0F0F0] w-[340px] h-[54px] p-3 rounded-md flex items-center gap-2">
            <IoMdSearch className="text-gray-500 text-2xl" />
            <input
              type="text"
              placeholder="Search by user or Job..."
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
              disabled
            />
          </div>
          <button className="md:hidden text-3xl" onClick={toggleSidebar}>
            <FiMenu />
          </button>
        </div>
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
          <div className="space-y-2">
            <div className="w-20 h-3 bg-gray-300 rounded"></div>
            <div className="w-16 h-2 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-3.5 bg-[#FFFFFF] flex justify-between items-center sticky top-0 left-0 z-10 ml-0.5">
      <div className="flex items-center gap-3">
        <div className="bg-[#F0F0F0] w-[340px] h-[54px] p-3 rounded-md flex items-center gap-2">
          <IoMdSearch className="text-gray-500 text-2xl" />
          <input
            type="text"
            placeholder="Search by user or Job..."
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <button className="md:hidden text-3xl" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/notification">
          <div className="relative p-2 rounded-md bg-[#E6F6F0]">
            <img src={notification} className="w-[24px] h-[24px]" alt="Notification" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={openModal}>
          <img
            src={getProfileImage()}
            alt="User"
            className="size-10 rounded-md border border-gray-500 object-cover"
            onError={(e) => {
              // If image fails to load, use fallback
              e.target.src = image;
            }}
          />
          <div className="text-gray-700">
            <h1 className="text-sm font-medium">{getUserDisplayName()}</h1>
            <span className="text-xs text-gray-500 capitalize">{getUserRole()}</span>
          </div>
        </div>

        {/* Profile View Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            <img
              src={getProfileImage()}
              alt="User"
              className="size-20 rounded-full border border-gray-500 object-cover"
              onError={(e) => {
                e.target.src = image;
              }}
            />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-700">{getUserDisplayName()}</h3>
              <p className="text-sm text-gray-500 capitalize">Role: {getUserRole()}</p>
              {profile?.email && <p className="text-sm text-gray-500">Email: {profile.email}</p>}
              {profile?.phoneNumber && <p className="text-sm text-gray-500">Phone: {profile.phoneNumber}</p>}
              {profile?.Designation && <p className="text-sm text-gray-500">Designation: {profile.Designation}</p>}
              {profile?.address && <p className="text-sm text-gray-500">Address: {profile.address}</p>}
              {profile?.status && (
                <p className="text-sm text-gray-500">
                  Status: <span className={`capitalize ${profile.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {profile.status}
                  </span>
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={openEditModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <IoIosLogOut className="size-5" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 max-h-[90vh] overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
            
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="size-20 rounded-full border border-gray-500 object-cover"
                onError={(e) => {
                  e.target.src = image;
                }}
              />
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="profileImage"
                />
                <label
                  htmlFor="profileImage"
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
                >
                  {selectedImage ? "Change Photo" : "Select Photo"}
                </label>
                {selectedImage && (
                  <span className="text-xs text-green-600">
                    ✓ Photo selected ({(selectedImage.size / 1024).toFixed(0)}KB)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center">
                Maximum file size: 5MB
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="w-full space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="Designation"
                  value={formData.Designation}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Header;
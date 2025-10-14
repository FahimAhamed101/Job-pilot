const ChangeRequestDetails = () => {
  // Mock user data
  const user = {
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg", // Example image URL
    firstName: "John",
    lastName: "Doe",
    accountID: "12345",
    email: "johndoe@example.com",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    joiningDate: "2015-06-25",
  };

  return (
    <div className="md:flex justify-between space-x-10 px-4 sm:px-6 lg:px-8 mt-10">
      {/* User Profile */}
      <div className="w-full md:w-[70%]">
      <div className=" bg-primary text-black rounded-lg shadow-md mb-8">
        <div className="p-5">
          <div className="flex items-center space-x-4">
            <img
              className="h-24 w-24 rounded-full"
              src={user.imageUrl}
              alt="Profile"
            />
            <div>
              <h1 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h1>
              <h2 className="font-semibold text-gray-600">
                I am a UI/UX Designer
              </h2>
              <p className="text-gray-500">100 connections</p>
            </div>
          </div>
          <div className="space-y-3 mt-5">
            <div className="flex justify-between py-3 border-b">
              <p className="font-semibold">Account ID:</p>
              <p>{user.accountID}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p className="font-semibold">First Name:</p>
              <p>{user.firstName}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p className="font-semibold">Last Name:</p>
              <p>{user.lastName}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p className="font-semibold">Email:</p>
              <p>{user.email}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p className="font-semibold">Date of Birth:</p>
              <p>{user.dateOfBirth}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p className="font-semibold">Gender:</p>
              <p>{user.gender}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p className="font-semibold">Joining Date:</p>
              <p>{user.joiningDate}</p>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-black">
              Identity Card Photos
            </h1>
            <div className="flex space-x-3 pt-3">
              <div className="bg-[#606060] w-[49%] h-[150px] rounded-md"></div>
              <div className="bg-[#606060] w-[49%] h-[150px] rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      </div>
      {/* Change Request Section */}
      <div className="w-full md:w-[30%]">
        <div className="max-w-lg mx-auto p-4 bg-yellow-50 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Change Request
          </h2>
          <div className="mb-4 flex justify-between border-b">
            <h1 className="block text-gray-600">Old Gender</h1>
            <p className="text-gray-600">Male</p>
          </div>
          <div className="mb-6 flex justify-between border-b">
            <h1 className="block text-gray-600">New Gender</h1>
            <p className="text-gray-600">Female</p>
          </div>
          <div className="flex justify-between space-x-4">
            <button className="px-6 py-2 bg-yellow-900 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 w-full sm:w-auto">
              Approve
            </button>
            <button className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-auto">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestDetails;

import { Link } from 'react-router-dom';
import { useGetRecentJobApplicationsQuery } from '../../redux/features/dashboard/dashboardApi';
import { useGetAllUsersQuery } from '../../redux/features/user/userApi'; // Import the users API
import image1 from '../../assets/image/e22e8a1e2c5bb7a5825cd3213cb9cf6ab04731bb.png';
import React from 'react';

const CardHome = () => {
  const { 
    data: jobApplications = [], 
    isLoading: jobsLoading, 
    error: jobsError 
  } = useGetRecentJobApplicationsQuery({ 
    page: 1, 
    limit: 5 
  });

  // Use the actual users API instead of mock data
  const { 
    data: usersData = { users: [] }, 
    isLoading: usersLoading, 
    error: usersError 
  } = useGetAllUsersQuery({ 
    page: 1, 
    limit: 5 
  });

  const latestUsers = usersData.users || [];

  const statusStyles = {
    Shortlisted: { dot: 'bg-green-700', bg: 'bg-green-100', text: 'text-green-900' },
    Rejected: { dot: 'bg-red-700', bg: 'bg-red-100', text: 'text-red-900' },
    Pending: { dot: 'bg-yellow-600', bg: 'bg-yellow-100', text: 'text-yellow-900' },
    Accepted: { dot: 'bg-blue-700', bg: 'bg-blue-100', text: 'text-blue-900' },
    Applied: { dot: 'bg-gray-600', bg: 'bg-gray-100', text: 'text-gray-900' },
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get user avatar or fallback
  const getUserAvatar = (user, index) => {
    if (user?.avatar) return user.avatar;
    return `https://i.pravatar.cc/40?img=${index + 1}`;
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    if (user?.name) return user.name;
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    if (user?.email) return user.email.split('@')[0];
    return 'Unknown User';
  };

  const isLoading = jobsLoading || usersLoading;

  if (isLoading) {
    return (
      <div className="w-full container mx-auto flex space-x-6 animate-pulse">
        {/* Loading skeleton for Job Applications */}
        <div className="p-4 rounded-lg shadow-md w-1/2">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="h-10 bg-gray-200 rounded-full w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading skeleton for Latest Users */}
        <div className="p-4 rounded-lg shadow-md w-1/2">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="h-10 bg-gray-200 rounded-full w-10"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto flex space-x-6">
      {/* Recent Job Applications Panel */}
      <div className="p-4 rounded-lg shadow-md w-1/2">
        <div className='mt-5'>
          <h2 className="text-2xl font-semibold mb-2">Recent Job Applications</h2>
          <p className="text-lg text-gray-600 mb-4">A list of the most recent job applications.</p>
          
          {jobsError ? (
            <div className="text-red-500 text-center p-4">
              Failed to load job applications
            </div>
          ) : !jobApplications || jobApplications.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              No job applications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className='bg-[#E6F6F0]'>
                  <tr className="text-left text-gray-600">
                    <th className="pb-2 px-2 font-bold">User</th>
                    <th className="pb-2 font-bold">Job Title</th>
                    <th className="pb-2 font-bold">Status</th>
                    <th className="pb-2 font-bold">Applied on</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.map((app, index) => (
                    <tr key={app._id || index} className="border-t">
                      <td className="py-2 px-2">
                        <div className="flex items-center">
                          <img 
                            src={getUserAvatar(app, index)} 
                            alt={app.jobTitle || 'Job Application'} 
                            className="w-8 h-8 rounded-full mr-2" 
                          />
                          <span className="truncate max-w-[120px]">
                            {getUserDisplayName(app)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <img 
                            src={image1} 
                            className="w-[30px] h-[30px] rounded-full" 
                            alt="job icon" 
                          />
                          <span className="truncate max-w-[120px]">
                            {app.companyName || 'Unknown Company'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full ${statusStyles[app.status]?.bg || statusStyles.Pending.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${statusStyles[app.status]?.dot || statusStyles.Pending.dot} mr-2`}></span>
                          <span className={`text-xs ${statusStyles[app.status]?.text || statusStyles.Pending.text}`}>
                            {app.status || 'Pending'}
                          </span>
                        </span>
                      </td>
                      <td className="py-2">{formatDate(app.appliedDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <Link to="/applied" className="flex justify-end">
            <div className='flex justify-end'>
              <button className="mt-4 bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white px-4 py-2 rounded hover:bg-green-600">
                View All
              </button>
            </div>
          </Link>
        </div>
      </div>

      {/* Latest User Panel */}
      <div className="p-4 rounded-lg shadow-md w-1/2">
        <div className='mt-6'>
          <h2 className="text-2xl font-semibold mb-2">Latest Users</h2>
          <p className="text-lg text-gray-600 mb-4">A list of the most recently registered users.</p>
          
          {usersError ? (
            <div className="text-red-500 text-center p-4">
              Failed to load users
            </div>
          ) : latestUsers.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className='bg-[#E6F6F0]'>
                  <tr className="text-left text-gray-600">
                    <th className="pb-2 px-2 font-bold">Name</th>
                    <th className="pb-2 font-bold">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUsers.map((user, index) => (
                    <tr key={user._id || index} className="border-t">
                      <td className="py-2 px-2">
                        <div className="flex items-center">
                          <img 
                            src={getUserAvatar(user, index)} 
                            alt={getUserDisplayName(user)} 
                            className="w-8 h-8 rounded-full mr-2" 
                          />
                          <span className="truncate max-w-[120px]">
                            {getUserDisplayName(user)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 truncate max-w-[150px]">
                        {user.email || 'No email'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <Link to="/users" className="flex justify-end">
            <div className='flex justify-end'>
              <button className="mt-4 bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white px-4 py-2 rounded hover:bg-green-600">
                View All
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardHome;
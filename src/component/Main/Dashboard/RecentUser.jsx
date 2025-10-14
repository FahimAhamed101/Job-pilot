import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";

const RecentUser = () => {
  const { data: usersData = [], isLoading, error } = useGetAllUsersQuery();
  
  console.log('Recent Users Data:', usersData);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full col-span-full md:col-span-2 p-5 bg-white rounded-lg border border-[#85594B]">
        <h1 className="font-semibold py-3">Recent Users</h1>
        <div className="flex flex-col gap-5">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-2 animate-pulse">
              <div className="size-12 rounded-full bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full col-span-full md:col-span-2 p-5 bg-white rounded-lg border border-[#85594B]">
        <h1 className="font-semibold py-3">Recent Users</h1>
        <div className="text-red-500 text-center">
          Failed to load users
        </div>
      </div>
    );
  }

  // Get recent users (first 5 or sort by creation date)
  const recentUsers = usersData
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="w-full col-span-full md:col-span-2 p-5 bg-white rounded-lg border border-[#85594B]">
      <h1 className="font-semibold py-3">Recent Users</h1>
      <div className="flex flex-col gap-5">
        {recentUsers.length === 0 ? (
          <div className="text-gray-500 text-center">No users found</div>
        ) : (
          recentUsers.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <img
                src={user.profileImage || `https://ui-avatars.com/api/?name=${user.firstName}&background=random`}
                alt={user.firstName}
                className="size-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}&background=random`;
                }}
              />
              <div className="flex flex-col">
                <span className="font-medium">
                  {user.firstName} {user.lastName || ''}
                </span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentUser;
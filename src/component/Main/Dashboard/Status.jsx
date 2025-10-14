import { Image } from "antd";
import userIcon from "../../../assets/icone/users.png";
import jobsIcon from "../../../assets/icone/job.png";
import interviewIcon from "../../../assets/icone/schedul.png";
import totalJobsIcon from "../../../assets/icone/Container.png";
import { useGetDashboardDataQuery } from "../../../redux/features/dashboard/dashboardApi";

const Status = () => {
  const { 
    data: dashboardData, 
    isLoading, 
    error,
    isError 
  } = useGetDashboardDataQuery();

  console.log('Dashboard Data:', dashboardData);
  console.log('Error:', error);

  // Safe data extraction with better fallbacks
  const userCount = dashboardData?.userCountCurrent ?? 0;
  const jobsAppliedToday = dashboardData?.appliedJobCountCurrent ?? 0;
  const interviewsScheduled = dashboardData?.interviewScheduledJobsCurrent ?? 0;
  const totalJobs = dashboardData?.jobCountCurrent ?? 0;

  // Get percentage changes from dashboard data with safe checks
  const getPercentageChange = (value) => {
    if (value === undefined || value === null) return "+0%";
    return `${value >= 0 ? '+' : ''}${value}%`;
  };

  const userChange = getPercentageChange(dashboardData?.userCountPercentageChange);
  const jobsChange = getPercentageChange(dashboardData?.appliedJobCountPercentageChange);
  const interviewChange = getPercentageChange(dashboardData?.interviewScheduledJobsPercentageChange);
  const totalJobsChange = getPercentageChange(dashboardData?.jobCountPercentageChange);

  // Check if we have valid data (not just empty object)
  const hasValidData = dashboardData && 
    (userCount > 0 || jobsAppliedToday > 0 || interviewsScheduled > 0 || totalJobs > 0);

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-5 p-5">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm animate-pulse">
            <div className="size-20 rounded-md bg-gray-200"></div>
            <div className="space-y-2 ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error only if we don't have valid data
  if ((isError || error) && !hasValidData) {
    return (
      <div className="w-full p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">
            {error?.data?.message || "Failed to load dashboard data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-5 p-5">
      <div className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm">
        <div className="size-20 p-3 flex justify-center items-center rounded-md bg-blue-100">
          <img src={userIcon} alt="user" className="size-8" />
        </div>
        <div className="space-y-2 ml-4">
          <h1 className="text-gray-600">Total Users</h1>
          <h1 className="text-center text-4xl font-semibold text-gray-900">{userCount}</h1>
          <p className={`text-sm ${(dashboardData?.userCountPercentageChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {userChange} vs previous period
          </p>
        </div>
      </div>
      
      <div className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm">
        <div className="size-20 p-3 flex justify-center items-center rounded-md bg-green-100">
          <img src={jobsIcon} alt="jobs" className="size-8" />
        </div>
        <div className="space-y-2 ml-4">
          <h1 className="text-gray-600">Jobs Applied Today</h1>
          <h1 className="text-center text-4xl font-semibold text-gray-900">{jobsAppliedToday}</h1>
          <p className={`text-sm ${(dashboardData?.appliedJobCountPercentageChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {jobsChange} vs previous period
          </p>
        </div>
      </div>
      
      <div className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm">
        <div className="size-20 p-3 flex justify-center items-center rounded-md bg-purple-100">
          <img src={interviewIcon} alt="interviews" className="size-8" />
        </div>
        <div className="space-y-2 ml-4">
          <h1 className="text-gray-600">Interviews Scheduled</h1>
          <h1 className="text-center text-4xl font-semibold text-gray-900">{interviewsScheduled}</h1>
          <p className={`text-sm ${(dashboardData?.interviewScheduledJobsPercentageChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {interviewChange} vs previous period
          </p>
        </div>
      </div>
      
      <div className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm">
        <div className="size-20 p-3 flex justify-center items-center rounded-md bg-red-100">
          <img src={totalJobsIcon} alt="total jobs" className="size-8" />
        </div>
        <div className="space-y-2 ml-4">
          <h1 className="text-gray-600">Total Jobs</h1>
          <h1 className="text-center text-4xl font-semibold text-gray-900">{totalJobs}</h1>
          <p className={`text-sm ${(dashboardData?.jobCountPercentageChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalJobsChange} vs previous period
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;
// components/Notification/Notification.jsx
import { Image, Pagination } from "antd";
import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import notificationImage from "../../../assets/icone/Enmtynotification.avif";
import { useGetAllNotificationQuery } from "../../../redux/features/notification/notification";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: notificationData, isLoading, error } = useGetAllNotificationQuery();
  
  // Access the correct response structure
  const notifications = notificationData?.data?.attributes?.notifications || [];
  const pagination = notificationData?.data?.attributes?.pagination;
  const filters = notificationData?.data?.attributes?.filters;

  console.log("Notification Data:", notificationData);
  console.log("Notifications:", notifications);

  const pageSize = pagination?.limit || 20;

  // Pagination Logic - use backend pagination instead of frontend slicing
  const onPageChange = (page) => {
    setCurrentPage(page);
    // Note: You might need to implement API pagination by passing page parameter
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AB7843]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl flex items-center mb-4">
        <Link to="/">
          <IoChevronBack className="text-2xl" />{" "}
        </Link>
        Notification
      </h1>

      {/* Filter Chips */}
      {filters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(filters.typeCounts || {}).map((type) => (
            <div
              key={type}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
            >
              {type}: {filters.typeCounts[type].unread}
            </div>
          ))}
          <div className="px-3 py-1 bg-[#AB7843] text-white rounded-full text-sm">
            Total Unread: {filters?.totalUnread || 0}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Check if there are no notifications */}
        {notifications.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Image 
              src={notificationImage} 
              alt="No notifications" 
              preview={false}
              className="max-w-xs"
            />
            <p className="text-gray-500 mt-4">No notifications found</p>
          </div>
        ) : (
          notifications?.map((item) => (
            <div key={item._id} className="border border-[#AB7843] rounded-md p-4">
              <div className="flex items-center space-x-4">
                <div className="text-[#AB7843] border border-[#AB7843] rounded-full p-2 relative">
                  {/* Unread indicator */}
                  {!item.read && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                  <IoMdNotificationsOutline size={30} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-lg">{item.title}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                        item.type === 'applied' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'shortlisted' ? 'bg-green-100 text-green-800' :
                        item.type === 'interview' ? 'bg-orange-100 text-orange-800' :
                        item.type === 'offer' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{item.text}</p>
                  
                  {/* Additional data */}
                  {item.data && Object.keys(item.data).length > 0 && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">Additional Info:</p>
                      <pre className="text-xs">{JSON.stringify(item.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Only show if there are multiple pages */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            total={pagination.total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      )}
    </div>
  );
};

export default Notification;
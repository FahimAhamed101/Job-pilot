import React, { useState } from 'react';
import { Table, Modal, Button, Input, message, Image } from 'antd';
import { 
  useGetAllUsersQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} from '../../redux/features/user/userApi';

const AdminTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // API hooks
  const { 
    data: usersData, 
    isLoading, 
    error,
    refetch 
  } = useGetAllUsersQuery({ 
    page: currentPage, 
    limit: pageSize, 
    role: 'admin',
    search: searchTerm 
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Extract users and pagination info from API response
  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          {record.profileImage ? (
            <Image 
              src={`${process.env.REACT_APP_BASE_URL}${record.profileImage}`}
              alt={text}
              width={40}
              height={40}
              className="rounded-full mr-2 object-cover"
              fallback="/default-avatar.png"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
              <span className="text-gray-600 text-sm">
                {text?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <span>{text || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || 'N/A',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phone',
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span 
          className={`px-2 py-1 rounded-full text-xs ${
            status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status || 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Assign Date',
      dataIndex: 'createdAt',
      key: 'assignDate',
      render: (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (text, record) => (
        <div className="flex space-x-2">
          <Button
            size="small"
            className="bg-blue-100 text-blue-600 border-blue-200"
            onClick={() => showEditModal(record)}
            loading={isUpdating}
          >
            Edit
          </Button>
          <Button
            size="small"
            className="bg-gray-100 text-gray-600 border-gray-200"
            onClick={() => showViewModal(record)}
          >
            View
          </Button>
          <Button
            size="small"
            danger
            onClick={() => showDeleteModal(record)}
            loading={isDeleting}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Modal handlers
  const showViewModal = (record) => {
    setSelectedAdmin(record);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditForm({ 
      ...record,
      firstName: record.firstName || '',
      email: record.email || '',
      phoneNumber: record.phoneNumber || '',
    });
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (record) => {
    setSelectedAdmin(record);
    setIsDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAdmin(null);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditForm(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedAdmin(null);
  };

  // API action handlers
  const handleEditOk = async () => {
    try {
      if (!editForm?._id) {
        message.error('User ID is required');
        return;
      }

      await updateUser({
        id: editForm._id,
        firstName: editForm.firstName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
      }).unwrap();

      message.success('User updated successfully');
      setIsEditModalVisible(false);
      setEditForm(null);
      refetch();
    } catch (error) {
      console.error('Failed to update user:', error);
      message.error('Failed to update user');
    }
  };

  const handleDeleteOk = async () => {
    try {
      if (!selectedAdmin?._id) {
        message.error('User ID is required');
        return;
      }

      await deleteUser(selectedAdmin._id).unwrap();
      
      message.success('User deleted successfully');
      setIsDeleteModalVisible(false);
      setSelectedAdmin(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('Failed to delete user');
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">
          Error loading users: {error?.data?.message || 'Something went wrong'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin</h2>
        <Input.Search
          placeholder="Search admins..."
          style={{ width: 300 }}
          onSearch={handleSearch}
          onChange={(e) => !e.target.value && setSearchTerm('')}
          allowClear
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalUsers,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            itemRender: (current, type, originalElement) => {
              if (type === 'prev') {
                return <Button className="border rounded">&lt;</Button>;
              }
              if (type === 'next') {
                return <Button className="border rounded">&gt;</Button>;
              }
              return originalElement;
            },
            showTotal: (total, range) => (
              <div className="text-gray-600">
                Total Admins: {total} & Pages: {currentPage}/{Math.ceil(total / pageSize)}
              </div>
            ),
          }}
          components={{
            header: {
              cell: ({ children, ...rest }) => (
                <th {...rest} style={{ backgroundColor: '#E6E6E7' }}>
                  {children}
                </th>
              ),
            },
          }}
        />
      </div>

      {/* View Modal */}
      <Modal
        title="Admin Profile"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>
        ]}
        className="custom-modal"
        width={400}
      >
        {selectedAdmin && (
          <div className="p-4">
            <div className="flex justify-center mb-4">
              {selectedAdmin.profileImage ? (
                <Image
                  src={`${process.env.REACT_APP_BASE_URL}${selectedAdmin.profileImage}`}
                  alt={selectedAdmin.firstName}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  fallback="/default-avatar.png"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    {selectedAdmin.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2 text-center">
              <p><strong>Name:</strong> {selectedAdmin.firstName || 'N/A'}</p>
              <p><strong>ID:</strong> {selectedAdmin.userId || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedAdmin.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedAdmin.phoneNumber || 'N/A'}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-1 ${selectedAdmin.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedAdmin.status || 'Inactive'}
                </span>
              </p>
              <p><strong>Joined:</strong> {new Date(selectedAdmin.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Admin"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save"
        confirmLoading={isUpdating}
        className="custom-modal"
        width={400}
      >
        {editForm && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Input
                value={editForm.firstName}
                onChange={(e) => handleEditChange('firstName', e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                value={editForm.email}
                onChange={(e) => handleEditChange('email', e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <Input
                value={editForm.phoneNumber}
                onChange={(e) => handleEditChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete Admin"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Delete"
        confirmLoading={isDeleting}
        okButtonProps={{ danger: true }}
        className="custom-delete-modal"
      >
        <div className="flex items-start">
          <span className="text-red-500 mr-3 text-xl">🗑️</span>
          <div>
            <h3 className="font-semibold mb-2">Delete this admin</h3>
            <p>Are you sure you want to delete {selectedAdmin?.firstName}? This action cannot be undone.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTable;
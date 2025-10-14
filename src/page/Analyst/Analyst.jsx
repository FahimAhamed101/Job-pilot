import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Input, Select, Tag, message, Spin } from 'antd';
import { useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '../../redux/features/user/userApi';
import config from '../../config';
const { Option } = Select;

const AdminTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('analyst');
  
  // RTK Query hooks
  const { 
    data: usersData, 
    isLoading, 
    error,
    refetch 
  } = useGetAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    role: roleFilter,
    search: searchTerm
  });

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Extract users and pagination info from API response
  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;

  const columns = [
    {
      title: 'User ID',
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
            <img 
              src={`${config.API_URL}${record.profileImage}`}
              alt={text} 
              className="w-10 h-10 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
              <span className="text-gray-600 text-sm">
                {text?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => (
        <Tag 
          color={
            role === 'admin' ? 'red' : 
            role === 'analyst' ? 'blue' : 
            role === 'user' ? 'green' : 'default'
          }
        >
          {role?.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'ADMIN', value: 'admin' },
        { text: 'ANALYST', value: 'analyst' },
        { text: 'USER', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => (
        <Tag color={record.isBlocked ? 'red' : status === 'Active' ? 'green' : 'orange'}>
          {record.isBlocked ? 'BLOCKED' : status || 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Join Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
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
            className="bg-red-100 text-red-600 border-red-200"
            onClick={() => showDeleteModal(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const showViewModal = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditForm({ 
      ...record,
      // Ensure we have all required fields for the form
      firstName: record.firstName || '',
      lastName: record.lastName || '',
      email: record.email || '',
      phoneNumber: record.phoneNumber || '',
      role: record.role || 'user',
      Designation: record.Designation || '',
      address: record.address || '',
    });
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (record) => {
    setSelectedUser(record);
    setIsDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditForm(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedUser(null);
  };

  const handleDeleteOk = async () => {
    try {
      await deleteUser(selectedUser._id).unwrap();
      message.success('User deleted successfully');
      setIsDeleteModalVisible(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      message.error('Failed to delete user');
      console.error('Delete error:', error);
    }
  };

  const handleEditOk = async () => {
    try {
      const { id, _id, ...updateData } = editForm;
      const userId = _id || id;
      
      await updateUser({
        id: userId,
        ...updateData
      }).unwrap();
      
      message.success('User updated successfully');
      setIsEditModalVisible(false);
      setEditForm(null);
      refetch();
    } catch (error) {
      message.error('Failed to update user');
      console.error('Update error:', error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  // Show error message if API call fails
  useEffect(() => {
    if (error) {
      message.error('Failed to load users');
      console.error('API Error:', error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Input.Search
            placeholder="Search by name or email"
            onSearch={handleSearch}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by role"
            style={{ width: 150 }}
            onChange={handleRoleFilter}
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="analyst">Analyst</Option>
            <Option value="user">User</Option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
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
            onShowSizeChange: handlePageChange,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => (
              <div className="text-gray-600">
                Showing {range[0]}-{range[1]} of {total} users
              </div>
            ),
          }}
          components={{
            header: {
              cell: ({ children, ...rest }) => (
                <th {...rest} style={{ backgroundColor: '#F8FAFC', fontWeight: 600 }}>
                  {children}
                </th>
              ),
            },
          }}
        />
      </div>

      {/* View Modal */}
      <Modal
        title="User Profile"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>
        ]}
        width={400}
      >
        {selectedUser && (
          <div className="p-4">
            <div className="flex justify-center mb-4">
              {selectedUser.profileImage ? (
                <img 
                  src={`${process.env.REACT_APP_API_URL}${selectedUser.profileImage}`}
                  alt={selectedUser.firstName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    {selectedUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>User ID:</strong> {selectedUser.userId}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
              <p><strong>Role:</strong> 
                <Tag className="ml-2" color={
                  selectedUser.role === 'admin' ? 'red' : 
                  selectedUser.role === 'analyst' ? 'blue' : 'green'
                }>
                  {selectedUser.role?.toUpperCase()}
                </Tag>
              </p>
              <p><strong>Designation:</strong> {selectedUser.Designation || 'N/A'}</p>
              <p><strong>Status:</strong> 
                <Tag className="ml-2" color={selectedUser.isBlocked ? 'red' : 'green'}>
                  {selectedUser.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                </Tag>
              </p>
              <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
              <p><strong>Join Date:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save Changes"
        width={500}
      >
        {editForm && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">First Name</label>
              <Input
                value={editForm.firstName}
                onChange={(e) => handleEditChange('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <Input
                value={editForm.lastName}
                onChange={(e) => handleEditChange('lastName', e.target.value)}
                placeholder="Enter last name"
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
            
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <Select
                value={editForm.role}
                onChange={(value) => handleEditChange('role', value)}
                style={{ width: '100%' }}
              >
                <Option value="user">User</Option>
                <Option value="analyst">Analyst</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Designation</label>
              <Input
                value={editForm.Designation}
                onChange={(e) => handleEditChange('Designation', e.target.value)}
                placeholder="Enter designation"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <Input.TextArea
                value={editForm.address}
                onChange={(e) => handleEditChange('address', e.target.value)}
                placeholder="Enter address"
                rows={3}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete User"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <div className="flex items-center p-4">
          <span className="text-red-500 text-2xl mr-3">🗑️</span>
          <div>
            <h3 className="font-semibold">Delete this user</h3>
            <p className="text-gray-600">
              Are you sure you want to delete {selectedUser?.firstName}? This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTable;
import React, { useState, useEffect } from 'react';
import { Table, Button, Dropdown, Menu, Modal, Input, Upload, message, Tag, Space } from 'antd';
import { DownOutlined, UserOutlined, UploadOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  useGetAllUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useToggleBlockUserMutation 
} from '../../../redux/features/user/userApi';

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // API calls
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

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleBlockUser] = useToggleBlockUserMutation();

  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    ConfirmPassword: '',
    role: 'user',
    Designation: '',
    address: '',
    profileImage: null,
    profileImagePreview: null, // Add preview URL
    CV: null,
  });

  const [editUser, setEditUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    Designation: '',
    address: '',
    profileImage: null,
    profileImagePreview: null, // Add preview URL
    CV: null,
  });

  // Extract users and pagination info
  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;

  // Transform API data to table format
  const transformUserData = (users) => {
    if (!Array.isArray(users)) {
      console.error('Expected users to be an array, got:', users);
      return [];
    }

    return users.map(user => ({
      key: user._id || user.id,
      id: user.userId || user._id || user.id,
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || 'N/A',
      JoiningDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'N/A',
      status: user.isBlocked ? 'Blocked' : 
              user.isSubscription ? 'Active Premium' : 'Active Free',
      address: user.address || 'N/A',
      phone: user.phoneNumber || 'N/A',
      resume: user.CV,
      avatar: user.profileImage || '/user.jpg',
      role: user.role || 'user',
      designation: user.Designation || 'N/A',
      originalData: user
    }));
  };

  const dataSource = transformUserData(users);

  // Handle Add New User
  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddOk = async () => {
    try {
      // Validate required fields
      if (!newUser.firstName || !newUser.email || !newUser.phoneNumber || !newUser.password) {
        message.error('Please fill all required fields');
        return;
      }

      // Validate password match
      if (newUser.password !== newUser.ConfirmPassword) {
        message.error('Passwords do not match');
        return;
      }

      // Prepare data for API
      const userData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        password: newUser.password,
        ConfirmPassword: newUser.ConfirmPassword,
        role: newUser.role,
        Designation: newUser.Designation,
        address: newUser.address,
        profileImage: newUser.profileImage,
        CV: newUser.CV,
      };

      await createUser(userData).unwrap();
      message.success('User created successfully!');
      setIsAddModalVisible(false);
      
      // Reset form
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        ConfirmPassword: '',
        role: 'user',
        Designation: '',
        address: '',
        profileImage: null,
        profileImagePreview: null,
        CV: null,
      });
    } catch (error) {
      console.error('Create user error:', error);
      message.error('Failed to create user: ' + (error.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    // Reset form on cancel
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      ConfirmPassword: '',
      role: 'user',
      Designation: '',
      address: '',
      profileImage: null,
      profileImagePreview: null,
      CV: null,
    });
  };

  // Handle Edit User
  const showEditModal = (user) => {
    setEditUser({
      firstName: user.originalData.firstName,
      lastName: user.originalData.lastName || '',
      email: user.originalData.email,
      phoneNumber: user.originalData.phoneNumber,
      Designation: user.originalData.Designation || '',
      address: user.originalData.address || '',
      profileImage: user.originalData.profileImage,
      profileImagePreview: user.originalData.profileImage, // Set preview from existing image
      CV: user.originalData.CV,
    });
    setSelectedUser(user);
    setIsEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      // Validate required fields
      if (!editUser.firstName || !editUser.email || !editUser.phoneNumber) {
        message.error('Please fill all required fields');
        return;
      }

      const userData = {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        phoneNumber: editUser.phoneNumber,
        Designation: editUser.Designation,
        address: editUser.address,
        profileImage: editUser.profileImage,
        CV: editUser.CV,
      };

      await updateUser({
        id: selectedUser.originalData._id,
        ...userData
      }).unwrap();
      message.success('User updated successfully!');
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Update user error:', error);
      message.error('Failed to update user: ' + (error.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Handle View User
  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  // Handle Delete User
  const showDeleteConfirm = (user) => {
    setSelectedUser(user);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      await deleteUser(selectedUser.originalData._id).unwrap();
      message.success('User deleted successfully!');
      setIsDeleteModalVisible(false);
    } catch (error) {
      message.error('Failed to delete user: ' + (error.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  // Handle Block/Unblock User
  const handleToggleBlock = async (user) => {
    try {
      await toggleBlockUser({
        id: user.originalData._id,
        isBlocked: !user.originalData.isBlocked
      }).unwrap();
      message.success(`User ${user.originalData.isBlocked ? 'unblocked' : 'blocked'} successfully!`);
    } catch (error) {
      message.error('Failed to update user status: ' + (error.data?.message || 'Unknown error'));
    }
  };

  // Handle input changes
  const handleInputChange = (e, modalType) => {
    const { name, value } = e.target;
    if (modalType === 'edit') {
      setEditUser(prev => ({ ...prev, [name]: value }));
    } else {
      setNewUser(prev => ({ ...prev, [name]: value }));
    }
  };

  // Fixed file upload handlers with preview
  const handleProfileUpload = (file, modalType) => {
    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    // Validate file size (2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    if (modalType === 'edit') {
      setEditUser(prev => ({ 
        ...prev, 
        profileImage: file,
        profileImagePreview: previewUrl 
      }));
    } else {
      setNewUser(prev => ({ 
        ...prev, 
        profileImage: file,
        profileImagePreview: previewUrl 
      }));
    }

    return false; // Prevent automatic upload
  };

  const handleCvUpload = (file, modalType) => {
    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes('.' + fileExtension)) {
      message.error('You can only upload PDF, DOC, or DOCX files!');
      return false;
    }

    // Validate file size (5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must be smaller than 5MB!');
      return false;
    }

    if (modalType === 'edit') {
      setEditUser(prev => ({ ...prev, CV: file }));
    } else {
      setNewUser(prev => ({ ...prev, CV: file }));
    }

    message.success(`${file.name} file selected successfully`);
    return false; // Prevent automatic upload
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (newUser.profileImagePreview) {
        URL.revokeObjectURL(newUser.profileImagePreview);
      }
      if (editUser.profileImagePreview) {
        URL.revokeObjectURL(editUser.profileImagePreview);
      }
    };
  }, [newUser.profileImagePreview, editUser.profileImagePreview]);

  // Define columns (same as before)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <img 
            src={record.avatar} 
            alt={text} 
            className="w-10 h-10 rounded-full mr-2 object-cover"
            onError={(e) => {
              e.target.src = '/user.jpg';
            }}
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.designation || 'N/A'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'super_admin' ? 'purple' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Joining Date',
      dataIndex: 'JoiningDate',
      key: 'JoiningDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        let colorClass = '';
        switch (text) {
          case 'Active Free':
            colorClass = 'bg-purple-200 text-purple-800';
            break;
          case 'Active Premium':
            colorClass = 'bg-orange-200 text-orange-800';
            break;
          case 'Blocked':
            colorClass = 'bg-pink-200 text-pink-800';
            break;
          default:
            colorClass = 'bg-gray-300 text-gray-800';
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {text}
          </span>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            className="text-blue-500"
            title="View"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="text-green-500"
            title="Edit"
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            className="text-red-500"
            title="Delete"
          />
          <Button
            type="link"
            onClick={() => handleToggleBlock(record)}
            className={record.originalData.isBlocked ? 'text-green-500' : 'text-orange-500'}
            title={record.originalData.isBlocked ? 'Unblock' : 'Block'}
          >
            {record.originalData.isBlocked ? '🔓' : '🔒'}
          </Button>
        </Space>
      ),
    },
  ];

  // Status filter menu
  const statusMenu = (
    <Menu onClick={({ key }) => setStatusFilter(key)}>
      <Menu.Item key="">All Status</Menu.Item>
      <Menu.Item key="active">Active</Menu.Item>
      <Menu.Item key="blocked">Blocked</Menu.Item>
      <Menu.Item key="premium">Premium</Menu.Item>
    </Menu>
  );

  // Role filter menu
  const roleMenu = (
    <Menu onClick={({ key }) => setRoleFilter(key)}>
      <Menu.Item key="">All Roles</Menu.Item>
      <Menu.Item key="user">User</Menu.Item>
      <Menu.Item key="admin">Admin</Menu.Item>
      <Menu.Item key="super_admin">Super Admin</Menu.Item>
    </Menu>
  );

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">
          Error loading users: {error.data?.message || 'Unknown error'}
          <Button onClick={refetch} className="ml-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-gray-600">Manage your users and their permissions</p>
        </div>
        <div className="flex gap-3">
          <Input.Search
            placeholder="Search users..."
            onSearch={handleSearch}
            style={{ width: 250 }}
            allowClear
          />
          <Dropdown overlay={roleMenu} trigger={['click']}>
            <Button className="flex items-center">
              Role <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown overlay={statusMenu} trigger={['click']}>
            <Button className="flex items-center">
              Status <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            type="primary"
            icon={<span className="text-white">+</span>}
            className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white rounded flex items-center"
            onClick={showAddModal}
            loading={isCreating}
          >
            Add New User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalUsers,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} users`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          scroll={{ x: 800 }}
        />
      </div>

      {/* Add New User Modal */}
      <Modal
        title="Add New User"
        open={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        confirmLoading={isCreating}
        width={600}
      >
        <div className="space-y-4 p-4">
          <Upload
            name="profileImage"
            beforeUpload={(file) => handleProfileUpload(file, 'add')}
            showUploadList={false}
            accept="image/*"
          >
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 cursor-pointer">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {newUser.profileImagePreview ? (
                  <img 
                    src={newUser.profileImagePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserOutlined className="text-gray-400 text-2xl" />
                )}
              </div>
              <div>
                <p className="text-green-600 text-sm font-medium">Click to upload profile picture</p>
                <p className="text-gray-500 text-xs">PNG, JPG, JPEG (max. 2MB)</p>
                {newUser.profileImage && (
                  <p className="text-green-500 text-xs">✓ {newUser.profileImage.name}</p>
                )}
              </div>
            </div>
          </Upload>

          {/* Rest of the form remains the same */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <Input
                name="firstName"
                value={newUser.firstName}
                onChange={(e) => handleInputChange(e, 'add')}
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input
                name="lastName"
                value={newUser.lastName}
                onChange={(e) => handleInputChange(e, 'add')}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                name="email"
                type="email"
                value={newUser.email}
                onChange={(e) => handleInputChange(e, 'add')}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <Input
                name="phoneNumber"
                value={newUser.phoneNumber}
                onChange={(e) => handleInputChange(e, 'add')}
                placeholder="+1-234-567-8900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <Input
                name="Designation"
                value={newUser.Designation}
                onChange={(e) => handleInputChange(e, 'add')}
                placeholder="Software Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input.TextArea
              name="address"
              value={newUser.address}
              onChange={(e) => handleInputChange(e, 'add')}
              placeholder="Full address"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <Input.Password
              name="password"
              value={newUser.password}
              onChange={(e) => handleInputChange(e, 'add')}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <Input.Password
              name="ConfirmPassword"
              value={newUser.ConfirmPassword}
              onChange={(e) => handleInputChange(e, 'add')}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CV/Resume</label>
            <Upload
              name="CV"
              beforeUpload={(file) => handleCvUpload(file, 'add')}
              showUploadList={false}
              accept=".pdf,.doc,.docx"
            >
              <Button icon={<UploadOutlined />}>
                {newUser.CV ? `✓ ${newUser.CV.name}` : 'Upload CV (PDF/DOC)'}
              </Button>
            </Upload>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        confirmLoading={isUpdating}
        width={600}
      >
        <div className="space-y-4 p-4">
          <Upload
            name="profileImage"
            beforeUpload={(file) => handleProfileUpload(file, 'edit')}
            showUploadList={false}
            accept="image/*"
          >
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 cursor-pointer">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {editUser.profileImagePreview ? (
                  <img 
                    src={editUser.profileImagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : editUser.profileImage ? (
                  <img 
                    src={editUser.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserOutlined className="text-gray-400 text-2xl" />
                )}
              </div>
              <div>
                <p className="text-green-600 text-sm font-medium">Click to upload profile picture</p>
                <p className="text-gray-500 text-xs">PNG, JPG, JPEG (max. 2MB)</p>
                {editUser.profileImage instanceof File && (
                  <p className="text-green-500 text-xs">✓ {editUser.profileImage.name}</p>
                )}
              </div>
            </div>
          </Upload>

          {/* Rest of the edit form remains the same */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <Input
                name="firstName"
                value={editUser.firstName}
                onChange={(e) => handleInputChange(e, 'edit')}
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input
                name="lastName"
                value={editUser.lastName}
                onChange={(e) => handleInputChange(e, 'edit')}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                name="email"
                type="email"
                value={editUser.email}
                onChange={(e) => handleInputChange(e, 'edit')}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <Input
                name="phoneNumber"
                value={editUser.phoneNumber}
                onChange={(e) => handleInputChange(e, 'edit')}
                placeholder="+1-234-567-8900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <Input
              name="Designation"
              value={editUser.Designation}
              onChange={(e) => handleInputChange(e, 'edit')}
              placeholder="Software Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input.TextArea
              name="address"
              value={editUser.address}
              onChange={(e) => handleInputChange(e, 'edit')}
              placeholder="Full address"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CV/Resume</label>
            <Upload
              name="CV"
              beforeUpload={(file) => handleCvUpload(file, 'edit')}
              showUploadList={false}
              accept=".pdf,.doc,.docx"
            >
              <Button icon={<UploadOutlined />}>
                {editUser.CV ? (editUser.CV instanceof File ? `✓ ${editUser.CV.name}` : 'Change CV') : 'Upload CV (PDF/DOC)'}
              </Button>
            </Upload>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete User"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okType="danger"
      >
        <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?</p>
        <p className="text-red-500 text-sm mt-2">This action cannot be undone.</p>
      </Modal>

      {/* View User Modal */}
      <Modal
        title="User Details"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>
        ]}
        width={400}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                onError={(e) => {
                  e.target.src = '/user.jpg';
                }}
              />
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              <p className="text-gray-600">{selectedUser.designation || 'No designation'}</p>
              <Tag color={selectedUser.role === 'admin' ? 'red' : 'blue'} className="mt-1">
                {selectedUser.role.toUpperCase()}
              </Tag>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{selectedUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span>{selectedUser.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Joined:</span>
                <span>{selectedUser.JoiningDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span>{selectedUser.status}</span>
              </div>
            </div>

            {selectedUser.resume && (
              <div className="text-center">
                <Button 
                  type="link" 
                  onClick={() => window.open(selectedUser.resume, '_blank')}
                  className="text-green-600"
                >
                  View Resume/CV
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
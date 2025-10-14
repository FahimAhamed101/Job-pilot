import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Modal, Input, Upload } from 'antd';
import { DownOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';

const dataSource = [
  {
    key: '1',
    id: '19220',
    jobtitle: "Software engineer",
    name: 'Eleanor Pena',
    email: 'kenzi.lawson@example.com',
    appliedOn: 'Jul 23, 2025',
    appliedBy: 'Jane(19202)',
    status: 'Active Free',
    address: 'Newark, USA',
    phone: '(316)555-0116',
    resume: 'resume.pdf',
  },
  {
    key: '2',
    id: '19221',
    jobtitle: "Sells marketing",
    name: 'Kathryn Murphy',
    email: 'tanya.hill@example.com',
    appliedOn: 'Aug 15, 2025',
    appliedBy: 'Jane(19202)',
    status: 'Active Premium',
    address: 'Austin, USA',
    phone: '(512)555-0123',
    resume: 'resume.pdf',
  },
  {
    key: '3',
    id: '19222',
    jobtitle: "Seo",
    name: 'Leslie Alexander',
    email: 'curtis.weaver@example.com',
    appliedOn: 'Sep 01, 2025',
    appliedBy: 'Jane(19202)',
    status: 'Blocked',
    address: 'Boston, USA',
    phone: '(617)555-0198',
    resume: 'resume.pdf',
  },
  {
    key: '4',
    id: '19223',
    jobtitle: "UI/UX design",
    name: 'Bessie Cooper',
    email: 'dolores.rgbq@example.com',
    appliedOn: 'Sep 09, 2025',
    appliedBy: 'Jane(19202)',
    status: 'Deactive',
    address: 'Seattle, USA',
    phone: '(206)555-0147',
    resume: 'resume.pdf',
  },
];

const Job = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    designation: '',
    username: '',
    email: '',
    mobile: '',
    address: '',
    status: 'Active Free',
    cv: null,
    profile: null,
  });

  // Handle Add New User Modal
  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddOk = () => {
    // Add logic to save new user to dataSource
    console.log('New user added:', newUser);
    setIsAddModalVisible(false);
    setNewUser({
      name: '',
      designation: '',
      username: '',
      email: '',
      mobile: '',
      address: '',
      status: 'Active Free',
      cv: null,
      profile: null,
    });
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  // Handle View Modal
  const handleView = (user) => {
    console.log('Viewing user:', user);
    setSelectedUser(user);
    setIsViewModalVisible(true);
  };

  const handleViewOk = () => {
    setIsViewModalVisible(false);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  // Handle Delete Confirmation
  const showDeleteConfirm = (user) => {
    console.log('Deleting user:', user);
    setSelectedUser(user);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = () => {
    // Add logic to delete user from dataSource
    console.log('User deleted:', selectedUser);
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleProfileUpload = (file) => {
    setNewUser({ ...newUser, profile: file });
    return false; // Prevent automatic upload
  };

  const handleCvUpload = (file) => {
    setNewUser({ ...newUser, cv: file });
    return false; // Prevent automatic upload
  };

  // Define columns inside the component
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'JobTitle',
      dataIndex: 'jobtitle',
      key: 'jobtitle',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Applied on',
      dataIndex: 'appliedOn',
      key: 'appliedOn',
    },
    {
      title: 'Applied by',
      dataIndex: 'appliedBy',
      key: 'appliedBy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
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
          case 'Deactive':
            colorClass = 'bg-gray-300 text-gray-800';
            break;
          default:
            colorClass = 'bg-gray-100';
        }
        return <span className={`px-2 py-1 rounded ${colorClass}`}>{text}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          <Button className="text-blue-500 hover:text-blue-700 border py-1 px-3">Edit</Button>
          <Button
            className="text-green-500 hover:text-green-700 border border-green-500 py-1 px-3"
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            className="text-red-500 hover:text-red-700 border border-red-500 py-1 px-3"
            onClick={() => showDeleteConfirm(record)}
          >
            Delete job
          </Button>
        </div>
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">Free</Menu.Item>
      <Menu.Item key="2">Premium</Menu.Item>
      <Menu.Item key="3">Active Free</Menu.Item>
      <Menu.Item key="4">Active Premium</Menu.Item>
      <Menu.Item key="5">Active Free</Menu.Item>
      <Menu.Item key="6">Deactive Free</Menu.Item>
      <Menu.Item key="7">Deactive Premium</Menu.Item>
    </Menu>
  );



  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Jobs</h2>
        </div>
        <div className="flex gap-5">
          <Button
            type="primary"
            icon={<span className="text-white">+</span>}
            className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white rounded flex items-center"
            onClick={showAddModal}
          >
            Add New job
          </Button>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button className="bg-gray-200 hover:bg-gray-300 rounded flex items-center">
              Status <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          className="bg-white shadow-md rounded-lg w-full"
          pagination={false}
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

      {/* Add New User Modal */}
      <Modal
        title="Add new user"
        visible={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        footer={[
          <Button key="cancel" onClick={handleAddCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: '#00FF00', borderColor: '#00FF00' }}
            onClick={handleAddOk}
          >
            Submit
          </Button>,
        ]}
        className="w-96"
      >
        <div className="p-4">
          <Upload
            name="profile"
            beforeUpload={handleProfileUpload}
            showUploadList={false}
            accept="image/png,image/jpeg"
          >
            <div className="flex items-center space-x-4 mb-4 cursor-pointer">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {newUser.profile ? (
                  <img
                    src={URL.createObjectURL(newUser.profile)}
                    alt="profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">👤</span>
                )}
              </div>
              <div className="text-green-500">
                Click to upload or drag and drop PNG or JPG (max: 800x800px)
              </div>
            </div>
          </Upload>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name*</label>
            <Input
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Designation*</label>
            <Input
              name="designation"
              placeholder="Designation"
              value={newUser.designation}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <Input
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mobile*</label>
            <Input
              name="mobile"
              placeholder="Mobile"
              value={newUser.mobile}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address*</label>
            <Input
              name="address"
              placeholder="Address"
              value={newUser.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status*</label>
            <Input
              name="status"
              placeholder="Status"
              value={newUser.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <Upload
            name="cv"
            beforeUpload={handleCvUpload}
            showUploadList={false}
            accept="application/pdf"
          >
            <div className="mt-4 flex items-center space-x-4 mb-4 cursor-pointer">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {newUser.cv ? (
                  <span className="text-gray-400">✅</span>
                ) : (
                  <span className="text-gray-400">📄</span>
                )}
              </div>
              <div className="text-green-500">
                {newUser.cv ? newUser.cv.name : 'Click to upload or drag and drop PDF (max: 2MB)'}
              </div>
            </div>
          </Upload>
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete this user"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        footer={[
          <Button key="cancel" onClick={handleDeleteCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" style={{ backgroundColor: '#FF0000', borderColor: '#FF0000' }} onClick={handleDeleteOk}>
            Delete
          </Button>,
        ]}
      >
        Are you sure you want to delete this user? This action cannot be undone.
      </Modal>

      {/* View User Modal */}
      <Modal
        title="User profile"
        visible={isViewModalVisible}
        onOk={handleViewOk}
        onCancel={handleViewCancel}
        footer={[
          <Button
            key="view"
            type="primary"
            style={{ backgroundColor: '#00FF00', borderColor: '#00FF00' }}
            onClick={handleViewOk}
          >
            View
          </Button>,
        ]}
        className="w-72"
      >
        <div className="p-4">
          <div className="mt-4 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-2">
              <UserOutlined className="text-gray-500 text-2xl" />
            </div>
            <h3 className="text-md font-medium">{selectedUser?.name} ({selectedUser?.id})</h3>
            <p className="text-sm text-gray-600">{selectedUser?.designation || 'Software Engineer'}</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">📧</span>
              <span className="text-sm">Email</span>
              <span className="text-sm text-gray-700 ml-auto">{selectedUser?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">📍</span>
              <span className="text-sm">Address</span>
              <span className="text-sm text-gray-700 ml-auto">{selectedUser?.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">📞</span>
              <span className="text-sm">Phone</span>
              <span className="text-sm text-gray-700 ml-auto">{selectedUser?.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">📄</span>
              <span className="text-sm">Resume</span>
              <Button
                type="link"
                onClick={() => console.log('View resume')}
                className="ml-auto text-green-500"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Job;
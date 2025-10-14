import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Select, message, Tag, Space, Card, DatePicker } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { 
  useGetAllAppliedJobsQuery,
  useApplyForJobMutation,
  useUpdateAppliedJobMutation,
  useDeleteAppliedJobMutation,
  useUpdateApplicationStatusMutation
} from '../../redux/features/applied/appliedApi';
import dayjs from 'dayjs';

const { Option } = Select;

const Applied = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Get user from localStorage
  const getUserFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  };

  const currentUser = getUserFromLocalStorage();

  // API calls
  const { 
    data: jobsData, 
    isLoading, 
    error,
    refetch 
  } = useGetAllAppliedJobsQuery({ 
    page: currentPage, 
    limit: pageSize,
    status: statusFilter,
    search: searchTerm 
  });

  const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation();
  const [updateAppliedJob, { isLoading: isUpdating }] = useUpdateAppliedJobMutation();
  const [deleteAppliedJob] = useDeleteAppliedJobMutation();
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [newJob, setNewJob] = useState({
    companyName: '',
    jobTitle: '',
    jdLink: '',
    status: 'Applied',
    appliedDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    userId: currentUser?.id || ''
  });

  const [editJob, setEditJob] = useState({
    companyName: '',
    jobTitle: '',
    jdLink: '',
    status: '',
    appliedDate: '',
  });

  // Extract jobs and pagination info
  const jobs = jobsData?.jobs || [];
  const totalJobs = jobsData?.total || 0;

  // Transform API data to table format
  const transformJobData = (jobs) => {
    return jobs.map(job => ({
      key: job._id,
      id: job._id,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      status: job.status,
      appliedDate: new Date(job.appliedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      originalAppliedDate: job.appliedDate,
      jdLink: job.jdLink,
      userId: job.userId,
      adminId: job.adminId,
      originalData: job
    }));
  };

  const dataSource = transformJobData(jobs);

  // Handle Add New Job Application
  const showAddModal = () => {
    setNewJob({
      companyName: '',
      jobTitle: '',
      jdLink: '',
      status: 'Applied',
      appliedDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      userId: currentUser?.id || ''
    });
    setIsAddModalVisible(true);
  };

  const handleAddOk = async () => {
    // Validate required fields
    if (!newJob.companyName || !newJob.jobTitle || !newJob.jdLink) {
      message.error('Please fill in all required fields');
      return;
    }

    if (!newJob.userId) {
      message.error('User ID is required. Please make sure you are logged in.');
      return;
    }

    const payload = {
      ...newJob,
      appliedDate: newJob.appliedDate || new Date().toISOString()
    };

    try {
      await applyForJob(payload).unwrap();
      message.success('Job application submitted successfully!');
      setIsAddModalVisible(false);
      setNewJob({
        companyName: '',
        jobTitle: '',
        jdLink: '',
        status: 'Applied',
        appliedDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        userId: currentUser?.id || ''
      });
      refetch();
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('Failed to submit application: ' + (error.data?.message || 'Unknown error'));
    }
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  // Handle Edit Job Application
  const showEditModal = (job) => {
    setEditJob({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      jdLink: job.jdLink,
      status: job.status,
      appliedDate: job.originalAppliedDate,
    });
    setSelectedJob(job);
    setIsEditModalVisible(true);
  };

  const handleEditOk = async () => {
    if (!editJob.companyName || !editJob.jobTitle || !editJob.jdLink) {
      message.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...editJob,
        appliedDate: editJob.appliedDate || selectedJob.originalAppliedDate
      };

      await updateAppliedJob({
        id: selectedJob.originalData._id,
        ...payload
      }).unwrap();
      message.success('Job application updated successfully!');
      setIsEditModalVisible(false);
      refetch();
    } catch (error) {
      console.error('Error updating application:', error);
      message.error('Failed to update application: ' + (error.data?.message || 'Unknown error'));
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Handle View Job Application
  const handleView = (job) => {
    setSelectedJob(job);
    setIsViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  // Handle Delete Job Application
  const showDeleteConfirm = (job) => {
    setSelectedJob(job);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      await deleteAppliedJob(selectedJob.originalData._id).unwrap();
      message.success('Job application deleted successfully!');
      setIsDeleteModalVisible(false);
      refetch();
    } catch (error) {
      message.error('Failed to delete application: ' + (error.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  // Handle Status Change
  const handleStatusChange = async (job, newStatus) => {
    try {
      await updateApplicationStatus({
        id: job.originalData._id,
        status: newStatus
      }).unwrap();
      message.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      message.error('Failed to update status: ' + (error.data?.message || 'Unknown error'));
    }
  };

  // Handle input changes
  const handleInputChange = (e, modalType) => {
    const { name, value } = e.target;
    if (modalType === 'edit') {
      setEditJob(prev => ({ ...prev, [name]: value }));
    } else {
      setNewJob(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle date changes
  const handleDateChange = (date, modalType) => {
    const dateString = date ? date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : new Date().toISOString();
    if (modalType === 'edit') {
      setEditJob(prev => ({ ...prev, appliedDate: dateString }));
    } else {
      setNewJob(prev => ({ ...prev, appliedDate: dateString }));
    }
  };

  // Handle select changes
  const handleSelectChange = (value, field, modalType) => {
    if (modalType === 'edit') {
      setEditJob(prev => ({ ...prev, [field]: value }));
    } else {
      setNewJob(prev => ({ ...prev, [field]: value }));
    }
  };

  // Define columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <span className="text-gray-600">#{id.slice(-6)}</span>,
    },
    {
      title: 'Job Link',
      dataIndex: 'jdLink',
      key: 'jobLink',
      render: (link) => (
        <Button
          type="link"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          icon={<LinkOutlined />}
          className="p-0"
        >
          View JD
        </Button>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (company) => (
        <div className="font-medium">{company}</div>
      ),
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusColors = {
          'Applied': 'blue',
          'Shortlisted': 'green',
          'Interview': 'orange',
          'Rejected': 'red',
          'Offer': 'purple',
        };
        
        return (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(record, value)}
            style={{ width: 120 }}
            size="small"
          >
            <Option value="Applied">Applied</Option>
            <Option value="Shortlisted">Shortlisted</Option>
            <Option value="Interview">Interview</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Offer">Offer</Option>
          </Select>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            className="text-blue-500"
            title="View Details"
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
        </Space>
      ),
    },
  ];

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Shortlisted', label: 'Shortlisted' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Offer', label: 'Offer' },
  ];

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <div className="text-red-500 text-center">
            <div className="text-lg font-semibold mb-2">
              Error loading job applications
            </div>
            <div className="mb-4">{error.data?.message || 'Unknown error'}</div>
            <Button onClick={refetch} type="primary">Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
            <p className="text-gray-600">Manage and track all job applications</p>
          </div>
          <Button
            type="primary"
            icon={<span className="text-white">+</span>}
            className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white rounded-lg flex items-center shadow-sm"
            onClick={showAddModal}
            loading={isApplying}
            size="large"
          >
            Add New Application
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Input.Search
            placeholder="Search by company or job title..."
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
            enterButton
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
            allowClear
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <Card className="shadow-sm">
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalJobs,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} applications`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add New Application Modal */}
      <Modal
        title="Add New Job Application"
        open={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        confirmLoading={isApplying}
        width={500}
        okText="Submit Application"
        cancelText="Cancel"
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <Input
              name="companyName"
              placeholder="Enter company name"
              value={newJob.companyName}
              onChange={(e) => handleInputChange(e, 'add')}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <Input
              name="jobTitle"
              placeholder="Enter job title"
              value={newJob.jobTitle}
              onChange={(e) => handleInputChange(e, 'add')}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description Link *
            </label>
            <Input
              name="jdLink"
              placeholder="Enter JD URL"
              value={newJob.jdLink}
              onChange={(e) => handleInputChange(e, 'add')}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applied Date *
            </label>
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              value={newJob.appliedDate ? dayjs(newJob.appliedDate) : dayjs()}
              onChange={(date) => handleDateChange(date, 'add')}
              format="YYYY-MM-DD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={newJob.status}
              onChange={(value) => handleSelectChange(value, 'status', 'add')}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="Applied">Applied</Option>
              <Option value="Shortlisted">Shortlisted</Option>
              <Option value="Interview">Interview</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="Offer">Offer</Option>
            </Select>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            * Required fields
          </div>
        </div>
      </Modal>

      {/* Edit Application Modal */}
      <Modal
        title="Edit Job Application"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        confirmLoading={isUpdating}
        width={500}
        okText="Update Application"
        cancelText="Cancel"
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <Input
              name="companyName"
              placeholder="Enter company name"
              value={editJob.companyName}
              onChange={(e) => handleInputChange(e, 'edit')}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <Input
              name="jobTitle"
              placeholder="Enter job title"
              value={editJob.jobTitle}
              onChange={(e) => handleInputChange(e, 'edit')}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description Link *
            </label>
            <Input
              name="jdLink"
              placeholder="Enter JD URL"
              value={editJob.jdLink}
              onChange={(e) => handleInputChange(e, 'edit')}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applied Date *
            </label>
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              value={editJob.appliedDate ? dayjs(editJob.appliedDate) : dayjs()}
              onChange={(date) => handleDateChange(date, 'edit')}
              format="YYYY-MM-DD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={editJob.status}
              onChange={(value) => handleSelectChange(value, 'status', 'edit')}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="Applied">Applied</Option>
              <Option value="Shortlisted">Shortlisted</Option>
              <Option value="Interview">Interview</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="Offer">Offer</Option>
            </Select>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            * Required fields
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Application"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <div className="space-y-3">
          <p className="text-gray-700">
            Are you sure you want to delete this job application?
          </p>
          {selectedJob && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium">{selectedJob.companyName}</p>
              <p className="text-sm text-gray-600">{selectedJob.jobTitle}</p>
            </div>
          )}
          <p className="text-red-500 text-sm">
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* View Application Details Modal */}
      <Modal
        title="Application Details"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>
        ]}
        width={500}
      >
        {selectedJob && (
          <div className="space-y-4 p-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <UserOutlined className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold">{selectedJob.companyName}</h3>
              <p className="text-gray-600">{selectedJob.jobTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Application ID:</span>
                <div className="font-medium">#{selectedJob.id.slice(-6)}</div>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <div>
                  <Tag color={
                    selectedJob.status === 'Applied' ? 'blue' :
                    selectedJob.status === 'Shortlisted' ? 'green' :
                    selectedJob.status === 'Interview' ? 'orange' :
                    selectedJob.status === 'Rejected' ? 'red' :
                    selectedJob.status === 'Offer' ? 'purple' : 'blue'
                  }>
                    {selectedJob.status}
                  </Tag>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Applied Date:</span>
                <div className="font-medium">{selectedJob.appliedDate}</div>
              </div>
              <div>
                <span className="text-gray-500">User ID:</span>
                <div className="font-medium">#{selectedJob.userId?.slice(-6) || 'N/A'}</div>
              </div>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Job Description Link:</span>
              <Button
                type="link"
                href={selectedJob.jdLink}
                target="_blank"
                rel="noopener noreferrer"
                icon={<LinkOutlined />}
                className="p-0 text-blue-600"
              >
                View Job Description
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Applied;
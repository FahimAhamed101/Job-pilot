import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Select, message, Tag, Space, Card, DatePicker, Descriptions, Spin } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  LinkOutlined,
  MailOutlined,
  CalendarOutlined,
 
  FileTextOutlined
} from '@ant-design/icons';
import { 
  useGetAllAppliedJobsQuery,
  useApplyForJobMutation,
  useUpdateAppliedJobMutation,
  useDeleteAppliedJobMutation,
  useUpdateApplicationStatusMutation
} from '../../redux/features/applied/appliedApi';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const { Option } = Select;

const Applied = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Get current user from Redux store
  const { user: currentUser } = useSelector((state) => state.auth);
  const isAnalyst = currentUser?.role === 'analyst';

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
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [newJob, setNewJob] = useState({
    companyName: '',
    jobTitle: '',
    jdLink: '',
    status: 'Applied',
    appliedDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    userId: currentUser?.id || ''
  });

  // Extract jobs and pagination info
  const jobs = jobsData?.jobs || [];
  const totalJobs = jobsData?.total || 0;

  // Transform API data to table format with additional fields
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
      // Additional fields from API
      userInfo: job.userInfo || {},
      adminInfo: job.adminInfo || {},
      originalData: job
    }));
  };

  const dataSource = transformJobData(jobs);

  // Handle View Job Application
  const showViewModal = (record) => {
    setSelectedJob(record);
    setIsViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setSelectedJob(null);
  };

  // Handle Edit Job Application
  const showEditModal = (record) => {
    if (isAnalyst) return; // Prevent analysts from editing
    
    setEditForm({ 
      companyName: record.companyName,
      jobTitle: record.jobTitle,
      jdLink: record.jdLink,
      status: record.status,
      appliedDate: record.originalAppliedDate,
    });
    setSelectedJob(record);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditForm(null);
    setSelectedJob(null);
  };

  // Handle Delete Job Application
  const showDeleteModal = (record) => {
    if (isAnalyst) return; // Prevent analysts from deleting
    
    setSelectedJob(record);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedJob(null);
  };

  // Handle Add New Job Application
  const showAddModal = () => {
    if (isAnalyst) return; // Prevent analysts from adding
    
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

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    setNewJob({
      companyName: '',
      jobTitle: '',
      jdLink: '',
      status: 'Applied',
      appliedDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      userId: currentUser?.id || ''
    });
  };

  // Handle form submissions
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

  const handleEditOk = async () => {
    if (!editForm.companyName || !editForm.jobTitle || !editForm.jdLink) {
      message.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...editForm,
        appliedDate: editForm.appliedDate || selectedJob.originalAppliedDate
      };

      await updateAppliedJob({
        id: selectedJob.originalData._id,
        ...payload
      }).unwrap();
      message.success('Job application updated successfully!');
      setIsEditModalVisible(false);
      setEditForm(null);
      setSelectedJob(null);
      refetch();
    } catch (error) {
      console.error('Error updating application:', error);
      message.error('Failed to update application: ' + (error.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteOk = async () => {
    try {
      await deleteAppliedJob(selectedJob.originalData._id).unwrap();
      message.success('Job application deleted successfully!');
      setIsDeleteModalVisible(false);
      setSelectedJob(null);
      refetch();
    } catch (error) {
      message.error('Failed to delete application: ' + (error.data?.message || 'Unknown error'));
    }
  };

  // Handle Status Change
  const handleStatusChange = async (job, newStatus) => {
    if (isAnalyst) {
      message.warning('Analysts cannot change application status');
      return;
    }
    
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
  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleNewJobChange = (field, value) => {
    setNewJob(prev => ({ ...prev, [field]: value }));
  };

  // Define columns with additional fields
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <span className="text-gray-600">#{id?.slice(-6) || 'N/A'}</span>,
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
      title: 'Applicant',
      dataIndex: 'userInfo',
      key: 'applicant',
      render: (userInfo) => (
        <div className="text-sm">
          <div className="font-medium">{userInfo?.firstName || 'N/A'}</div>
          <div className="text-gray-500 text-xs">{userInfo?.email || ''}</div>
        </div>
      ),
    },
    {
      title: 'Admin',
      dataIndex: 'adminInfo',
      key: 'admin',
      render: (adminInfo) => (
        <div className="text-sm">
          <div className="font-medium">{adminInfo?.firstName || 'N/A'}</div>
          <div className="text-gray-500 text-xs">{adminInfo?.email || ''}</div>
        </div>
      ),
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
        
        // For analysts, show read-only tag instead of select
        if (isAnalyst) {
          return (
            <Tag color={statusColors[status] || 'blue'}>
              {status}
            </Tag>
          );
        }
        
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
          {/* Always show View button */}
          <Button
            size="small"
            className="bg-gray-100 text-gray-600 border-gray-200"
            onClick={() => showViewModal(record)}
            icon={<EyeOutlined />}
          >
            View
          </Button>
          
          {/* Show Edit and Delete buttons only for non-analysts */}
          {!isAnalyst && (
            <>
              <Button
                size="small"
                className="bg-blue-100 text-blue-600 border-blue-200"
                onClick={() => showEditModal(record)}
                icon={<EditOutlined />}
              >
                Edit
              </Button>
              <Button
                size="small"
                className="bg-red-100 text-red-600 border-red-200"
                onClick={() => showDeleteModal(record)}
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </>
          )}
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

  // Show error message if API call fails
  useEffect(() => {
    if (error) {
      message.error('Failed to load job applications');
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Job Applications</h2>
        <div className="flex space-x-2">
          <Input.Search
            placeholder="Search by company or job title"
            onSearch={handleSearch}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            onChange={setStatusFilter}
            allowClear
            value={statusFilter}
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          
          {/* Show Add button only for non-analysts */}
          {!isAnalyst && (
            <Button
              type="primary"
              className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white border-none"
              onClick={showAddModal}
              loading={isApplying}
            >
              Add New Application
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalJobs,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => (
              <div className="text-gray-600">
                Showing {range[0]}-{range[1]} of {total} applications
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
          <div className="p-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
             
              </div>
            </div>
            <div className="space-y-3">
              <p><strong>Application ID:</strong> #{selectedJob.id?.slice(-6) || 'N/A'}</p>
              <p><strong>Company:</strong> {selectedJob.companyName}</p>
              <p><strong>Job Title:</strong> {selectedJob.jobTitle}</p>
              <p><strong>Status:</strong> 
                <Tag className="ml-2" color={
                  selectedJob.status === 'Applied' ? 'blue' :
                  selectedJob.status === 'Shortlisted' ? 'green' :
                  selectedJob.status === 'Interview' ? 'orange' :
                  selectedJob.status === 'Rejected' ? 'red' :
                  selectedJob.status === 'Offer' ? 'purple' : 'blue'
                }>
                  {selectedJob.status}
                </Tag>
              </p>
              <p><strong>Applied Date:</strong> {selectedJob.appliedDate}</p>
              <p><strong>Job Description:</strong> 
                <Button
                  type="link"
                  href={selectedJob.jdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<LinkOutlined />}
                  className="p-0 ml-2"
                >
                  View Link
                </Button>
              </p>
              <p><strong>Applicant:</strong> {selectedJob.userInfo?.firstName || 'N/A'} ({selectedJob.userInfo?.email || 'N/A'})</p>
              <p><strong>Admin:</strong> {selectedJob.adminInfo?.firstName || 'N/A'} ({selectedJob.adminInfo?.email || 'N/A'})</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Application"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save Changes"
        width={500}
      >
        {editForm && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Company Name</label>
              <Input
                value={editForm.companyName}
                onChange={(e) => handleEditChange('companyName', e.target.value)}
                placeholder="Enter company name"
                
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Job Title</label>
              <Input
                value={editForm.jobTitle}
                onChange={(e) => handleEditChange('jobTitle', e.target.value)}
                placeholder="Enter job title"
                prefix={<FileTextOutlined />}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Job Description Link</label>
              <Input
                value={editForm.jdLink}
                onChange={(e) => handleEditChange('jdLink', e.target.value)}
                placeholder="Enter JD URL"
                prefix={<LinkOutlined />}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Applied Date</label>
              <DatePicker
                style={{ width: '100%' }}
                value={editForm.appliedDate ? dayjs(editForm.appliedDate) : dayjs()}
                onChange={(date) => handleEditChange('appliedDate', date ? date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : '')}
                format="YYYY-MM-DD"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <Select
                value={editForm.status}
                onChange={(value) => handleEditChange('status', value)}
                style={{ width: '100%' }}
              >
                <Option value="Applied">Applied</Option>
                <Option value="Shortlisted">Shortlisted</Option>
                <Option value="Interview">Interview</Option>
                <Option value="Rejected">Rejected</Option>
                <Option value="Offer">Offer</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Application Modal */}
      <Modal
        title="Add New Application"
        open={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        confirmLoading={isApplying}
        width={500}
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Company Name *</label>
            <Input
              value={newJob.companyName}
              onChange={(e) => handleNewJobChange('companyName', e.target.value)}
              placeholder="Enter company name"
            
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Title *</label>
            <Input
              value={newJob.jobTitle}
              onChange={(e) => handleNewJobChange('jobTitle', e.target.value)}
              placeholder="Enter job title"
              prefix={<FileTextOutlined />}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Description Link *</label>
            <Input
              value={newJob.jdLink}
              onChange={(e) => handleNewJobChange('jdLink', e.target.value)}
              placeholder="Enter JD URL"
              prefix={<LinkOutlined />}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Applied Date *</label>
            <DatePicker
              style={{ width: '100%' }}
              value={newJob.appliedDate ? dayjs(newJob.appliedDate) : dayjs()}
              onChange={(date) => handleNewJobChange('appliedDate', date ? date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : '')}
              format="YYYY-MM-DD"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <Select
              value={newJob.status}
              onChange={(value) => handleNewJobChange('status', value)}
              style={{ width: '100%' }}
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

      {/* Delete Modal */}
      <Modal
        title="Delete Application"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <div className="flex items-center p-4">
          <span className="text-red-500 text-2xl mr-3">🗑️</span>
          <div>
            <h3 className="font-semibold">Delete this application</h3>
            <p className="text-gray-600">
              Are you sure you want to delete the application for {selectedJob?.companyName} - {selectedJob?.jobTitle}? This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Applied;
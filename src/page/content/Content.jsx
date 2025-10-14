import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Form, Button, Table, Modal, message, Input } from 'antd';
import { 
  useGetAllFaqsQuery, 
  useCreateFaqMutation, 
  useUpdateFaqMutation, 
  useDeleteFaqMutation 
} from '../../redux/features/faq/faqApi';
import {
  useGetPrivacyPolicyQuery,
  useCreatePrivacyPolicyMutation,
  useUpdatePrivacyPolicyMutation,
} from '../../redux/features/privacyPolicy/privacyPolicyApi';

const { TextArea } = Input;

const ContentTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isQuillModalOpen, setIsQuillModalOpen] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState(null);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [content, setContent] = useState('');
  
  // Forms
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [privacyForm] = Form.useForm();

  // RTK Query hooks
  const { 
    data: faqsData = [], 
    isLoading: faqsLoading, 
    error: faqsError,
    refetch: refetchFaqs 
  } = useGetAllFaqsQuery();

  // Privacy Policy hooks
  const { 
    data: privacyPolicyData, 
    isLoading: privacyLoading,
    error: privacyError,
    refetch: refetchPrivacyPolicy 
  } = useGetPrivacyPolicyQuery();

  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  
  const [createPrivacyPolicy, { isLoading: isCreatingPrivacy }] = useCreatePrivacyPolicyMutation();
  const [updatePrivacyPolicy, { isLoading: isUpdatingPrivacy }] = useUpdatePrivacyPolicyMutation();

  // Transform API data to match table format
  const transformedFaqs = Array.isArray(faqsData) ? faqsData.map((faq, index) => ({
    key: faq._id || faq.id,
    id: faq._id || faq.id,
    sl: index + 1,
    question: faq.question,
    answer: faq.description || faq.answer,
    originalData: faq
  })) : [];

  // Load privacy policy content when data is available
  useEffect(() => {
    if (privacyPolicyData) {
      const privacyText = privacyPolicyData.text || '';
      setContent(privacyText);
      
      // Set default content if empty
      if (!privacyText.trim()) {
        setContent(`
          <h2>Information We Collect</h2>
          <p>Via collect personal information such as your name, email, phone number, and account details when you register or interact with Job Pilot. We also collect usage data like job applications, saved preferences, and device information to improve your experience.</p>
          <h2>How We Use Your Data</h2>
          <p>We use your information to help track job applications, schedule interviews, send notifications, and enhance overall app performance. This also allows us to provide better recommendations and maintain secure communication with you.</p>
          <h2>Data Sharing & Security</h2>
          <p>We do not sell your data. However, we may share limited information with third-party services (e.g., analytics or cloud storage) to improve Job Pilot's features. We implement security measures to protect your data from unauthorized access.</p>
          <h2>User Rights</h2>
          <p>You have the right to view, edit, or delete your personal information stored on Job Pilot. You can also choose to deactivate your account or opt-out of notifications at any time. For any privacy-related concerns, contact our support team.</p>
          <h2>Contact Info</h2>
          <p>For more information about this privacy policy or how we handle your data, please reach out to us at support@jobpilot.com</p>
        `);
      }
    }
  }, [privacyPolicyData]);

  // Add FAQ handlers
  const handleAddSubmit = async (values) => {
    try {
      const faqData = {
        question: values.question,
        description: values.description,
      };

      const result = await createFaq(faqData).unwrap();
      
      if (result.code === 200 || result.code === 201) {
        message.success('FAQ created successfully!');
        setIsAddModalOpen(false);
        addForm.resetFields();
        refetchFaqs();
      } else {
        message.error(result.message || 'Failed to create FAQ');
      }
    } catch (error) {
      console.error('Create FAQ error:', error);
      if (error.data?.message) {
        message.error(error.data.message);
      } else {
        message.error('Failed to create FAQ');
      }
    }
  };

  // Edit FAQ handlers
  const handleEditSubmit = async (values) => {
    try {
      const faqData = {
        question: values.question,
        description: values.description,
      };

      const result = await updateFaq({ 
        id: selectedFaq.id, 
        faqData 
      }).unwrap();
      
      if (result.code === 200) {
        message.success('FAQ updated successfully!');
        setIsEditModalOpen(false);
        editForm.resetFields();
        refetchFaqs();
      } else {
        message.error(result.message || 'Failed to update FAQ');
      }
    } catch (error) {
      console.error('Update FAQ error:', error);
      if (error.data?.message) {
        message.error(error.data.message);
      } else {
        message.error('Failed to update FAQ');
      }
    }
  };

  // Delete FAQ handlers
  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteFaq(selectedFaqId).unwrap();
      
      if (result.code === 200) {
        message.success('FAQ deleted successfully!');
        setIsDeleteConfirmOpen(false);
        setSelectedFaqId(null);
        refetchFaqs();
      } else {
        message.error(result.message || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Delete FAQ error:', error);
      if (error.data?.message) {
        message.error(error.data.message);
      } else {
        message.error('Failed to delete FAQ');
      }
    }
  };

  // Privacy Policy handlers
  const handlePrivacySubmit = async (values) => {
    try {
      const privacyData = {
        text: content,
      };

      let result;

      if (privacyPolicyData && privacyPolicyData._id) {
        // Update existing privacy policy
        result = await updatePrivacyPolicy({
          id: privacyPolicyData._id,
          privacyData
        }).unwrap();
      } else {
        // Create new privacy policy
        result = await createPrivacyPolicy(privacyData).unwrap();
      }

      if (result.code === 200 || result.code === 201) {
        message.success('Privacy policy updated successfully!');
        setIsQuillModalOpen(false);
        refetchPrivacyPolicy();
      } else {
        message.error(result.message || 'Failed to update privacy policy');
      }
    } catch (error) {
      console.error('Privacy policy update error:', error);
      if (error.data?.message) {
        message.error(error.data.message);
      } else {
        message.error('Failed to update privacy policy');
      }
    }
  };

  // Modal handlers
  const showAddModal = () => {
    addForm.resetFields();
    setIsAddModalOpen(true);
  };

  const showEditModal = (faq) => {
    setSelectedFaq(faq);
    editForm.setFieldsValue({
      question: faq.question,
      description: faq.answer,
    });
    setIsEditModalOpen(true);
  };

  const showViewModal = (faq) => {
    setSelectedFaq(faq);
    setIsViewModalOpen(true);
  };

  const showDeleteModal = (faq) => {
    setSelectedFaqId(faq.id);
    setIsDeleteConfirmOpen(true);
  };

  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleQuillOpen = () => {
    setIsQuillModalOpen(true);
    setIsPrivacyModalOpen(false);
  };

  // Render privacy policy content safely
  const renderPrivacyPolicyContent = () => {
    if (privacyPolicyData?.text) {
      return (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: privacyPolicyData.text }}
        />
      );
    }
    
    // Default content if no privacy policy exists
    return (
      <div className="space-y-4 text-gray-600">
        <div>
          <h3 className="font-semibold text-gray-900">Information We Collect</h3>
          <p>Via collect personal information such as your name, email, phone number, and account details when you register or interact with Job Pilot. We also collect usage data like job applications, saved preferences, and device information to improve your experience.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">How We Use Your Data</h3>
          <p>We use your information to help track job applications, schedule interviews, send notifications, and enhance overall app performance. This also allows us to provide better recommendations and maintain secure communication with you.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Data Sharing & Security</h3>
          <p>We do not sell your data. However, we may share limited information with third-party services (e.g., analytics or cloud storage) to improve Job Pilot's features. We implement security measures to protect your data from unauthorized access.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">User Rights</h3>
          <p>You have the right to view, edit, or delete your personal information stored on Job Pilot. You can also choose to deactivate your account or opt-out of notifications at any time. For any privacy-related concerns, contact our support team.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Contact Info</h3>
          <p>For more information about this privacy policy or how we handle your data, please reach out to us at support@jobpilot.com</p>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    {
      title: 'SL',
      dataIndex: 'sl',
      key: 'sl',
      width: 80,
    },
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: (text) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            size="small"
            onClick={() => showEditModal(record)}
            disabled={isUpdating}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => showDeleteModal(record)}
            disabled={isDeleting}
          >
            Delete
          </Button>
          <Button
            size="small"
            type="default"
            onClick={() => showViewModal(record)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (faqsError) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center p-8">
          Failed to load FAQs. Please try again later.
          <Button onClick={refetchFaqs} className="ml-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Content</h2>
        <div>
          <Button
            type="primary"
            className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white rounded mr-2"
            onClick={showAddModal}
            loading={isCreating}
          >
            Add FAQ
          </Button>
          <Button
            type="primary"
            className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white rounded"
            onClick={handlePrivacyClick}
            loading={privacyLoading}
          >
            Privacy & Policy
          </Button>
        </div>
      </div>

      <Table
        dataSource={transformedFaqs}
        columns={columns}
        loading={faqsLoading}
        className="bg-white rounded-lg shadow"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `Showing ${range[0]}-${range[1]} of ${total} FAQs`,
        }}
      />

      {/* Add FAQ Modal */}
      <Modal
        title="Add New FAQ"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddSubmit}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter a question' }]}
          >
            <Input placeholder="Enter question" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Answer"
            rules={[{ required: true, message: 'Please enter an answer' }]}
          >
            <TextArea
              placeholder="Enter answer"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating}
              className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal
        title="Edit FAQ"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter a question' }]}
          >
            <Input placeholder="Enter question" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Answer"
            rules={[{ required: true, message: 'Please enter an answer' }]}
          >
            <TextArea
              placeholder="Enter answer"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white"
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View FAQ Modal */}
      <Modal
        title="FAQ Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedFaq && (
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Question:</label>
              <p className="mt-1 text-gray-900">{selectedFaq.question}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Answer:</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                {selectedFaq.answer}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete FAQ"
        open={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteConfirmOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={isDeleting}
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>,
        ]}
        width={400}
      >
        <div className="text-center py-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete this FAQ
          </h3>
          <p className="text-gray-600">
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Privacy Policy View Modal */}
      <Modal
        title="Privacy & Policy"
        open={isPrivacyModalOpen}
        onCancel={() => setIsPrivacyModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsPrivacyModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="update"
            type="primary"
            className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white"
            onClick={handleQuillOpen}
          >
            Update Privacy & Policy
          </Button>,
        ]}
        width={800}
      >
        {renderPrivacyPolicyContent()}
      </Modal>

      {/* Quill Editor Modal for Privacy Policy */}
      <Modal
        title="Update Privacy & Policy"
        open={isQuillModalOpen}
        onCancel={() => setIsQuillModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form
          form={privacyForm}
          layout="vertical"
          onFinish={handlePrivacySubmit}
        >
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={(value) => setContent(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  ["blockquote", "code-block"],
                  ["link", "image", "video"],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["clean"],
                ],
              }}
              style={{ height: "300px", marginBottom: "50px" }}
            />
          </Form.Item>
          <div className="flex justify-end space-x-4 mt-16">
            <Button onClick={() => setIsQuillModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingPrivacy || isUpdatingPrivacy}
              className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white"
            >
              {privacyPolicyData ? 'Update' : 'Create'} Privacy Policy
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentTable;
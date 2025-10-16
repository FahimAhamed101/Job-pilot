import { DownOutlined } from '@ant-design/icons';
import { Button, Menu, Dropdown, Modal, Input, Table, message, Form, Select, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import user from '../../../public/user.jpg';
import { 
  useGetAllPaymentsQuery, 
  useCreatePaymentMutation, 
  useUpdatePaymentMutation, 
  useDeletePaymentMutation 
} from '../../redux/features/payment/paymentApi';
import { useSelector } from 'react-redux';

const { Option } = Select;

const Payments = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNewPaymentModalVisible, setIsNewPaymentModalVisible] = useState(false);
    const [isEditPaymentModalVisible, setIsEditPaymentModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Get current user from Redux store
    const { user: currentUser } = useSelector((state) => state.auth);
    const isAnalyst = currentUser?.role === 'analyst';

    // RTK Query hooks
    const { 
        data: paymentsData = [], 
        isLoading, 
        error,
        refetch 
    } = useGetAllPaymentsQuery();

    const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
    const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
    const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

    // Forms
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    // Transform API data to match table format
    const transformedPayments = paymentsData.map((payment, index) => ({
        key: payment._id || index,
        _id: payment._id,
        user: payment.userId?.fullName || `${payment.userId?.firstName} ${payment.userId?.lastName || ''}`.trim(),
        amount: `$${payment.amount}`,
        status: payment.userId?.status || 'Active Premium',
        transactionId: payment.transactionId,
        gateway: 'JobPilot', // You might want to add this field to your API
        startDate: moment(payment.createdAt).format('MM/DD/YYYY'),
        endDate: payment.userId?.subEndDate ? moment(payment.userId.subEndDate).format('MM/DD/YYYY') : 'N/A',
        image: payment.userId?.profileImage || user,
        originalData: payment
    }));

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

    const showModal = (payment) => {
        setSelectedPayment(payment);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showNewPaymentModal = () => {
        if (isAnalyst) return; // Prevent analysts from adding
        
        form.resetFields();
        setIsNewPaymentModalVisible(true);
    };

    const handleNewPaymentOk = async () => {
        try {
            const values = await form.validateFields();
            
            const paymentData = {
                amount: parseFloat(values.amount.replace('$', '')),
                transactionId: values.transactionId,
                gateway: values.gateway,
                userId: values.userId, // You'll need to implement user selection
                date: values.date ? moment(values.date).toISOString() : new Date().toISOString()
            };

            const result = await createPayment(paymentData).unwrap();
            
            if (result.code === 200 || result.code === 201) {
                message.success('Payment created successfully!');
                setIsNewPaymentModalVisible(false);
                form.resetFields();
            } else {
                message.error(result.message || 'Failed to create payment');
            }
        } catch (error) {
            console.error('Create payment error:', error);
            if (error.data?.message) {
                message.error(error.data.message);
            } else {
                message.error('Failed to create payment');
            }
        }
    };

    const handleNewPaymentCancel = () => {
        setIsNewPaymentModalVisible(false);
        form.resetFields();
    };

    const showEditPaymentModal = (payment) => {
        if (isAnalyst) return; // Prevent analysts from editing
        
        setSelectedPayment(payment);
        editForm.setFieldsValue({
            gateway: payment.gateway,
            amount: payment.amount.replace('$', ''),
            user: payment.user,
            date: moment(payment.startDate, 'MM/DD/YYYY'),
            transactionId: payment.transactionId
        });
        setIsEditPaymentModalVisible(true);
    };

    const handleEditPaymentOk = async () => {
        try {
            const values = await editForm.validateFields();
            
            const paymentData = {
                amount: parseFloat(values.amount),
                transactionId: values.transactionId,
                gateway: values.gateway,
                date: values.date ? moment(values.date).toISOString() : new Date().toISOString()
            };

            const result = await updatePayment({ 
                id: selectedPayment._id, 
                paymentData 
            }).unwrap();
            
            if (result.code === 200) {
                message.success('Payment updated successfully!');
                setIsEditPaymentModalVisible(false);
                editForm.resetFields();
            } else {
                message.error(result.message || 'Failed to update payment');
            }
        } catch (error) {
            console.error('Update payment error:', error);
            if (error.data?.message) {
                message.error(error.data.message);
            } else {
                message.error('Failed to update payment');
            }
        }
    };

    const handleEditPaymentCancel = () => {
        setIsEditPaymentModalVisible(false);
        editForm.resetFields();
    };

    const showDeleteModal = (payment) => {
        if (isAnalyst) return; // Prevent analysts from deleting
        
        setSelectedPayment(payment);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteOk = async () => {
        try {
            const result = await deletePayment(selectedPayment._id).unwrap();
            
            if (result.code === 200) {
                message.success('Payment deleted successfully!');
                setIsDeleteModalVisible(false);
            } else {
                message.error(result.message || 'Failed to delete payment');
            }
        } catch (error) {
            console.error('Delete payment error:', error);
            if (error.data?.message) {
                message.error(error.data.message);
            } else {
                message.error('Failed to delete payment');
            }
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => (
                <div className="flex items-center">
                    <img 
                        src={record.image} 
                        alt={text} 
                        className="w-10 h-10 rounded-full mr-2 object-cover"
                        onError={(e) => {
                            e.target.src = user;
                        }}
                    />
                    <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-xs text-gray-500">
                            {record.originalData?.userId?.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span className={`px-2 py-1 rounded ${
                    text === 'Active' || text.includes('Premium') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Transaction ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
            render: (text) => (
                <span className="font-mono text-sm">{text}</span>
            ),
        },
        {
            title: 'Gateway',
            dataIndex: 'gateway',
            key: 'gateway',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div className="flex space-x-2">
                    {/* Always show View button */}
                    <button 
                        className="border text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-100"
                        onClick={() => showModal(record)}
                    >
                        View
                    </button>
                    
                    {/* Show Edit and Delete buttons only for non-analysts */}
                    {!isAnalyst && (
                        <>
                            <button 
                                className="border text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-100"
                                onClick={() => showEditPaymentModal(record)}
                                disabled={isUpdating}
                            >
                                Edit
                            </button>
                            <button 
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                onClick={() => showDeleteModal(record)}
                                disabled={isDeleting}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-red-500 text-center p-8">
                    Failed to load payments. Please try again later.
                    <Button onClick={refetch} className="ml-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Payments</h2>
                <div className='flex gap-5'>
                    {/* Show Add button only for non-analysts */}
                    {!isAnalyst && (
                        <div>
                            <Button
                                type="primary"
                                icon={<span className="text-white">+</span>}
                                className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white rounded flex items-center"
                                onClick={showNewPaymentModal}
                                loading={isCreating}
                            >
                                Add New Payment
                            </Button>
                        </div>
                    )}
                    <div>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button className="bg-gray-200 hover:bg-gray-300 rounded flex items-center">
                                Status <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table
                    dataSource={transformedPayments}
                    columns={columns}
                    loading={isLoading}
                    className="bg-white shadow-md rounded-lg w-full"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: transformedPayments.length,
                        onChange: handlePageChange,
                        showSizeChanger: false,
                        showTotal: (total, range) => (
                            <div className="text-gray-600">
                                Total Payments: {total} & Pages: {currentPage}/{Math.ceil(total / pageSize)}
                            </div>
                        ),
                    }}
                />
            </div>

            {/* View Modal */}
            <Modal
                title="Payment Details"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
                className="custom-modal"
            >
                {selectedPayment && (
                    <div className="text-center">
                        <img 
                            src={selectedPayment.image} 
                            alt={selectedPayment.user} 
                            className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                            onError={(e) => {
                                e.target.src = user;
                            }}
                        />
                        <h3 className="text-xl font-bold">{selectedPayment.user}</h3>
                        <p className="text-gray-500">
                            {selectedPayment.originalData?.userId?.Designation || 'Software Engineer'}
                        </p>
                        
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-600">Gateway</span>
                                <span className="font-medium">{selectedPayment.gateway}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-600">Date</span>
                                <span className="font-medium">{selectedPayment.startDate}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-600">Amount</span>
                                <span className="font-medium text-green-600">{selectedPayment.amount}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-600">Transaction ID</span>
                                <span className="font-medium font-mono text-sm">{selectedPayment.transactionId}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Payment Modal */}
            <Modal
                title="Create New Payment"
                visible={isNewPaymentModalVisible}
                onOk={handleNewPaymentOk}
                onCancel={handleNewPaymentCancel}
                confirmLoading={isCreating}
                footer={[
                    <Button key="cancel" onClick={handleNewPaymentCancel} disabled={isCreating}>
                        Cancel
                    </Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white" 
                        onClick={handleNewPaymentOk}
                        loading={isCreating}
                    >
                        Create Payment
                    </Button>,
                ]}
                className="custom-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        gateway: 'JobPilot',
                        amount: '2000',
                        date: moment()
                    }}
                >
                    <Form.Item
                        name="gateway"
                        label="Payment Gateway"
                        rules={[{ required: true, message: 'Please select a payment gateway' }]}
                    >
                        <Select placeholder="Select gateway">
                            <Option value="JobPilot">JobPilot</Option>
                            <Option value="PayPal">PayPal</Option>
                            <Option value="Bank">Bank</Option>
                            <Option value="Payonner">Payonner</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter amount' }]}
                    >
                        <Input 
                            prefix="$" 
                            placeholder="Enter amount" 
                            type="number"
                        />
                    </Form.Item>

                    <Form.Item
                        name="transactionId"
                        label="Transaction ID"
                        rules={[{ required: true, message: 'Please enter transaction ID' }]}
                    >
                        <Input placeholder="Enter transaction ID" />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Payment Date"
                        rules={[{ required: true, message: 'Please select payment date' }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Payment Modal */}
            <Modal
                title="Edit Payment"
                visible={isEditPaymentModalVisible}
                onOk={handleEditPaymentOk}
                onCancel={handleEditPaymentCancel}
                confirmLoading={isUpdating}
                footer={[
                    <Button key="cancel" onClick={handleEditPaymentCancel} disabled={isUpdating}>
                        Cancel
                    </Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white" 
                        onClick={handleEditPaymentOk}
                        loading={isUpdating}
                    >
                        Update Payment
                    </Button>,
                ]}
                className="custom-modal"
            >
                <Form
                    form={editForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="gateway"
                        label="Payment Gateway"
                        rules={[{ required: true, message: 'Please select a payment gateway' }]}
                    >
                        <Select placeholder="Select gateway">
                            <Option value="JobPilot">JobPilot</Option>
                            <Option value="PayPal">PayPal</Option>
                            <Option value="Bank">Bank</Option>
                            <Option value="Payonner">Payonner</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter amount' }]}
                    >
                        <Input 
                            prefix="$" 
                            placeholder="Enter amount" 
                            type="number"
                        />
                    </Form.Item>

                    <Form.Item
                        name="transactionId"
                        label="Transaction ID"
                        rules={[{ required: true, message: 'Please enter transaction ID' }]}
                    >
                        <Input placeholder="Enter transaction ID" />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Payment Date"
                        rules={[{ required: true, message: 'Please select payment date' }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete Payment"
                visible={isDeleteModalVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                confirmLoading={isDeleting}
                footer={[
                    <Button key="cancel" onClick={handleDeleteCancel} disabled={isDeleting}>
                        Cancel
                    </Button>,
                    <Button 
                        key="delete" 
                        type="primary" 
                        danger 
                        onClick={handleDeleteOk}
                        loading={isDeleting}
                    >
                        Delete
                    </Button>,
                ]}
                className="custom-modal"
            >
                <div className="text-center">
                    <span className="text-2xl" role="img" aria-label="warning">⚠️</span>
                    <h3 className="text-xl font-bold text-red-500 mt-2">Delete this Payment</h3>
                    <p className="text-gray-600 mt-2">
                        Are you sure you want to delete the payment for <strong>{selectedPayment?.user}</strong>? 
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default Payments;
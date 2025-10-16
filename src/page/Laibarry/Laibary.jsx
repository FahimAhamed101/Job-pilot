import { DownOutlined } from '@ant-design/icons';
import { Menu, Button, Dropdown, Modal, Input, Upload, message, Form } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetAllLibraryItemsQuery, 
  useDeleteLibraryItemMutation,
  useAddLibraryItemMutation,
  useUpdateLibraryItemMutation
} from '../../redux/features/library/libraryApi';

const { TextArea } = Input;

const Library = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Category');
    const [selectedType, setSelectedType] = useState('Type');
    const [form] = Form.useForm();
    
    // File states
    const [mainFile, setMainFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [mainFilePreview, setMainFilePreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    
    // Video control states
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // RTK Query hooks
    const { 
        data: libraryItems = [], 
        isLoading, 
        error, 
        refetch 
    } = useGetAllLibraryItemsQuery();
    
    const [deleteLibraryItem] = useDeleteLibraryItemMutation();
    const [addLibraryItem, { isLoading: isUploading }] = useAddLibraryItemMutation();
    const [updateLibraryItem, { isLoading: isUpdating }] = useUpdateLibraryItemMutation();

    // Get user role from Redux store
    const { user: currentUser } = useSelector((state) => state.auth);
    const isAnalyst = currentUser?.role === 'analyst';

    console.log('Library Items:', libraryItems);
    console.log('User Role:', currentUser?.role, 'Is Analyst:', isAnalyst);

    const handleCategorySelect = (e) => {
        setSelectedCategory(e.key);
        form.setFieldsValue({ category: e.key });
    };

    const handleTypeSelect = (e) => {
        setSelectedType(e.key);
        form.setFieldsValue({ fileType: e.key.toLowerCase() });
        
        // Clear main file when type changes to ensure correct file type
        if (mainFile) {
            setMainFile(null);
            setMainFilePreview(null);
            message.info('Main file cleared. Please upload a file matching the selected type.');
        }
    };

    const categoryMenu = (
        <Menu onClick={handleCategorySelect}>
            <Menu.Item key="Management">Management</Menu.Item>
            <Menu.Item key="Marketing">Marketing</Menu.Item>
            <Menu.Item key="Finance">Finance</Menu.Item>
            <Menu.Item key="Operations">Operations</Menu.Item>
            <Menu.Item key="Technology">Technology</Menu.Item>
            <Menu.Item key="Interview Preparation">Interview Preparation</Menu.Item>
            <Menu.Item key="Resume Building">Resume Building</Menu.Item>
            <Menu.Item key="Media">Media</Menu.Item>
        </Menu>
    );

    const typeMenu = (
        <Menu onClick={handleTypeSelect}>
            <Menu.Item key="PDF">PDF</Menu.Item>
            <Menu.Item key="VIDEO">VIDEO</Menu.Item>
            <Menu.Item key="TEXT">TEXT</Menu.Item>
        </Menu>
    );

    const statusMenu = (
        <Menu>
            <Menu.Item key="1">Free</Menu.Item>
            <Menu.Item key="2">Premium</Menu.Item>
            <Menu.Item key="3">Active Free</Menu.Item>
            <Menu.Item key="4">Active Premium</Menu.Item>
            <Menu.Item key="5">Deactive Free</Menu.Item>
            <Menu.Item key="6">Deactive Premium</Menu.Item>
        </Menu>
    );

    // Get file icon based on file type
    const getFileIcon = (fileType) => {
        switch (fileType?.toLowerCase()) {
            case 'video':
                return '🎥';
            case 'pdf':
                return '📄';
            case 'text':
                return '📝';
            default:
                return '📁';
        }
    };

    // Get full file URL
    const getFileUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}${url}`;
    };

    // Get thumbnail URL or fallback
    const getThumbnailUrl = (item) => {
        if (item.thumbnailUrl) {
            return getFileUrl(item.thumbnailUrl);
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=random`;
    };

    // Modal handlers
    const showModal = () => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to add content.');
            return;
        }
        setIsModalVisible(true);
        form.resetFields();
        setSelectedCategory('Category');
        setSelectedType('Type');
        setMainFile(null);
        setThumbnailFile(null);
        setMainFilePreview(null);
        setThumbnailPreview(null);
    };

    // UPDATED: Using RTK Query mutation for upload
    const handleOk = async () => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to upload content.');
            return;
        }

        try {
            const values = await form.validateFields();
            
            if (!mainFile) {
                message.error('Please upload a main file');
                return;
            }

            const formData = new FormData();
            
            // Append form fields
            formData.append('title', values.title);
            formData.append('description', values.description || '');
            formData.append('category', values.category);
            formData.append('fileType', values.fileType);
            
            // Append files
            formData.append('fileUrl', mainFile);
            if (thumbnailFile) {
                formData.append('thumbnailUrl', thumbnailFile);
            }

            console.log('Uploading form data with fields:', {
                title: values.title,
                description: values.description,
                category: values.category,
                fileType: values.fileType,
                file: mainFile.name,
                thumbnail: thumbnailFile?.name
            });

            // Use RTK Query mutation
            const result = await addLibraryItem(formData).unwrap();
            
            if (result.code === 201 || result.code === 200) {
                message.success('Library item created successfully');
                setIsModalVisible(false);
                form.resetFields();
                setMainFile(null);
                setThumbnailFile(null);
                setMainFilePreview(null);
                setThumbnailPreview(null);
                
                // RTK Query will automatically refetch due to invalidatesTags
            } else {
                message.error(result.message || 'Failed to create library item');
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (error.data?.message) {
                message.error(error.data.message);
            } else if (error.message?.includes('Unexpected token') || error.message?.includes('JSON')) {
                message.error('Server configuration error: Contact administrator to fix backend JSON parsing.');
            } else if (error.message?.includes('too large')) {
                message.error('File size too large. Please try a smaller file.');
            } else {
                message.error('Upload failed. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setMainFile(null);
        setThumbnailFile(null);
        setMainFilePreview(null);
        setThumbnailPreview(null);
    };

    // File upload handlers
    const handleMainFileUpload = (file) => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to upload files.');
            return false;
        }

        // Get current selected file type from form
        const selectedFileType = form.getFieldValue('fileType');
        
        // Validate file type based on selected file type
        if (selectedFileType) {
            if (selectedFileType === 'video' && !file.type.startsWith('video/')) {
                message.error('Please select a video file (MP4, MOV, AVI, etc.) for video type');
                return false;
            }
            if (selectedFileType === 'pdf' && file.type !== 'application/pdf') {
                message.error('Please select a PDF file for PDF type');
                return false;
            }
            if (selectedFileType === 'text' && 
                !file.type.startsWith('text/') && 
                file.type !== 'application/msword' && 
                file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                !file.name.endsWith('.txt')) {
                message.error('Please select a text document (TXT, DOC, DOCX) for text type');
                return false;
            }
        } else {
            message.error('Please select a file type first');
            return false;
        }

        setMainFile(file);
        
        // Create preview for images and videos
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setMainFilePreview(e.target.result);
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            setMainFilePreview(url);
        } else {
            setMainFilePreview(null);
        }
        
        return false; // Prevent default upload
    };

    const handleThumbnailUpload = (file) => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to upload files.');
            return false;
        }

        // Validate that it's an image
        if (!file.type.startsWith('image/')) {
            message.error('Please select an image file for thumbnail (JPG, PNG, GIF)');
            return false;
        }

        setThumbnailFile(file);
        
        // Create preview for thumbnail
        const reader = new FileReader();
        reader.onload = (e) => setThumbnailPreview(e.target.result);
        reader.readAsDataURL(file);
        
        return false; // Prevent default upload
    };

    const showDeleteModal = (item) => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to delete content.');
            return;
        }
        setSelectedItem(item);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteOk = async () => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to delete content.');
            return;
        }
        
        try {
            if (selectedItem) {
                await deleteLibraryItem(selectedItem._id).unwrap();
                message.success('Library item deleted successfully');
            }
            setIsDeleteModalVisible(false);
            setSelectedItem(null);
        } catch (error) {
            message.error('Failed to delete library item');
            console.error('Delete error:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setSelectedItem(null);
    };

    const showViewModal = (item) => {
        setSelectedItem(item);
        setIsViewModalVisible(true);
        // Reset video states when opening modal
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setVolume(1);
        setIsMuted(false);
    };

    const handleViewCancel = () => {
        setIsViewModalVisible(false);
        setSelectedItem(null);
        // Reset video states when closing modal
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    };

    // Video control functions
    const handlePlayPause = () => {
        const video = document.getElementById('view-modal-video');
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleSeekBack = () => {
        const video = document.getElementById('view-modal-video');
        if (video) {
            video.currentTime = Math.max(0, video.currentTime - 10);
        }
    };

    const handleSeekForward = () => {
        const video = document.getElementById('view-modal-video');
        if (video) {
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
        }
    };

    const handleVolumeToggle = () => {
        const video = document.getElementById('view-modal-video');
        if (video) {
            video.muted = !video.muted;
            setIsMuted(video.muted);
        }
    };

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
        setDuration(e.target.duration);
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    const formatTime = (time) => {
        if (!time) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const showEditModal = (item) => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to edit content.');
            return;
        }
        setSelectedItem(item);
        setSelectedCategory(item.category);
        setSelectedType(item.fileType?.toUpperCase());
        setIsEditModalVisible(true);
    };

    // UPDATED: Using RTK Query mutation for update
    const handleEditOk = async () => {
        if (isAnalyst) {
            message.warning('Analysts do not have permission to update content.');
            return;
        }

        try {
            if (!selectedItem) return;

            const formData = new FormData();
            formData.append('title', selectedItem.title);
            formData.append('description', selectedItem.description);
            formData.append('category', selectedItem.category);
            formData.append('fileType', selectedItem.fileType);

            // Only append files if they were changed
            if (mainFile) {
                formData.append('fileUrl', mainFile);
            }
            if (thumbnailFile) {
                formData.append('thumbnailUrl', thumbnailFile);
            }

            console.log('Updating library item:', selectedItem._id);

            // Use RTK Query mutation
            await updateLibraryItem({ 
                id: selectedItem._id, 
                formData 
            }).unwrap();
            
            message.success('Library item updated successfully');
            setIsEditModalVisible(false);
            setSelectedItem(null);
            setMainFile(null);
            setThumbnailFile(null);
            // RTK Query will automatically refetch due to invalidatesTags
        } catch (error) {
            console.error('Update error:', error);
            if (error.data?.message) {
                message.error(error.data.message);
            } else if (error.message?.includes('Unexpected token') || error.message?.includes('JSON')) {
                message.error('Server configuration error: Contact administrator to fix backend JSON parsing.');
            } else {
                message.error('Failed to update library item');
            }
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedItem(null);
        setMainFile(null);
        setThumbnailFile(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Get accepted file types based on selected type
    const getAcceptedFileTypes = () => {
        const selectedFileType = form.getFieldValue('fileType');
        switch (selectedFileType) {
            case 'video':
                return '.mp4,.mov,.avi,.mkv,.webm';
            case 'pdf':
                return '.pdf';
            case 'text':
                return '.txt,.doc,.docx';
            default:
                return '.pdf,.mp4,.mov,.avi,.txt,.doc,.docx,.jpg,.jpeg,.png';
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Library</h2>
                    <div className='flex gap-5'>
                        {!isAnalyst && (
                            <>
                                <div className="animate-pulse bg-gray-200 h-10 w-40 rounded"></div>
                                <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
                            </>
                        )}
                    </div>
                </div>
                {/* Loading skeleton */}
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="bg-white rounded shadow p-4 animate-pulse">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-200 rounded mr-3"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-red-500 text-center p-8">
                    Failed to load library items. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Library</h2>
                <div className='flex gap-5'>
                    {/* Only show Add New Content button for non-analysts */}
                    {!isAnalyst && (
                        <div>
                            <Button
                                type="primary"
                                icon={<span className="text-white">+</span>}
                                className="bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white rounded flex items-center"
                                onClick={showModal}
                                loading={isUploading}
                            >
                                Add New Content
                            </Button>
                        </div>
                    )}
                    <div>
                        <Dropdown overlay={statusMenu} trigger={['click']}>
                            <Button className="bg-gray-200 hover:bg-gray-300 rounded flex items-center">
                                Status <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {/* Desktop/Tablets: Table View */}
            <div className="hidden md:block">
                {libraryItems.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded shadow">
                        <p className="text-gray-500">No library items found</p>
                    </div>
                ) : (
                    <table className="w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-3">Content Title</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">File Type</th>
                                <th className="p-3">Last Updated</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {libraryItems.map((item) => (
                                <tr key={item._id} className="border-b">
                                    <td className="p-3 flex items-center">
                                        <img 
                                            src={getThumbnailUrl(item)} 
                                            alt={item.title} 
                                            className="w-12 h-12 mr-2 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=random`;
                                            }}
                                        />
                                        <div>
                                            <span className="font-medium block">{item.title}</span>
                                            <span className="text-sm text-gray-500 truncate max-w-xs block">
                                                {item.description}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className="flex items-center">
                                            <span className="mr-2 text-lg">{getFileIcon(item.fileType)}</span>
                                            {item.fileType?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-3">{item.category}</td>
                                    <td className="p-3 capitalize">{item.fileType}</td>
                                    <td className="p-3">{formatDate(item.updatedAt)}</td>
                                    <td className="p-3 flex space-x-2">
                                        {/* Only show Edit and Delete buttons for non-analysts */}
                                        {!isAnalyst && (
                                            <>
                                                <button
                                                    className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
                                                    onClick={() => showEditModal(item)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                                    onClick={() => showDeleteModal(item)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        {/* Always show View button for all roles */}
                                        <button
                                            className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
                                            onClick={() => showViewModal(item)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile: Card View */}
            <div className="md:hidden space-y-4">
                {libraryItems.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded shadow">
                        <p className="text-gray-500">No library items found</p>
                    </div>
                ) : (
                    libraryItems.map((item) => (
                        <div key={item._id} className="bg-white rounded shadow p-4">
                            <div className="flex items-center mb-2">
                                <img 
                                    src={getThumbnailUrl(item)} 
                                    alt={item.title} 
                                    className="w-12 h-12 mr-2 object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=random`;
                                    }}
                                />
                                <div>
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {getFileIcon(item.fileType)} {item.fileType?.toUpperCase()} | {item.category}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                <p className="truncate">{item.description}</p>
                                <p>Last updated: {formatDate(item.updatedAt)}</p>
                            </div>
                            <div className="flex space-x-2">
                                {/* Only show Edit and Delete buttons for non-analysts */}
                                {!isAnalyst && (
                                    <>
                                        <button
                                            className="bg-gray-300 text-black px-2 py-1 rounded flex-1 text-sm"
                                            onClick={() => showEditModal(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded flex-1 text-sm"
                                            onClick={() => showDeleteModal(item)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {/* Always show View button for all roles */}
                                <button
                                    className="bg-gray-300 text-black px-2 py-1 rounded flex-1 text-sm"
                                    onClick={() => showViewModal(item)}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Content Modal - Only for non-analysts */}
            {!isAnalyst && (
                <Modal
                    title="Add New Content"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    confirmLoading={isUploading}
                    footer={[
                        <Button key="cancel" onClick={handleCancel} disabled={isUploading}>
                            Cancel
                        </Button>,
                        <Button 
                            key="submit" 
                            type="primary" 
                            className="bg-green-500 text-white" 
                            onClick={handleOk}
                            loading={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Publish'}
                        </Button>,
                    ]}
                    className="custom-modal"
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            category: 'Category',
                            fileType: 'Type'
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Form.Item
                                    name="title"
                                    label="Title"
                                    rules={[{ required: true, message: 'Please enter a title' }]}
                                >
                                    <Input placeholder="Enter title" size="large" />
                                </Form.Item>
                                
                                <Form.Item
                                    name="description"
                                    label="Description"
                                >
                                    <TextArea 
                                        placeholder="Enter description" 
                                        rows={4}
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>
                                
                                <Form.Item
                                    name="category"
                                    label="Category"
                                    rules={[{ required: true, message: 'Please select a category' }]}
                                >
                                    <Dropdown overlay={categoryMenu} trigger={['click']}>
                                        <Button className="w-full text-left h-10 flex items-center justify-between">
                                            <span>{selectedCategory}</span>
                                            <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </Form.Item>
                                
                                <Form.Item
                                    name="fileType"
                                    label="File Type"
                                    rules={[{ required: true, message: 'Please select a file type' }]}
                                >
                                    <Dropdown overlay={typeMenu} trigger={['click']}>
                                        <Button className="w-full text-left h-10 flex items-center justify-between">
                                            <span>{selectedType}</span>
                                            <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </Form.Item>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <p className="font-medium mb-3 text-center">Main File *</p>
                                    {mainFilePreview ? (
                                        <div className="text-center">
                                            {mainFile.type.startsWith('image/') ? (
                                                <img 
                                                    src={mainFilePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-40 object-cover rounded-lg mb-3 mx-auto"
                                                />
                                            ) : mainFile.type.startsWith('video/') ? (
                                                <video 
                                                    src={mainFilePreview} 
                                                    className="w-full h-40 object-cover rounded-lg mb-3 mx-auto"
                                                    controls
                                                />
                                            ) : (
                                                <div className="text-6xl mb-3">
                                                    {getFileIcon(selectedType.toLowerCase())}
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-600 truncate mb-2">{mainFile.name}</p>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Size: {(mainFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                            <Button 
                                                type="link" 
                                                danger 
                                                size="small"
                                                onClick={() => {
                                                    setMainFile(null);
                                                    setMainFilePreview(null);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <Upload
                                            beforeUpload={handleMainFileUpload}
                                            showUploadList={false}
                                            accept={getAcceptedFileTypes()}
                                        >
                                            <div className="text-center cursor-pointer py-8">
                                                <div className="text-4xl text-green-500 mb-2">📁</div>
                                                <p className="text-green-500 font-medium">Click to upload or drag and drop</p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {selectedType === 'Type' 
                                                        ? 'Please select file type first' 
                                                        : `Accepted: ${getAcceptedFileTypes().replace(/\./g, ' ').toUpperCase()}`
                                                    }
                                                </p>
                                            </div>
                                        </Upload>
                                    )}
                                </div>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <p className="font-medium mb-3 text-center">Thumbnail (Optional)</p>
                                    {thumbnailPreview ? (
                                        <div className="text-center">
                                            <img 
                                                src={thumbnailPreview} 
                                                alt="Thumbnail Preview" 
                                                className="w-full h-40 object-cover rounded-lg mb-3 mx-auto"
                                            />
                                            <p className="text-sm text-gray-600 truncate mb-2">{thumbnailFile.name}</p>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Size: {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                            <Button 
                                                type="link" 
                                                danger 
                                                size="small"
                                                onClick={() => {
                                                    setThumbnailFile(null);
                                                    setThumbnailPreview(null);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <Upload
                                            beforeUpload={handleThumbnailUpload}
                                            showUploadList={false}
                                            accept=".jpg,.jpeg,.png,.gif"
                                        >
                                            <div className="text-center cursor-pointer py-8">
                                                <div className="text-4xl text-blue-500 mb-2">🖼️</div>
                                                <p className="text-blue-500 font-medium">Click to upload thumbnail</p>
                                                <p className="text-gray-500 text-sm mt-1">JPG, PNG, or GIF files</p>
                                            </div>
                                        </Upload>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            )}

            {/* Delete Confirmation Modal - Only for non-analysts */}
            {!isAnalyst && (
                <Modal
                    visible={isDeleteModalVisible}
                    onOk={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    footer={[
                        <Button key="cancel" onClick={handleDeleteCancel}>
                            Cancel
                        </Button>,
                        <Button key="delete" type="primary" className="bg-red-500 text-white" onClick={handleDeleteOk}>
                            Delete
                        </Button>,
                    ]}
                    className="custom-delete-modal"
                >
                    <div className="flex items-center">
                        <span className="text-red-500 mr-2 text-2xl">🗑️</span>
                        <div>
                            <h3 className="font-semibold">Delete this item</h3>
                            <p>Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.</p>
                        </div>
                    </div>
                </Modal>
            )}

            {/* View Modal - Accessible for all roles */}
            <Modal
                title={selectedItem ? selectedItem.title : ""}
                visible={isViewModalVisible}
                onCancel={handleViewCancel}
                footer={null}
                width={800}
                className="custom-view-modal"
            >
                {selectedItem && (
                    <div>
                        {selectedItem.fileType === 'video' ? (
                            <div className="mb-4">
                                <video 
                                    id="view-modal-video"
                                    controls 
                                    className="w-full h-64 object-cover mb-3 rounded-lg"
                                    poster={getFileUrl(selectedItem.thumbnailUrl)}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                >
                                    <source src={getFileUrl(selectedItem.fileUrl)} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                
                                {/* Custom Video Controls */}
                                <div className="flex flex-col space-y-2">
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full" 
                                            style={{ width: `${(currentTime / duration) * 100}%` }}
                                        ></div>
                                    </div>
                                    
                                    {/* Control Buttons */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <button 
                                                className="text-gray-600 hover:text-gray-800 text-xl"
                                                onClick={handleSeekBack}
                                                title="Rewind 10s"
                                            >
                                                ⏪
                                            </button>
                                            <button 
                                                className="text-gray-600 hover:text-gray-800 text-2xl"
                                                onClick={handlePlayPause}
                                                title={isPlaying ? 'Pause' : 'Play'}
                                            >
                                                {isPlaying ? '⏸️' : '▶️'}
                                            </button>
                                            <button 
                                                className="text-gray-600 hover:text-gray-800 text-xl"
                                                onClick={handleSeekForward}
                                                title="Forward 10s"
                                            >
                                                ⏩
                                            </button>
                                            <button 
                                                className="text-gray-600 hover:text-gray-800 text-xl"
                                                onClick={handleVolumeToggle}
                                                title={isMuted ? 'Unmute' : 'Mute'}
                                            >
                                                {isMuted ? '🔇' : '🔊'}
                                            </button>
                                        </div>
                                        
                                        {/* Time Display */}
                                        <div className="text-sm text-gray-600">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-gray-100 rounded-lg mb-4">
                                <div className="text-6xl mb-4">{getFileIcon(selectedItem.fileType)}</div>
                                <p className="text-gray-600 text-lg mb-2">{selectedItem.fileType?.toUpperCase()} Document</p>
                                <a 
                                    href={getFileUrl(selectedItem.fileUrl)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-500 hover:underline font-medium"
                                >
                                    View {selectedItem.fileType?.toUpperCase()}
                                </a>
                            </div>
                        )}
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Description:</h4>
                            <p className="text-gray-700">{selectedItem.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Category:</span> {selectedItem.category}
                            </div>
                            <div>
                                <span className="font-medium">File Type:</span> {selectedItem.fileType}
                            </div>
                            <div>
                                <span className="font-medium">Created:</span> {formatDate(selectedItem.createdAt)}
                            </div>
                            <div>
                                <span className="font-medium">Updated:</span> {formatDate(selectedItem.updatedAt)}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit Modal - Only for non-analysts */}
            {!isAnalyst && (
                <Modal
                    title="Edit Library"
                    visible={isEditModalVisible}
                    onOk={handleEditOk}
                    onCancel={handleEditCancel}
                    confirmLoading={isUpdating}
                    footer={[
                        <Button key="cancel" onClick={handleEditCancel} disabled={isUpdating}>
                            Cancel
                        </Button>,
                        <Button 
                            key="submit" 
                            type="primary" 
                            className="bg-green-500 text-white" 
                            onClick={handleEditOk}
                            loading={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update'}
                        </Button>,
                    ]}
                    className="custom-edit-modal"
                    width={800}
                >
                    {selectedItem && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title *</label>
                                    <Input 
                                        value={selectedItem.title} 
                                        onChange={(e) => setSelectedItem({...selectedItem, title: e.target.value})}
                                        placeholder="Title (Required)" 
                                        size="large"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <TextArea 
                                        value={selectedItem.description} 
                                        onChange={(e) => setSelectedItem({...selectedItem, description: e.target.value})}
                                        placeholder="Description" 
                                        rows={4}
                                        showCount
                                        maxLength={500}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <Dropdown overlay={categoryMenu}>
                                        <Button className="w-full text-left h-10 flex items-center justify-between">
                                            <span>{selectedItem.category}</span>
                                            <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">File Type</label>
                                    <Dropdown overlay={typeMenu}>
                                        <Button className="w-full text-left h-10 flex items-center justify-between">
                                            <span>{selectedItem.fileType?.toUpperCase()}</span>
                                            <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
                                <img 
                                    src={getThumbnailUrl(selectedItem)} 
                                    alt={selectedItem.title} 
                                    className="w-full h-48 object-cover mb-3 rounded-lg"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedItem.title)}&background=random`;
                                    }}
                                />
                                <p className="text-sm text-gray-600 text-center mb-3">
                                    Current: {selectedItem.fileType?.toUpperCase()} file
                                </p>
                                <div className="flex gap-2">
                                    <Upload
                                        beforeUpload={handleMainFileUpload}
                                        showUploadList={false}
                                        accept={getAcceptedFileTypes()}
                                    >
                                        <Button type="dashed" size="small">
                                            Change File
                                        </Button>
                                    </Upload>
                                    <Upload
                                        beforeUpload={handleThumbnailUpload}
                                        showUploadList={false}
                                    >
                                        <Button type="dashed" size="small">
                                            Change Thumbnail
                                        </Button>
                                    </Upload>
                                </div>
                                {(mainFile || thumbnailFile) && (
                                    <div className="mt-3 text-xs text-green-600 text-center">
                                        New files selected for upload
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default Library;
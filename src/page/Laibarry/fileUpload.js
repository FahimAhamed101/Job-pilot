// utils/fileUpload.js

// Get base URL from environment variables
const BASE_URL = import.meta.env.REACT_APP_API_URL || import.meta.env.REACT_APP_BASE_URL || 'http://localhost:5000';

export const uploadLibraryItem = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/library/create`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      let errorMessage = `Upload failed: ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the text
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const updateLibraryItem = async (id, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/library/update/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Update failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};

export const deleteLibraryItem = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/library/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

export const getAllLibraryItems = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/library/get-all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const getLibraryItemById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/library/get/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
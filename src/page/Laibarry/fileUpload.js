// utils/fileUpload.js
export const uploadLibraryItem = async (formData) => {
  try {
    const response = await fetch('https://unirenic-twittery-cammie.ngrok-free.dev/api/v1/library/create', {
      method: 'POST',
      body: formData,
      // Don't set any headers - let browser set Content-Type automatically
      headers: {
        // Remove any authorization headers if they're causing issues
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Optional
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
    const response = await fetch(`https://unirenic-twittery-cammie.ngrok-free.dev/api/v1/library/update/${id}`, {
      method: 'PUT',
      body: formData,
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
import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_API_URL;
const BASE_URL = `${baseURL}/scripts`;
const authToken = localStorage.getItem('Authorization');

// Type guard to check if the error is an instance of Error
const isError = (error: unknown): error is Error => {
  return (error as Error).message !== undefined;
};

// Function to create a new script
export const createScript = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, data, {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Include the authentication token in the header
      },
    });

    console.log("scriptService response: "+JSON.stringify(response));
    if (response.status === 201) {
      return { success: true, message: 'Script creation successful' , data: response.data};
    } else {
      return { success: false, message: 'Script creation failed' };
    }
  } catch (error) {
    if (isError(error)) {
      return { success: false, message: 'Script creation failed', error: error.message };
    } else {
      return { success: false, message: 'Script creation failed', error: 'Unknown error occurred' };
    }
  }
};

// Function to get a list of all scripts
export const getScripts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list-scripts`, {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Include the authentication token in the header
      },
    });

    if (response.status === 200) {
      console.log("scriptService 200: ", response);
      return { success: true, message: 'Scripts retrieved successfully', scripts: response.data };
    } else {
      return { success: false, message: 'Failed to retrieve scripts' };
    }
  } catch (error) {
    if (isError(error)) {
      return { success: false, message: 'Failed to retrieve scripts', error: error.message };
    } else {
      return { success: false, message: 'Failed to retrieve scripts', error: 'Unknown error occurred' };
    }
  }
};

// Function to update a specific script
export const updateScript = async (scriptId: string, data: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${scriptId}`, data, {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Include the authentication token in the header
      },
    });

    if (response.status === 200) {
      return { success: true, message: 'Script updated successfully' };
    } else {
      return { success: false, message: 'Failed to update the script' };
    }
  } catch (error) {
    if (isError(error)) {
      return { success: false, message: 'Failed to update the script', error: error.message };
    } else {
      return { success: false, message: 'Failed to update the script', error: 'Unknown error occurred' };
    }
  }
};

// Function to delete a script
export const deleteScript = async (scriptId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${scriptId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Include the authentication token in the header
      },
    });

    if (response.status === 200) {
      return { success: true, message: 'Script deleted successfully' };
    } else {
      return { success: false, message: 'Failed to delete the script' };
    }
  } catch (error) {
    if (isError(error)) {
      return { success: false, message: 'Failed to delete the script', error: error.message };
    } else {
      return { success: false, message: 'Failed to delete the script', error: 'Unknown error occurred' };
    }
  }
};

// Function to view a specific script
export const viewScript = async (scriptId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/view/${scriptId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Include the authentication token in the header
      },
    });

    if (response.status === 200) {
      return { success: true, message: 'Script retrieved successfully', data: response.data };
    } else {
      return { success: false, message: 'Failed to retrieve the script' };
    }
  } catch (error) {
    if (isError(error)) {
      return { success: false, message: 'Failed to retrieve the script', error: error.message };
    } else {
      return { success: false, message: 'Failed to retrieve the script', error: 'Unknown error occurred' };
    }
  }
};

// Function to submit title suggestions
export const suggestTitles = async (token: string, { synopsis }: { synopsis: string }) => {
  try {
    console.log("token suggest titles: " + token, "synopsis: "+ synopsis);
    const response = await axios.post(`${BASE_URL}/title-suggestions`, { synopsis }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.titles;
  } catch (error) {
    if (isError(error)) {
      return { success: false, message: 'Failed to suggest titles', error: error.message };
    } else {
      return { success: false, message: 'Failed to suggest titles', error: 'Unknown error occurred' };
    }
  }
};

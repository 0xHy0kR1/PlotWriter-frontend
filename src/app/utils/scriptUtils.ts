import { getScripts } from '../services/scriptService';

export const fetchScripts = async (setLoading: (loading: boolean) => void, setScripts: (scripts: any[]) => void) => {
  try {
    setLoading(true); // Set loading to true when fetching starts

    // Simulate a delay (0.5 second) before fetching data
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await getScripts(); // Adjust this based on your actual API call
    const scripts = response.scripts; // Access the scripts property
    setScripts(scripts);

    setLoading(false); // Set loading to false when fetching is complete
  } catch (error) {
    console.error('Error fetching scripts:', error);
    setLoading(false); // Make sure to set loading to false in case of an error
  }
};

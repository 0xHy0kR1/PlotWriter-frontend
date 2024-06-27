import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createScript, suggestTitles, getScripts } from '../../../../services/scriptService';
import { toast } from 'react-toastify';

// Define the shape of the script-related state
interface Script {
  id: string;
  title: string;
  updatedAt: string;
  genre?: string;
  synopsis: string;
  socialMedia?: string;
}


interface ScriptState {
  scripts: Array<Script>;
  titleSuggestions: Array<string>;
  fetchingScripts: boolean; // Separate loading state for fetching scripts
  fetchingTitleSuggestions: boolean; // Separate loading state for fetching title suggestions
  error: string | null;
}

// Initialize the state
const initialState: ScriptState = {
  scripts: [],
  titleSuggestions: [],
  fetchingScripts: false,
  fetchingTitleSuggestions: false,
  error: null,
};

// Async thunk for fetching scripts
export const fetchScripts = createAsyncThunk<Script[], void, { rejectValue: string }>(
  'scripts/fetchScripts',
  async (_, { rejectWithValue }) => {
    try {
      const authDataString = localStorage.getItem('kt-auth-react-v');
      if (!authDataString) {
        throw new Error('User authentication data not found in localStorage');
      }

      const authData = JSON.parse(authDataString);
      const token = authData?.api_token;

      if (!token) {
        throw new Error('User token not found in authentication data');
      }

      const response = await getScripts(); // Assuming getScripts fetches scripts
      if (response.success) {
        return response.scripts; // Assuming scripts are returned as response.scripts
      } else {
        throw new Error(response.message); // Handle error response
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching title suggestions based on a given synopsis
export const fetchTitleSuggestions = createAsyncThunk<string[], string, { rejectValue: string }>(
  'scripts/fetchTitleSuggestions',
  async (synopsis, { rejectWithValue }) => {
    try {
      const authDataString = localStorage.getItem('kt-auth-react-v');
      if (!authDataString) {
        throw new Error('User authentication data not found in localStorage');
      }

      const authData = JSON.parse(authDataString);
      const token = authData?.api_token;

      if (!token) {
        throw new Error('User token not found in authentication data');
      }

      return await suggestTitles(token, { synopsis });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for submitting a new script
export const submitScript = createAsyncThunk<any, any, { rejectValue: string }>(
  'scripts/submitScript',
  async (scriptData: any, { rejectWithValue }) => {
    try {
      const response = await createScript(scriptData);
      console.log("response from scriptSlice: ", response)
      if (response.success) {
        toast.success('Script created successfully!');
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error('Error creating script');
      return rejectWithValue(error.message);
    }
  }
);

// Create the script slice
const scriptSlice = createSlice({
  name: 'scripts',
  initialState,
  reducers: {
    // Reducer for adding a new script locally
    addScript: (state, action: PayloadAction<Script>) => {
      state.scripts.push(action.payload);
    },
    // Reducer to clear title suggestions
    clearTitleSuggestions: (state) => {
      state.titleSuggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state when fetching scripts
      .addCase(fetchScripts.pending, (state) => {
        state.fetchingScripts = true;
      })
      // Handle the fulfilled state when scripts are fetched successfully
      .addCase(fetchScripts.fulfilled, (state, action) => {
        state.scripts = action.payload;
        state.fetchingScripts = false;
      })
      // Handle the rejected state when fetching scripts fails
      .addCase(fetchScripts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.fetchingScripts = false;
      })
      // Handle the pending state when fetching title suggestions
      .addCase(fetchTitleSuggestions.pending, (state) => {
        state.fetchingTitleSuggestions = true;
        toast.info('Fetching title suggestions...');
      })
      // Handle the fulfilled state when title suggestions are fetched successfully
      .addCase(fetchTitleSuggestions.fulfilled, (state, action) => {
        state.titleSuggestions = action.payload;
        state.fetchingTitleSuggestions = false;
        toast.success('Title suggestions fetched successfully');
      })
      // Handle the rejected state when fetching title suggestions fails
      .addCase(fetchTitleSuggestions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.fetchingTitleSuggestions = false;
        toast.error('Error fetching title suggestions');
      })
      // Handle the pending state when submitting a script
      .addCase(submitScript.pending, (state) => {
        toast.info('Submitting script...');
      })
      // Handle the fulfilled state when a script is submitted successfully
      .addCase(submitScript.fulfilled, (state, action) => {
        state.scripts.push(action.payload);
        state.fetchingScripts = false;
      })
      // Handle the rejected state when submitting a script fails
      .addCase(submitScript.rejected, (state, action) => {
        state.error = action.payload as string;
        state.fetchingScripts = false;
        toast.error('Error creating script');
      });
  },
});


export const { addScript, clearTitleSuggestions } = scriptSlice.actions;

export default scriptSlice.reducer;
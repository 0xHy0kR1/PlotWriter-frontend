import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createScript, suggestTitles, getScripts, getEditorContent  } from '../../../../services/scriptService';
import { toast } from 'react-toastify';

// Define the shape of the script-related state
interface Script {
  id: string;
  title: string;
  updatedAt: string;
  genre?: string;
  synopsis: string;
  socialMedia?: string;
  content?: string;
}


interface ScriptState {
  scripts: Array<Script>;
  titleSuggestions: Array<string>;
  fetchingScripts: boolean; // Separate loading state for fetching scripts
  fetchingTitleSuggestions: boolean; // Separate loading state for fetching title suggestions
  fetchingEditorContent: boolean; // Separate loading state for fetching editor content
  error: string | null;
  editorContent: {
    scriptSample: string;
    characters: string[];
    scenes: string[];
  } | null;
}

// Initialize the state
const initialState: ScriptState = {
  scripts: [],
  titleSuggestions: [],
  fetchingScripts: false,
  fetchingTitleSuggestions: false,
  fetchingEditorContent: false,
  error: null,
  editorContent: null,
};

// Async thunk for fetching editor content 
export const fetchEditorContent = createAsyncThunk<
{ scriptSample: string; characters: string[]; scenes: string[] }, 
{ id: string; synopsis: string; genre: string; socialMedia: string; content: string },
{ rejectValue: string } 
>(
    'scripts/fetchEditorContent',
    async(scriptData, { rejectWithValue }) => {
      try{
        const response = await getEditorContent(scriptData)
        if(response.success){
          console.log("response from fetchEditorContent: ", response)
          return response.data;
        } else{
          throw new Error(response.message);
        }
      } catch(error: any){
        return rejectWithValue(error.message);
      }
    }
  )

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
  async (scriptData: any, { rejectWithValue, dispatch }) => {
    try {
      console.log("scriptData submitScript thunk", scriptData)
      
      // Fetching editor content
      const editorContentResponse = await dispatch(fetchEditorContent({ 
        id: scriptData.id, 
        synopsis: scriptData.synopsis, 
        genre: scriptData.genre, 
        socialMedia: scriptData.socialMedia, 
        content: scriptData.content 
      }));
      if(fetchEditorContent.fulfilled.match(editorContentResponse)){
        const editorContent = editorContentResponse.payload;

        // Now create the script with the fetched editor content
        const scriptResponse = await createScript({ ...scriptData, ...editorContent})
        console.log("response from submitScript: ", scriptResponse)

        if(scriptResponse.success){
          toast.success('Script created successfully!');
          return scriptResponse.data;
        } else {
          throw new Error(scriptResponse.message);
        }
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
    // Reducer to update editor content
    updateEditorContent: (state, action: PayloadAction<string>) => { 
      if (state.editorContent) {
        state.editorContent.scriptSample = action.payload;
      }
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
      })
      // Handle the pending state when fetching editor content
      .addCase(fetchEditorContent.pending, (state)=>{
        toast.info('Fetching editor content...');
      })
      // Handle the fulfilled state when editor content is fetched successfully
      .addCase(fetchEditorContent.fulfilled, (state, action) => {
        state.editorContent = action.payload;
        toast.success('Script content fetched successfully')
      })
      // Handle the rejected state when fetching editor content fails
      .addCase(fetchEditorContent.rejected, (state, action) => {
        state.error = action.payload as string;
        toast.error('Error fetching editor content')
      })
  },
});


export const { addScript, clearTitleSuggestions, updateEditorContent } = scriptSlice.actions;

export default scriptSlice.reducer;
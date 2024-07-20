import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createScript, suggestTitles, getScripts, getEditorSampleContent, getScriptSampleById, updateScriptById, updateCharacterDetails, generateCharacterDescription  } from '../../../../services/scriptService';
import { toast } from 'react-toastify';


// Define the shape of the script-related state
interface Script {
  _id: string;
  title: string;
  updatedAt: string;
  genre?: string;
  synopsis?: string;
  socialMedia?: string;
  content?: string;
  scriptSample: string;
  characters?: string[];
  scenes?: string[];
}

interface ScriptResponse {
  _id: string;
  title: string;
  updatedAt: string;
  genre?: string;
  synopsis?: string;
  socialMedia?: string;
  content?: string;
  scriptSample: string;
  characters?: string[];
  scenes?: string[];
}

interface EditorContent {
  scriptSample: string;
  characters?: string[];
  scenes?: string[];
}

interface ScriptState {
  scripts: Array<Script>;
  titleSuggestions: Array<string>;
  fetchingScripts: boolean;
  fetchingTitleSuggestions: boolean;
  fetchingEditorContent: boolean;
  error: string | null;
  editorContent: EditorContent | null;
  characterDescription: string; 
}

interface updateCharacterData{
  scriptId: string;
  oldCharacterName: string;
  newCharacterName: string;
  characterDescription: string;
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
  characterDescription: '',
};

// Async thunk for fetching sample script for editor by its ID
export const fetchSampleScriptById = createAsyncThunk<
  ScriptResponse,
  string,
  {rejectValue: string }
>(
  'scripts/fetchSampleScriptById',
  async(scriptId, {rejectWithValue}) => {
    try{
      const response = await getScriptSampleById(scriptId);
      console.log("response: " + JSON.stringify(response));
      if(response.success){
        return response.data;
      } else{
        throw new Error(response.message);
      }
    } catch (error: any){
      return rejectWithValue(error.message);
    }
  }
)

// Async thunk for updating a script by its ID
export const updateScript = createAsyncThunk<
  Script,
  { id: string; title: string; genre?: string; synopsis?: string; content?: string; socialMedia?: string; scriptSample: string; characters?: string[]; scenes?: string[] },
  { rejectValue: string }
>(
  'scripts/updateScript',
  async(scriptData, { rejectWithValue}) => {
    try{
      const response = await updateScriptById(scriptData.id, scriptData)
      if(response.success){
        return response.data;
      } else{
        throw new Error(response.message);
      }
    } catch (error: any){
      return rejectWithValue(error.message);
    }
  }
);
// Async thunk for fetching editor content 
export const fetchEditorContent = createAsyncThunk<
EditorContent,
{ synopsis: string; genre: string; socialMedia: string; content: string },
{ rejectValue: string } 
>(
    'scripts/fetchEditorContent',
    async(scriptData, { rejectWithValue }) => {
      try{
        const response = await getEditorSampleContent(scriptData)
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
        synopsis: scriptData.synopsis, 
        genre: scriptData.genre, 
        socialMedia: scriptData.socialMedia, 
        content: scriptData.content 
      }));
      if(fetchEditorContent.fulfilled.match(editorContentResponse)){
        const editorContent = editorContentResponse.payload;

        // Now create the script with the fetched editor content
        const scriptResponse = await createScript({ ...scriptData, ...editorContent})

        if(scriptResponse.success){
          // toast.success('Script created successfully!');
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

// Async thunk for generating character description
export const generateCharacterDesc = createAsyncThunk<
  {description: string},
  string,
  {rejectValue: string}
>(
  'scripts/generateCharacterDesc',
  async(briefDescription, {rejectWithValue }) => {
    try{
      const response = await generateCharacterDescription(briefDescription);
      if(response.success){
        return response.data;
      } else{
        throw new Error(response.message);
      }
    } catch(error: any){
      return rejectWithValue(error.message);
    }
  }
)

// Async thunk for updating character details
export const updateCharacter = createAsyncThunk<
  any,
  updateCharacterData,
  {rejectValue: string}
>(
  'scripts/updateCharacter',
  async (CharacterData: updateCharacterData, {rejectWithValue }) => {
    try{
      const { scriptId, oldCharacterName, newCharacterName, characterDescription } = CharacterData;
      const response = await updateCharacterDetails(scriptId, oldCharacterName, newCharacterName, characterDescription)
      if(response.success){
        return response.data;
      } else{
        throw new Error(response.message);
      } 
    } catch (error: any){
      return rejectWithValue(error);
    }
  }
)

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
        console.log("action.payload.length titles: ", action.payload.length);
        if (!Array.isArray(action.payload)) {
          toast.warn('Please give different synopsis data');
        } else if (action.payload.length === 0) {
          toast.warn('Please give different synopsis data');
        } else {
          toast.success('Title suggestions fetched successfully');
        }
      })
      // Handle the rejected state when fetching title suggestions fails
      .addCase(fetchTitleSuggestions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.fetchingTitleSuggestions = false;
        toast.error('Error fetching title suggestions');
      })
      // Handle the pending state when submitting a script
      .addCase(submitScript.pending, (state) => {
        // toast.info('Submitting script...');
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
      .addCase(fetchEditorContent.pending, (state) => {
        state.fetchingEditorContent = true;
        toast.info('Fetching editor content...');
      })
      // Handle the fulfilled state when editor content is fetched successfully
      .addCase(fetchEditorContent.fulfilled, (state, action) => {
        state.editorContent = action.payload;
        state.fetchingEditorContent = false;
        toast.success('Script content fetched successfully');
      })
      // Handle the rejected state when fetching editor content fails
      .addCase(fetchEditorContent.rejected, (state, action) => {
        state.error = action.payload as string;
        state.fetchingEditorContent = false;
        toast.error('Error fetching editor content');
      })
      // Handle the pending state when fetching sample script by ID
      .addCase(fetchSampleScriptById.pending, (state) => {
        toast.info('Fetching sample script...');
      })
      // Handle the fulfilled state when the sample script is fetched successfully
      .addCase(fetchSampleScriptById.fulfilled, (state, action) => {
        console.log("action.payload fetchSampleScriptById: scriptSlice.ts", action.payload);
        state.editorContent = {
          scriptSample: action.payload.scriptSample || '',
          characters: action.payload.characters,
          scenes: action.payload.scenes
        };
        toast.success('Sample script fetched successfully');
      })
      // Handle the rejected state when fetching the sample script fails
      .addCase(fetchSampleScriptById.rejected, (state, action) => {
        state.error = action.payload as string;
        toast.error('Error fetching sample script');
      })
      // Handle the pending state when updating a script
      .addCase(updateScript.pending, (state) => {
        toast.info('Updating script...');
      })
      .addCase(updateScript.fulfilled, (state, action) => {
        toast.success('Script updated successfully!');
      })
      
      // Handle the rejected state when updating a script fails
      .addCase(updateScript.rejected, (state, action) => {
        state.error = action.payload as string;
        toast.error('Error updating script');
      })

      // Handle the pending state when updating a character
      .addCase(updateCharacter.pending, (state) => {
        toast.info('Updating character...');
      })
      // Handle the fulfilled state when a character is updated successfully
      .addCase(updateCharacter.fulfilled, (state, action) => {
        toast.success('Character updated successfully');
        // Update the character in the state
        const { scriptId, oldCharacterName, newCharacterName, characterDescription } = action.meta.arg;
        const script = state.scripts.find(script => script._id === scriptId);
        if(script && script.characters){
          const characterIndex = script.characters.indexOf(oldCharacterName);
          if(characterIndex > -1){
            script.characters[characterIndex] = newCharacterName;
          }
        }
      })
      // Handle the rejected state when updating a character fails 
      .addCase(updateCharacter.rejected, (state, action) => {
        state.error = action.payload as string;
        toast.error('Error updating character');
      })

      //Handle the pending state when generating a character description
      .addCase(generateCharacterDesc.pending, (state) => {
        toast.info('Generating character description...');
      })

      // Handle the fulfilled state when a character description is generated
      .addCase(generateCharacterDesc.fulfilled, (state, action) => {
        state.characterDescription = action.payload.description;
        toast.success('Character description generated successfully!');
      })

      // Handle the rejected state when generating a character description fails
      .addCase(generateCharacterDesc.rejected, (state, action) => {
        state.error = action.payload as string;
        toast.error('Error generating character description');
      })
  },
});

export const { addScript, clearTitleSuggestions, updateEditorContent } = scriptSlice.actions;

export default scriptSlice.reducer;
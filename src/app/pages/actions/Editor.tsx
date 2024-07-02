import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Divider, Drawer, List, ListItem, ListItemText } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import CommentIcon from '@mui/icons-material/Comment';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CharacterModal from './../../modules/modals/CharacterModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './../../../app/modules/apps/scripts/store';
import { updateEditorContent } from './../../../app/modules/apps/scripts/features/scriptSlice';

const MyEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [copilot, setCopilot] = useState(false);
  const [isCharacterModalOpen, setCharacterModalOpen] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const handleToggleCopilot = () => setCopilot(!copilot);
  const dispatch = useDispatch();
  const { editorContent, fetchingEditorContent, error } = useSelector((state: RootState) => state.scripts);

  const parseContent = (content: string) => {
    // Use regular expressions to identify and wrap parts of the content
    let formattedContent = content
      .replace(/## (.*?) \*\*Logline:\*\*/g, '<h2>$1</h2><strong>Logline:</strong>') // For title and logline
      .replace(/\*\*Characters:\*\*/g, '<h3>Characters:</h3>') // For characters heading
      .replace(/\* \*\*(.*?):\*\*/g, '<p><strong>$1:</strong>') // For character names
      .replace(/^\*\*/gm, '<br><br><strong>') // For scene headings
      .replace(/\*\*$/, '</strong><br>') // For end of scene headings
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // For bold text
      .replace(/\* (.*?)$/gm, '<li>$1</li>'); // For list items
  
    return formattedContent;
  };

  useEffect(() => {
    if(editorRef.current && editorContent){
      const formattedContent = parseContent(editorContent.scriptSample)
      editorRef.current.innerHTML = formattedContent;
    }
    console.log("editorContent: " + JSON.stringify(editorContent));
  }, [editorContent])

  const handleCharacterClick = () => {
    setCharacterModalOpen(true);
  };

  const handleEditorChange = (event: React.FormEvent<HTMLDivElement>) => {
    const content = event.currentTarget.innerHTML;
    dispatch(updateEditorContent(content));
  };

  const toggleScenes = () => {
    setShowScenes(!showScenes);
    setShowCharacters(false);
  };

  const toggleCharacters = () => {
    setShowCharacters(!showCharacters);
    setShowScenes(false);
  };

  const handleUndo = () => {
    document.execCommand('undo');
  };

  const handleRedo = () => {
    document.execCommand('redo');
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML;
    console.log('Saved content:', content);
  };

  const handleDownload = () => {
    const content = editorRef.current?.innerHTML;
    const blob = new Blob([content || ''], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content.html';
    link.click();
  };

  function handleSceneClick(scene: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Box display="flex" height="100vh" sx={{ backgroundColor: '#d1d6e5' }}>
      {/* Sidebar */}
      <Drawer variant="permanent" anchor="left">
        <Box width={250} display="flex" flexDirection="column" height="100vh">
          <Box>
            <Typography
              variant="h6"
              sx={{
                p: 2,
                cursor: 'pointer',
                color: showScenes ? 'blue' : 'inherit',
                borderBottom: showScenes ? '2px solid blue' : 'none'
              }}
              onClick={toggleScenes}
            >
              Scenes
            </Typography>
            {showScenes && (
              <List sx={{ border: '2px solid black', overflowY: 'auto', flexGrow: 1 }}>
                {editorContent?.scenes.map((scene, index) => (
                  <ListItem button key={index} onClick={() => handleSceneClick(scene)}>
                    <ListItemText primary={scene} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          <Divider />
          <Box>
            <Typography
              variant="h6"
              sx={{
                p: 2,
                cursor: 'pointer',
                color: showCharacters ? 'blue' : 'inherit',
                borderBottom: showCharacters ? '2px solid blue' : 'none'
              }}
              onClick={toggleCharacters}
            >
              Characters
            </Typography>
            {showCharacters && (
              <List sx={{ border: '2px solid black', overflowY: 'auto', flexGrow: 1 }}>
                {editorContent?.characters.map((character, index) => (
                  <ListItem button key={index} onClick={handleCharacterClick}>
                    <ListItemText primary={character} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Main Editor */}
      <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {/* Top Toolbar */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          borderBottom={1}
          sx={{
            position: 'relative',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: "2px solid black"
          }}
        >
          <Button variant="contained" onClick={handleToggleCopilot}>
            {copilot ? "Copilot is ON" : "Copilot is OFF"}
          </Button>
          <Box>
            <IconButton onClick={handleUndo}><UndoIcon /></IconButton>
            <IconButton onClick={handleRedo}><RedoIcon /></IconButton>
            <IconButton onClick={handleSave}><SaveIcon /></IconButton>
            <IconButton onClick={handleDownload}><FileDownloadIcon /></IconButton>
            <IconButton><HistoryIcon /></IconButton>
            <IconButton><FormatPaintIcon /></IconButton>
            <IconButton><CommentIcon /></IconButton>
            <IconButton><LightbulbIcon /></IconButton>
          </Box>
        </Box>

        {/* Editor Content */}
        <Box
          ref={editorRef}
          contentEditable
          sx={{
            height: 'calc(100vh - 120px)',
            width: '80%',
            maxWidth: '800px',
            marginTop: '80px',
            border: '1px solid #ccc',
            padding: '16px',
            overflow: 'auto',
            backgroundColor: 'white',
            outline: 'none',
            '& h2': { fontSize: '1.5em', margin: '0.5em 0' },
            '& h3': { fontSize: '1.2em', margin: '0.5em 0' },
            '& p': { margin: '0.5em 0' },
            '& strong': { fontWeight: 'bold' },
            '& li': { margin: '0.5em 0', listStyleType: 'disc', marginLeft: '20px' },
            '& br': { display: 'block', margin: '0.5em 0' },
          }}
          onInput={handleEditorChange}
        ></Box>
      </Box>

      {/* Character Modal */}
      <CharacterModal isOpen={isCharacterModalOpen} onClose={() => setCharacterModalOpen(false)} />
    </Box>
  );
};

export default MyEditor;

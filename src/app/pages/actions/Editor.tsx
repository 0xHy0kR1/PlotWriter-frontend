import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, IconButton, Typography, Divider, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
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
import { RootState, AppDispatch } from './../../../app/modules/apps/scripts/store';
import { updateEditorContent, fetchSampleScriptById, updateScript } from './../../../app/modules/apps/scripts/features/scriptSlice';
import "./Editor.css";

const MyEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [copilot, setCopilot] = useState(false);
  const [isCharacterModalOpen, setCharacterModalOpen] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const handleToggleCopilot = () => setCopilot(!copilot);
  const dispatch = useDispatch<AppDispatch>();
  const { editorContent } = useSelector((state: RootState) => state.scripts);
  const { scriptId } = useParams<{ scriptId: string}>(); // Extracting scriptId from url
  const [script, setScript] = useState<any>(null);
  
  
  const parseContent = (content: string) => {
    let sceneIndex = 0;
    let formattedContent = content
      .replace(/^## (.*?)$/gm, '<h1 style="color: black; font-size: 2rem">$1</h1>') // Title
      .replace(/^\*\*(Logline:.*?)\*\*$/gm, '<p><strong>$1</strong></p><br><br>') // Logline
      .replace(/^\*\*(Characters:)\*\*$/gm, '<h3 style="color: black;">$1</h3>') // Characters heading
      .replace(/^\*\s\*\*(.*?):\*\*(.*?)$/gm, '<p><strong>$1:</strong> $2</p>') // Character names
      .replace(/^\*\*(Scene \d+:.*?)\*\*$/gm, '<br><br><h4 style="color: black; text-align: center;"><strong>$1</strong></h4>')
      .replace(/^\*\*(INT\.|EXT\.)[^\*]*\*\*/gm, (match) => `<p id="scene-${sceneIndex++}" style="text-align: center;"><strong>${match}</strong></p><br>`)
      .replace(/^(\*\*[A-Za-z\s\.]+:\*\*\s*)([\s\S]*?)(?=\n\n|\n*$)/gm, '<p><strong>$1</strong>$2</p>') // Character dialogues
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/^Visual:\s*$/gm, '<strong>Visual:</strong>') // Visual heading
      .replace(/^Audio:\s*$/gm, '<strong>Audio:</strong>'); // Audio heading
  
    return formattedContent;
  };

  // Code for repositioning cursor position after content modification
  const getCaretPosition = (el: HTMLElement) => {
    let caretOffset = 0;
  
    // Get the document and window objects from the element
    const doc = el.ownerDocument;
    const win = doc.defaultView;
  
    // Get the current selection in the window
    const sel = win?.getSelection();
  
    // If there is a selection and it has at least one range
    if (sel && sel.rangeCount > 0) {
      // Get the first range in the selection
      const range = sel.getRangeAt(0);
  
      // Create a clone of the range to calculate the caret position
      const preCaretRange = range.cloneRange();
  
      // Set the start of the range to the start of the element
      preCaretRange.selectNodeContents(el);
  
      // Set the end of the range to the end of the current selection
      preCaretRange.setEnd(range.endContainer, range.endOffset);
  
      // The length of the range text is the caret position
      caretOffset = preCaretRange.toString().length;
    }
  
    return caretOffset;
  };
  
  const setCaretPosition = (el: HTMLElement, offset: number) => {
    // Create a new range and get the current selection in the window
    const range = document.createRange();
    const sel = window.getSelection();
    if (!sel) return;
  
    let charIndex = 0;
    // Initialize the stack with the given element
    const nodeStack: (Node | null)[] = [el];
    let node: Node | null = null;
    let foundStart = false;
    let stop = false;
  
    // Process the stack until it's empty or we find the position
    while (!stop && (node = nodeStack.pop() ?? null)) {
      // If the node is a text node
      if (node.nodeType === 3) {
        const nextCharIndex = charIndex + (node.textContent?.length || 0);
  
        // Check if the offset is within this text node
        if (!foundStart && offset >= charIndex && offset <= nextCharIndex) {
          // Set the start of the range
          range.setStart(node, offset - charIndex);
          foundStart = true;
        }
        if (foundStart && offset >= charIndex && offset <= nextCharIndex) {
          // Set the end of the range and stop the loop
          range.setEnd(node, offset - charIndex);
          stop = true;
        }
        // Update the character index
        charIndex = nextCharIndex;
      } else {
        // If the node is not a text node, push its child nodes to the stack
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }
  
    // Clear any existing ranges and set the new range
    sel.removeAllRanges();
    sel.addRange(range);
  };

    // Type guard to check if editorContent is not null
    function isEditorContent(content: any): content is { scriptSample: string; characters: string[]; scenes: string[] } {
      return content !== null && typeof content === 'object' && 'scriptSample' in content && 'characters' in content && 'scenes' in content;
    }

  
  useEffect(() => {
    console.log("scriptId", scriptId);
    if (scriptId) {
      dispatch(fetchSampleScriptById(scriptId))
        .then((action) => {
          if (action.payload) {
            setScript(action.payload);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch script:", error);
        });
    }
  }, [scriptId, dispatch]);

  useEffect(() => {
    console.log("editorContent: ", editorContent);
    if(editorRef.current && editorContent){
      const formattedContent = parseContent(editorContent.scriptSample)
      console.log("formattedContent: ", formattedContent);
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

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const caretPos = getCaretPosition(editorRef.current);
    handleEditorChange;
    setCaretPosition(editorRef.current, caretPos);
  }, [handleEditorChange]);


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
    if(!editorRef.current || !scriptId) return;

    const content = editorRef.current?.innerHTML;
    console.log('Saved content:', content);

    const updatedScript = {
      id: scriptId,
      title: script.title || "Default Title", // Replace with actual title if available
      genre: script.genre || "Default Genre", // Replace with actual genre if available
      synopsis: script.synopsis || "Default Synopsis", // Replace with actual synopsis if available
      content: script.content || "Default Content", // Replace with actual content if available
      socialMedia: script.socialMedia || "Default SocialMedia", // Replace with actual socialMedia if available
      scriptSample: content || "Default scriptSample", 
      characters: editorContent?.characters,
      scenes: editorContent?.scenes,
    }

    dispatch(updateScript(updatedScript))
    .unwrap()
    .then((result) => {
      console.log('Update script success:', result);
    })
    .catch((error) => {
      console.error('Update script error:', error);
    });
  };

  const handleDownload = () => {
    const content = editorRef.current?.innerHTML;
    const blob = new Blob([content || ''], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content.html';
    link.click();
  };

  const handleSceneClick = (scene: string) => {
    const sceneElements = document.querySelectorAll(`[id^="scene-"]`);
    sceneElements.forEach((el) => {
      if (el.innerHTML.includes(scene)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight');
        setTimeout(() => {
          el.classList.remove('highlight');
        }, 2000);
      }
    });
  };

  if (!isEditorContent(editorContent)) {
    return <div>Loading...</div>; // or some other loading state if editorContent is not ready
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
              }}
              onClick={toggleScenes}
            >
              Scenes
            </Typography>
            {showScenes && (
              <List sx={{overflowY: 'auto', flexGrow: 1 }}>
                {editorContent.scenes.map((scene: string, index: number) => (
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
              }}
              onClick={toggleCharacters}
            >
              Characters
            </Typography>
            {showCharacters && (
              <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {editorContent.characters.map((character: string, index: number) => (
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
          sx={{
            position: 'relative',
            top: 35,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            height: '7%',
            borderRadius: '3px'
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
          onInput={handleInput}
          sx={{
            color: 'black',
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
        ></Box>
      </Box>

      {/* Character Modal */}
      <CharacterModal isOpen={isCharacterModalOpen} onClose={() => setCharacterModalOpen(false)} />
    </Box>
  );
};

export default MyEditor;

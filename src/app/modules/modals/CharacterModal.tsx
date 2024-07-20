import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Button, Modal, useTheme, TextField, Select, MenuItem, Typography, Divider, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import characterPageUser from '../../../../public/media/avatars/user_character_page.png';
import { updateCharacter } from '../apps/scripts/features/scriptSlice';
import { generateCharacterDesc } from '../apps/scripts/features/scriptSlice'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../apps/scripts/store';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptId: string;
  oldCharacterName: string;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, onClose, scriptId, oldCharacterName }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [style, setStyle] = useState('');
  // const selectCharacterDescription = () => state.script.characterDescription;
  const selectCharacterDescription = useSelector((state: RootState) => state.scripts.characterDescription);

  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary;
  const dispatch = useDispatch();

  useEffect(() => {
    setCharacterDescription(selectCharacterDescription);
  }, [selectCharacterDescription]);

  const handleGenerateDescription = async () => {
    const result = dispatch(generateCharacterDesc(description) as any);
    console.log("selected description generated using gemini: ", selectCharacterDescription)
    setCharacterDescription(selectCharacterDescription);

    console.log("CharacterModal result: " + result);

    if(generateCharacterDesc.fulfilled.match(result)){
      console.log("CharacterModal result: " + result);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleGenerateImage = () => {
    // Logic to generate image
  };

  const handleSaveCharacter = async () => {
    if(!characterName || !characterDescription){
      alert('Please provide both character name and description');
      return;
    }
    const characterDetailData = {
      scriptId,
      oldCharacterName,
      newCharacterName: characterName,
      characterDescription,
    };
    const result = await dispatch(updateCharacter(characterDetailData) as any); // Cast to 'any' temporarily
    
    if (updateCharacter.fulfilled.match(result)) {
      onClose();
      setCharacterDescription(selectCharacterDescription);
    }

  }



  return (
    <Modal
      open={isOpen}
      onClose={(_, reason) => reason === 'backdropClick' ? null : onClose()} // Prevent closing on backdrop click
      aria-labelledby="character-modal-title"
      aria-describedby="character-modal-description"
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        {/* Main Box */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            p: 4,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            overflowY: 'auto',
            bgcolor: '#d1d6e5', // Background color set to white
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            width: '100%',
            height: '100vh',
            alignItems: 'start',
            gap: 3,
          }}
          >
            {/* Generate Character Description part */}
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '35%',
              alignItems: 'start',
              background: '#e9ebf2',
              padding: '22px',
              borderRadius: '10px',
            }}
            >
              {/* Describe your character’s individuality and PlotWriter will generate a detailed description */}
            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'grey' }} id="character-modal-title">
            Generate Character
            </Typography>
            <Divider sx={{ my: 2, width: '100%', border: '1px solid grey' }} />
              <Box>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <Typography variant="subtitle1" id="character-modal-title" sx={{ color: 'grey'}}>
                  Describe your character’s individuality and PlotWriter will generate a detailed description
                </Typography>
                <Button onClick={handleGenerateDescription} variant="contained" color="primary">
                  Generate Description
                </Button>
              </Box>
            </Box>

            {/* Box contains image generation and generated description part and buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
            {/* image generation and generated description part */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'start',
                background: '#e9ebf2',
                padding: '12px',
                borderRadius: '10px',
                width: '100%',  // Fixed width
                minHeight: '60vh', // Minimum height to ensure it starts with a reasonable size
              }}
            >
              <Typography variant="h6" sx={{fontWeight: 'bold', color: 'grey' }} id="character-modal-title">
                Character Details
            </Typography>
            <Divider sx={{ my: 2, width: '100%', border: '1px solid grey' }} />
              {/* Image generation part with button and select */}
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                gap: '15px',
                alignItems: 'start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',

                  gap: 1
                }}
              >            
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  
                  gap: 1
                }}
              ></Box>
                {image ? (
                    <Box
                    sx={{
                      backgroundColor: '#dde0eb',
                      width: '700px',
                      height: '800px',
                      border: '2px solid blue',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="User uploaded"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor: '#dde0eb',
                        width: '25vw',
                        height: '30vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img
                      src={characterPageUser}
                      alt="User uploaded"
                      style={{ width: '20%', height: '20%', objectFit: 'contain' }}
                    />
                    <Typography variant="h6" color="textSecondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                <Select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="Cinematic">Cinematic</MenuItem>
                  <MenuItem value="Sketch">Sketch</MenuItem>
                  <MenuItem value="Comic Book">Comic Book</MenuItem>
                  <MenuItem value="Digital Art">Digital Art</MenuItem>
                  <MenuItem value="Photographic">Photographic</MenuItem>
                </Select>
                <Button onClick={handleGenerateImage} variant="contained" color="primary" style={{ marginTop: '16px' }}>
                  Generate Image
                </Button>
              </Box>

              {/* character name and generated description part */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <TextField
                  label="Character Name"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Character Description"
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  fullWidth
                  margin="dense"
                  multiline
                  
                />
                <Typography variant="subtitle1" id="character-modal-title" sx={{ color: 'grey'}}>
                  Write a character description or let PlotWriter generate one based on Character Individuality
                </Typography>
              </Box>
              </Box>
            </Box>
            {/* Box contains buttons */}
          <Box
           sx={{ display: 'flex', justifyContent: 'flex-end' , width: '100%', gap: 3, mt: 2, mb: 2}}
          >
            <Button onClick={handleSaveCharacter} variant="contained" color="primary">
                  Save Character
                </Button>
            <Button onClick={handleSaveCharacter} variant="contained" color="error">
                  Delete Character
                </Button>
          </Box>
          {/* Box contain button end */}
          {/* Box contains image generation and generated description part and buttons-end */}
          </Box>
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
};

export default CharacterModal;

import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, Typography, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [style, setStyle] = useState('');

  const handleGenerateDescription = () => {
    // Logic to generate description
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleGenerateImage = () => {
    // Logic to generate image
  };


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
            bgcolor: 'white', // Background color set to white
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
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            gap: 22
          }}
          >
            {/* Generate Character Description part */}
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '40%',
              alignItems: 'start'
            }}
            >
            {/* Describe your character’s individuality and Nolan will generate a detailed description */}
            <Typography variant="h6" sx={{fontWeight: 'bold' }} id="character-modal-title">
            Generate Character
            </Typography>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Typography variant="subtitle1" id="character-modal-title" sx={{ color: 'grey'}}>
                Describe your character’s individuality and Nolan will generate a detailed description
              </Typography>
              <Button onClick={handleGenerateDescription} variant="contained" color="primary">
                Generate Description
              </Button>
            </Box>

            {/* file choosen and generated description part */}
            <Box>
              {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="User uploaded"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <Box>
                    <Typography variant="h6" color="textSecondary" sx={{ position: 'absolute' }}>
                      No Image
                    </Typography>
                    <IconButton alt="User uploaded or default" style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 0 }}>
                      <AccountCircleIcon />
                    </IconButton>
                  </Box>
                )}
              <Select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Cinematic">Cinematic</MenuItem>
                <MenuItem value="Sketch">Sketch</MenuItem>
                <MenuItem value="Comic Book">Comic Book</MenuItem>
                <MenuItem value="Digital Art">Digital Art</MenuItem>
                <MenuItem value="Photographic">Photographic</MenuItem>
              </Select>
              <TextField
                label="Character Name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Character Description"
                value={characterDescription}
                onChange={(e) => setCharacterDescription(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button onClick={handleGenerateImage} variant="contained" color="primary" style={{ marginTop: '16px' }}>
                Generate Image
              </Button>
            </Box>
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
};

export default CharacterModal;

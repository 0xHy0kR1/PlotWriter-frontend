import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Stack from "@mui/material/Stack";
import { useThemeMode } from "./../../../_metronic/partials/layout/theme-mode/ThemeModeProvider";
import FormControl from "@mui/material/FormControl";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { InputLabel, CircularProgress } from "@mui/material";
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../apps/scripts/store';
import { fetchTitleSuggestions, submitScript, clearTitleSuggestions } from './../apps/scripts/features/scriptSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 1,
};

const radioGroup = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 5,
};

const selectedStyle = {
  backgroundColor: "#d1dbf1",
  padding: "10px",
  borderRadius: "5px",
};

const bottomButtonAndSelection = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 2, // Ensure gap is set here
};

interface CreateScriptModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CreateScriptModal: React.FC<CreateScriptModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState("");
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genre, setGenre] = useState("");
  const [content, setContent] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const { mode } = useThemeMode();
  const titleSuggestions = useSelector((state: RootState) => state.scripts.titleSuggestions);
  const titlesLoading = useSelector((state: RootState) => state.scripts.fetchingTitleSuggestions);
  const editLoading = useSelector((state: RootState) => state.scripts.fetchingEditorContent);

  const error = useSelector((state: RootState) => state.scripts.error);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
// Disable submit buttons based on input fields
const isFeatureSubmitDisabled = !title || !synopsis || !genre;
const isShortSubmitDisabled = !title || !socialMedia || !content;


  const titleInputRef = useRef<null | HTMLInputElement>(null);

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);

  const navigate = useNavigate();

  const handleSubmit = () => {
    const data = {
      title,
      synopsis,
      genre,
      content,
      socialMedia,
    };
    dispatch(submitScript(data)).then((result) => {
      if (submitScript.fulfilled.match(result)) {
        console.log("result.payload in CreateScriptModal.tsx: ", result.payload)
        const scriptId = result.payload._id;
        console.log("result CreateScriptModal", result);
        onRequestClose();
        navigate(`/editor/${scriptId}`);
      }
    });
  };

  const handleSuggestTitles = () => {
    if (synopsis.trim()) {
      dispatch(clearTitleSuggestions());
      dispatch(fetchTitleSuggestions(synopsis));
      console.log("titleInputRef.current: ", titleInputRef.current)
      setAnchorEl(titleInputRef.current);
    } else {
      toast.error('Please provide a synopsis for title suggestions.');
    }
  };

  const handleTitleSelect = (selectedTitle: string) => {
    setTitle(selectedTitle);
    setAnchorEl(null);
  };

  
  

  const getBottomBorderStyle = () => ({
    "& .MuiOutlinedInput-root": {
      borderBottom: `2px solid ${
        mode === "dark" || mode === "system" ? "#fff" : "#000"
      }`,
      "&:hover fieldset": {
        borderBottomColor:
          mode === "dark" || mode === "system" ? "#fff" : "#000",
      },
      
      "&.Mui-focused fieldset": {
        borderBottomColor:
          mode === "dark" || mode === "system" ? "#fff" : "#000",
      },
      "& fieldset": {
        borderColor: "transparent",
      },
      "&.MuiInputBase-input": {
        color: 
          mode === "dark" || mode === "system" ? "#fff" : "#000"
      }
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  });

  const getSelectStyles = () => ({
    "& .MuiOutlinedInput-root": {
      borderBottom: `2px solid ${
        mode === "dark" || mode === "system" ? "#fff" : "#000"
      }`,
      "&:hover fieldset": {
        borderBottomColor:
          mode === "dark" || mode === "system" ? "#fff" : "#000",
      },
      "&.Mui-focused fieldset": {
        borderBottomColor:
          mode === "dark" || mode === "system" ? "#fff" : "#000",
      },
      "& fieldset": {
        borderColor: "transparent",
      },
      "& .MuiInputBase-input": {
        color: mode === "dark" || mode === "system" ? "#fff" : "#000",
      },
      "& .MuiSelect-select": {
        color: mode === "dark" || mode === "system" ? "#fff" : "#000",
      },
      "& .MuiSvgIcon-root": {
        color: mode === "dark" || mode === "system" ? "#fff" : "#000",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  });

  const modalStyle = {
    ...style,
    bgcolor: mode === "dark" || mode === "system" ? "#05090a" : "#fff",
    color: mode === "dark" || mode === "system" ? "#fff" : "#000",
    borderRadius: "17px",
    width: "40vw"
  };

  const labelColor = mode === "dark" || mode === "system" ? "#fff" : "#000";

  const buttonStyles = {
    color: mode === "dark" || mode === "system" ? "#fff" : "#000",
    borderColor: mode === "dark" || mode === "system" ? "#fff" : "#000",
  };

  const radioIconStyle = {
    color: mode === "dark" || mode === "system" ? "#fff" : "#000",
  };

  const menuItemHoverStyle = {
    "&:hover": {
      backgroundColor: mode === "dark" || "system" ? "#414A4C" : "#f0f0f0",
      color: mode === "dark" || "system" ? "#fff" : "#000",
      border: mode === "dark" || "system" ? "2px solid #fff" : "2px solid #000",
    },
    color: mode === "dark" || "system" ? "#000" : "#fff",
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" id="modal-title" sx={{ color: labelColor }}>
            Create a new script
          </Typography>
          <IconButton onClick={onRequestClose}>
            <CloseIcon sx={radioIconStyle} />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} orientation="horizontal" />
        {step === 1 && (
          <Box sx={bottomButtonAndSelection}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "light",
                color: labelColor,
              }}
            >
              Select the format you want to write a script for:
            </Typography>
            {/* Selection between "Feature Film" and "Video Short" */}
            <RadioGroup
              value={format}
              onChange={(e) => setFormat((e.target as HTMLInputElement).value)}
              sx={radioGroup}
            >
              <FormControlLabel
                value="feature"
                control={<Radio sx={radioIconStyle} />}
                label={
                  <div style={format === "feature" ? selectedStyle : {}}>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          format === "feature"
                            ? "#000"
                            : mode === "dark" || mode === "system"
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      Feature Film
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          format === "feature"
                            ? "#000"
                            : mode === "dark" || mode === "system"
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      Begin crafting your feature film screenplay with the
                      assistance of Co-Pilot's power.
                    </Typography>
                  </div>
                }
              />
              <FormControlLabel
                value="short"
                control={<Radio sx={radioIconStyle} />}
                label={
                  <div style={format === "short" ? selectedStyle : {}}>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          format === "short"
                            ? "#000"
                            : mode === "dark" || mode === "system"
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      Video Short
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          format === "short"
                            ? "#000"
                            : mode === "dark" || mode === "system"
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      Take your video shorts to new heights by utilizing AI to
                      craft your scripts in screenplay format.
                    </Typography>
                  </div>
                }
              />
            </RadioGroup>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
              sx={{ marginTop: 2 }}
            >
              <Button sx={buttonStyles} onClick={onRequestClose}>
                Cancel
              </Button>
              <Button
                sx={buttonStyles}
                onClick={handleNextStep}
                disabled={!format}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        )}
        {step === 2 && format === "feature" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            <Typography variant="h6">Feature Film Details</Typography>
            <TextField
              required
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                ...getBottomBorderStyle(),
                width: "100%",
                "& .MuiInputBase-input": {
                  color: labelColor,
                },
              }}
              InputLabelProps={{
                style: { color: labelColor },
              }}
              inputRef={titleInputRef}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: labelColor }}>
                Suggest titles based on the synopsis
              </Typography>
              <Button
                variant="outlined"
                onClick={handleSuggestTitles}
                sx={{
                  ...buttonStyles,
                  alignSelf: "flex-end",
                  backgroundColor:
                    mode === "dark" || mode === "system" ? "#333" : "#ccc",
                  "&:disabled": {
                    color:
                      mode === "dark" || mode === "system" ? "#aaa" : "#555", // Text color for disabled state
                    backgroundColor:
                      mode === "dark" || mode === "system" ? "#555" : "#eee", // Background color for disabled state
                    borderColor:
                      mode === "dark" || mode === "system" ? "#777" : "#ddd", // Border color for disabled state
                  },
                }}
                disabled={titlesLoading || !synopsis.trim()} // Disable the button while titlesLoading or if synopsis is empty
              >
                {titlesLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: buttonStyles.color }}
                  />
                ) : (
                  "Suggest Titles"
                )}
              </Button>
            </Box>
            {titleSuggestions.length > 0 && (
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <List>
                  {titleSuggestions.map((suggestion, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleTitleSelect(suggestion)}
                    >
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Popover>
            )}
            <TextField
              label="Synopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              InputLabelProps={{ style: { color: labelColor } }}
              InputProps={{
                // InputProps for placeholder color
                style: {
                  color: mode === "dark" || mode === "system" ? "#999" : "#555",
                }, // Adjust placeholder color based on mode
                placeholder: "Write a title about...", // Placeholder text
              }}
              sx={getBottomBorderStyle()}
              required
            />
            <FormControl sx={getSelectStyles()} fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: labelColor }}
              >
                Genre
              </InputLabel>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value as string)}
                fullWidth
                margin="dense"
                label="Genre"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: mode === "dark" || mode === "system" ? "#fff" : "#000",
                    },
                  },
                }}
              >
                <MenuItem value="action" sx={menuItemHoverStyle}>
                  Action
                </MenuItem>
                <MenuItem value="comedy" sx={menuItemHoverStyle}>
                  Comedy
                </MenuItem>
                <MenuItem value="drama" sx={menuItemHoverStyle}>
                  Drama
                </MenuItem>
                {/* Add other genres */}
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Button sx={buttonStyles} onClick={handlePreviousStep}>
                Back
              </Button>
              <Button
                variant="outlined"
                onClick={handleSubmit}
                disabled={isFeatureSubmitDisabled || editLoading}
                sx={{
                  ...buttonStyles,
                  alignSelf: "flex-end",
                  backgroundColor:
                    mode === "dark" || mode === "system" ? "#333" : "#ccc",
                  "&:disabled": {
                    color:
                      mode === "dark" || mode === "system" ? "#aaa" : "#555", // Text color for disabled state
                    backgroundColor:
                      mode === "dark" || mode === "system" ? "#555" : "#eee", // Background color for disabled state
                    borderColor:
                      mode === "dark" || mode === "system" ? "#777" : "#ddd", // Border color for disabled state
                  },
                }}
              >
                {editLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: buttonStyles.color }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Stack>
          </Box>
        )}
        {step === 2 && format === "short" && (
          <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
          >
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: labelColor } }} // Apply label color dynamically
              InputProps={{
                // InputProps for placeholder color
                style: {
                  color: mode === "dark" || mode === "system" ? "#999" : "#555",
                }, // Adjust placeholder color based on mode
                placeholder: "Write a video script about...", // Placeholder text
              }}
              sx={getBottomBorderStyle()}
              required
            />
            <FormControl sx={getSelectStyles()} fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: labelColor }}
              >
                Select Social Media
              </InputLabel>
              <Select
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.target.value as string)}
                fullWidth
                margin="dense"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: mode === "dark" || mode === "system" ? "#fff" : "#000",
                    },
                  },
                }}
              >
                <MenuItem value="tiktok" sx={menuItemHoverStyle}>
                  TikTok
                </MenuItem>
                <MenuItem value="instagram" sx={menuItemHoverStyle}>
                  Instagram Reel
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Script Summary"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              InputLabelProps={{ style: { color: labelColor } }} // Apply label color dynamically
              InputProps={{
                // InputProps for placeholder color
                style: {
                  color: mode === "dark" || mode === "system" ? "#999" : "#555",
                }, // Adjust placeholder color based on mode
                placeholder: "Write a video script about...", // Placeholder text
              }}
              sx={getBottomBorderStyle()}
            />

            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Button sx={buttonStyles} onClick={handlePreviousStep} variant="outlined">
                Back
              </Button>
              <Button
                variant="outlined"
                onClick={handleSubmit} 
                disabled={isShortSubmitDisabled}
                sx={{
                  ...buttonStyles,
                  alignSelf: "flex-end",
                  backgroundColor:
                    mode === "dark" || mode === "system" ? "#333" : "#ccc",
                  "&:disabled": {
                    color:
                      mode === "dark" || mode === "system" ? "#aaa" : "#555", // Text color for disabled state
                    backgroundColor:
                      mode === "dark" || mode === "system" ? "#555" : "#eee", // Background color for disabled state
                    borderColor:
                      mode === "dark" || mode === "system" ? "#777" : "#ddd", // Border color for disabled state
                  },
                }}
              >
                {editLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: buttonStyles.color }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CreateScriptModal;

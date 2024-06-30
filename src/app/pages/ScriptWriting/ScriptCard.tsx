import React from 'react';
import { Card, CardContent, Typography, Divider, IconButton, Stack, useTheme } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import BreakdownIcon from '@mui/icons-material/Assessment'; // Substitute with a relevant icon
import StoryboardIcon from '@mui/icons-material/DeveloperBoardSharp'; // Substitute with a relevant icon
import DeckIcon from '@mui/icons-material/Deck'; // Substitute with a relevant icon
import { formatDistanceToNow } from 'date-fns';

interface ScriptCardProps {
  script: {
    title: string;
    updatedAt: string;
    genre?: string;
    synopsis: string;
    socialMedia?: string;
    content: string;
  };
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script }) => {
  const theme = useTheme();
  const boxShadowColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const boxShadowColorHover = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
  const cardBackgroundColor = theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default;
  const textColor = theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary;
  const iconColor = theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark;

  console.log("script from ScriptCard: " + script);
  const { title, updatedAt, genre, synopsis, socialMedia, content } = script;

  const getGenreText = () => {
    if (genre === '') {
      return `Video Short, ${socialMedia}`;
    }
    return genre;
  };

  const LastEdited = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });

  return (
    <Card
      variant="outlined"
      sx={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 20px ${boxShadowColorHover}`,
        },
        boxShadow: `0 4px 8px ${boxShadowColor}`,
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: cardBackgroundColor,
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>{title}</Typography>
        <Typography variant="subtitle1" sx={{ color: textColor }}>{`Last edited ${LastEdited}`}</Typography>
        <Divider sx={{ my: 2, borderColor: textColor }} />
        <Stack direction="row" justifyContent="flex-start" spacing={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: textColor }}>Genre</Typography>
          <Typography variant="body2" sx={{ mb: 2, color: textColor }}>{getGenreText()}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-start" spacing={3.7} alignItems="center">
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: textColor }}>Synopsis</Typography>
          <Typography variant="body2" sx={{ color: textColor }}>{synopsis ? synopsis : content}</Typography>
        </Stack>
        <Divider sx={{ my: 2, borderColor: textColor }} />
        <Stack direction="row" justifyContent="space-between">
          <IconButton sx={{ color: iconColor }}>
            <ShareIcon />
          </IconButton>
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: iconColor }}>
              <EditIcon />
              <Typography variant="body2" sx={{ color: textColor }}>Editor</Typography>
            </IconButton>
            <IconButton sx={{ color: iconColor }}>
              <BreakdownIcon />
              <Typography variant="body2" sx={{ color: textColor }}>Breakdown</Typography>
            </IconButton>
            <IconButton sx={{ color: iconColor }}>
              <StoryboardIcon />
              <Typography variant="body2" sx={{ color: textColor }}>Storyboard</Typography>
            </IconButton>
            <IconButton sx={{ color: iconColor }}>
              <DeckIcon />
              <Typography variant="body2" sx={{ color: textColor }}>Deck</Typography>
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ScriptCard;

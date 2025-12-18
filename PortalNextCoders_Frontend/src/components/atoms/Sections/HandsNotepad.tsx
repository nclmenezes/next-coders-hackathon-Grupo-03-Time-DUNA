import { Box, Typography, Radio } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ListIcon from "@mui/icons-material/List";
import ArticleIcon from "@mui/icons-material/Article";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { ContentDto } from "../../../interfaces/StudentContents/Responses/Classes";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import VideocamIcon from '@mui/icons-material/Videocam';

interface props {
  content: ContentDto;
}

interface INotepad {
  iconType: string;
  title: string;
  enable: boolean;
}

const HandsNotepad = ({iconType, title, enable}: INotepad) => {

  const getContentIcon = (type: string) => {
    const color = enable ? "primary" : "disabled";

    const contentType: Record<string, JSX.Element> = {
      ["Live"]: <LiveTvIcon color={color} />,
      ["Gravada"]: <VideocamIcon color={color} />,
    };

    return contentType[type];
  };

  return (
    <Box
    //   key={content.id}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "45px",
        gap: 2,
        "&:hover": { backgroundColor: "#FFFFFF" },
        textTransform: "none",
        borderBottom: "1px solid #EBF0F3",
        justifyContent: "start",
        userSelect: 'none',
        cursor: enable ? "pointer" : "not-allowed",
        color: "default",
      }}
    >
      {getContentIcon(iconType)}

      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          color: enable ? "#212429" : "rgba(0, 0, 0, 0.26)",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default HandsNotepad;

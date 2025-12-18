import { Box, Typography, Radio } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ListIcon from "@mui/icons-material/List";
import ArticleIcon from "@mui/icons-material/Article";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import VideocamIcon from '@mui/icons-material/Videocam';
import {
  VIDEO_CONTENT_TYPE,
  ARTICLE_CONTENT_TYPE,
  ASSESSMENT_CONTENT_TYPE,
  LIVE_CONTENT_TYPE,
  RECORD_CONTENT_TYPE
} from "../../../constants/contentLayout/contentLayout";

interface IClassNotePadProps {
  isAllowed: boolean;
  isCompleted: boolean | null;
  isSelected: boolean;
  contentId: number;
  contentType: number;
  contentName: string;
};

const ClassNotepad = ({
  isAllowed,
  isCompleted,
  isSelected,
  contentId,
  contentType,
  contentName
}: IClassNotePadProps) => {
  const getContentIcon = () => {
    const color = isAllowed ? "primary" : "disabled";

    const contentIcon: Record<number, JSX.Element> = {
      [ARTICLE_CONTENT_TYPE]: <ArticleIcon color={color} />,
      [VIDEO_CONTENT_TYPE]: <PlayCircleOutlineIcon color={color} />,
      [ASSESSMENT_CONTENT_TYPE]: <ListIcon color={color} />,
      [LIVE_CONTENT_TYPE]: <LiveTvIcon color={color} />,
      [RECORD_CONTENT_TYPE]: <VideocamIcon color={color} />
    };

    return contentIcon[contentType];
  };

  return (
    <Box
      key={contentId}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: '5px 0',
        "&:hover": { backgroundColor: isSelected ? "rgba(25, 118, 210, 0.12)" : "white" },
        textTransform: "none",
        borderBottom: "1px solid #EBF0F3",
        justifyContent: "start",
        cursor: isAllowed ? "pointer" : "not-allowed",
        userSelect: 'none',
        color: "default",
        bgcolor: isSelected ? "rgba(25, 118, 210, 0.12)" : "white"
      }}
    >
      { isCompleted !== null &&
        <Radio
          checked={isCompleted}
          color={isAllowed ? "primary" : "info"}
          sx={{
            color: "#4263EB",
            cursor: isAllowed? "default" : "not-allowed",
          }}
        />
      }

      {getContentIcon()}

      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          color: isAllowed ? "#212429" : "rgba(0, 0, 0, 0.26)",
          fontWeight: 600,
          marginLeft: '5px'
        }}
      >
        {contentName}
      </Typography>
    </Box>
  );
}

export default ClassNotepad;

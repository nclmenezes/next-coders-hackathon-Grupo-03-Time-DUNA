import { Box, Typography } from "@mui/material";
import Player from "../../atoms/Player";
import LinkIcon from '@mui/icons-material/Link';
import LogoContent from "../../../assets/logo-content.jpeg";
import { ARTICLE_CONTENT_TYPE } from "../../../constants/contentLayout/contentLayout";

interface IClassContentProps {
  contentType: number;
  contentLink: string;
  contentLinkDescription: string;
  contentName: string;
  contentDescription: string;
};

const MClassContent = ({
  contentType,
  contentLink,
  contentLinkDescription,
  contentName,
  contentDescription
}: IClassContentProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: '100%' }}>
      {
        contentType === ARTICLE_CONTENT_TYPE ?
          <img src={LogoContent} alt="Content image" width="100%" height="400px"/> : 
          <Player url={contentLink} width="100%" height="600px" />
      }
      <Box>
        <Typography
          sx={{
            color: "#212429",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "24px",
            mt: 3,
          }}
        >
          {contentName}
        </Typography>

        <Typography
          sx={{
            color: "#495057",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "16px",
            mt: 1,
          }}
        >
          {contentDescription}
        </Typography>
        {
          contentType === ARTICLE_CONTENT_TYPE && contentLink !== null &&
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Link:
            <Box
              sx={{ display: "flex", color: "rgb(25, 118, 210)", alignItems: "center", userSelect: 'none', cursor: 'pointer' }}
              onClick={() => window.open(contentLink, "_blank")}
            >
              <LinkIcon color="primary" />
              {contentLinkDescription}
            </Box>
          </Box>
        }
      </Box>
    </Box>
  );
};

export default MClassContent;
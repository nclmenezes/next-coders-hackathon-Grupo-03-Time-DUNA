import { Box, Button, Typography } from "@mui/material";

import maskGreen from "../../../assets/Training/masks/maskGreen.png";
import studentService from "../../../services/student/student.service";

import boy from "../../../assets/Training/boy.png";
import { StandardCSSProperties } from "@mui/system";
import { showSuccessToast } from "../../../utils/toast";

interface props {
  width?: StandardCSSProperties["width"];
  flexDirection?: StandardCSSProperties["flexDirection"];
  height?: StandardCSSProperties["height"];
  alignItems?: StandardCSSProperties["alignItems"];
  justifyContent?: StandardCSSProperties["justifyContent"];
}

function MForumCard({
  width,
  flexDirection,
  height,
  alignItems,
  justifyContent,
}: props) {
  const handleAvailableSoon = async () => {
    const whatsAppLink = `https://api.whatsapp.com/send?phone=5511982724451`;

    await window.open(whatsAppLink, "blank");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: flexDirection,
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${maskGreen})`,
        width: width || "100%",
        height: height || "150px",
        bgcolor: "#B8D98799",
        borderRadius: 1,
        mt: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: alignItems,
          justifyContent: justifyContent,
        }}
      >
        <Typography
          sx={{
            color: "#212429",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "18px", 
            pb: 1,
              ml: 1,
          }}
        >
         Dúvidas
        </Typography>
        <Typography
          sx={{
            color: "#495057",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "14px",
            width: "300px",
            p: 1,
          }}
        >
            Tire suas dúvidas com o professor da turma.
        </Typography>

        <Button
          onClick={handleAvailableSoon}
          sx={{
            bgcolor: "#FFFFFF",
            "&:hover": { bgcolor: "#FFFFFF" },
            height: 40,
            width: 150,
            color: "#212429",
            fontSize: "14px",
            fontFamily: "Inter",
            fontWeight: 600,
            textTransform: "capitalize",
            hover: "#4263EB",
          }}
        >
          Acessar
        </Button>
      </Box>

      <Box>
        <img alt="boy" src={boy} style={{ position: "relative" }} />
      </Box>
    </Box>
  );
}

export default MForumCard;

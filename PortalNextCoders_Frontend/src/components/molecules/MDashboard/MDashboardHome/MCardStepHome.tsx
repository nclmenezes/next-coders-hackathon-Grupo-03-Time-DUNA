import { Box, Card, Typography, Button, ListItemIcon } from "@mui/material";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { showSuccessToast } from "../../../../utils/toast";

interface MCardStepProps {
  icon?: string;
  text: string;
  description?: string;
  textButton: string;
  buttonPath: string;
  Inactive: boolean;
}

export default function MCardsHome({
  icon,
  text,
  description,
  textButton,
  buttonPath,
  Inactive,
}: MCardStepProps) {
  const [path, setPath] = useState("");
  const navigate = useNavigate();

  const SubmitButton = () => {
    if (!Inactive) window.open(`${buttonPath}`, '_blank');
  };

  const handleAvailableSoon = () => {
    showSuccessToast("Disponível em breve", {
      position: "top-right",
      duration: 2000,
    });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        justifyContent: "space-between",
        width: "100%",
        height: "80px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ListItemIcon sx={{ p: 1 }}>
          <img src={icon} height={50} width={50} style={{ margin: 4 }} />
        </ListItemIcon>
        <Box sx={{ py: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "19px",
              fontSize: "16px",
              color: "#212429",
              paddingBottom: "8px",
            }}
          >
            {text}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "17px",
              fontSize: "14px",
              color: "#495057",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Button
          onClick={SubmitButton}
          size="large"
          variant="contained"
          disabled={Inactive}
          sx={{
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "15px",
            fontSize: "12px",
            textTransform: "none",
            background: "#4263EB",
            color: "#FFFFFF",
            borderRadius: "4px",
            height: "42px",
            width: "182px",
            "&:disabled": { color: "#fff", background: "#9EA6AD" },
          }}
        >
          {textButton}
        </Button>
      </Box>
    </Card>
  );
}

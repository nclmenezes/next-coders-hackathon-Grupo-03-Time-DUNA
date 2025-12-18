import { useEffect } from "react";
import { useLocation } from "react-router";

import { Box } from "@mui/material";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import CookieUtils from "../../../utils/cookie";

export default function FormUserAutoSignIn() {
  const { signInWithToken, signInWithRefreshToken } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchData = async () => {      
      const encodedData = CookieUtils.getCookie('token');
      if (encodedData != null) {
        await signInWithToken(encodedData);
      }
      
      const refreshEncoded = searchParams.get("refresh");
      if (refreshEncoded != null) {
        await signInWithRefreshToken(refreshEncoded);
      }
    };

    fetchData();
  }, [location]);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
        display: "flex",
        flexDirection: "column",
      }}
    >

    </Box>
  );
}

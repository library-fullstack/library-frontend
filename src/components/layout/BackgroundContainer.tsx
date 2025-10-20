import * as React from "react";
import { Box, CircularProgress } from "@mui/material";
import bgBooks from "../../assets/img/background-login.jpg";

export default function BackgroundContainer({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = bgBooks;
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-image 0.6s ease-in-out",
        backgroundColor: "rgba(204,155,122,0.3)",
        backgroundImage: loaded ? `url(${bgBooks})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {!loaded ? <CircularProgress sx={{ color: "#fff" }} /> : children}
    </Box>
  );
}

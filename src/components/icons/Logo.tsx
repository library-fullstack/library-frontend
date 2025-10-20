import * as React from "react";
import { Box } from "@mui/material";
import logo from "../../assets/img/logo.png";

function Logo(): React.ReactElement {
  return (
    <Box>
      <img width="30" height="32" src={logo} alt="Logo HBH" />
    </Box>
  );
}

export default Logo;

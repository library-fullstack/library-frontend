import * as React from "react";
import { Box } from "@mui/material";
import MenuBar from "../../components/layout/MenuBar";
import Navbar from "../../components/layout/Navbar";

export default function Cart(): React.ReactElement {
  return (
    <>
      <Box sx={{ backgroundColor: "#FAFAFA" }}>
        <Navbar />
        <MenuBar />
      </Box>
    </>
  );
}

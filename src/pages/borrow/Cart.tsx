import * as React from "react";
import { Box } from "@mui/material";
import MenuBar from "../../components/Layout/MenuBar";
import Navbar from "../../components/Layout/Navbar";

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

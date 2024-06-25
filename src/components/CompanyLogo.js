import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import room8esLogoNew from "../assets/room8esLogoNew.png";

function CompanyLogo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={room8esLogoNew}
        alt="Room8es Logo"
        sx={{
          width: isMobile ? "80%" : "40%", // Adjust the width as needed
          height: "auto", // Maintain aspect ratio
          mb: 2,
          borderRadius: "20%",
        }}
      />
    </Container>
  );
}

export default CompanyLogo;

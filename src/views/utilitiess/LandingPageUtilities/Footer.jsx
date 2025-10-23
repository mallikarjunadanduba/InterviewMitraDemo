import React from "react";
import { Container, Grid, Typography, IconButton, Box, Divider } from "@mui/material";
import { Facebook, Twitter, Google, Instagram, LinkedIn, Home, Email, Phone, Print } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#2a9d8f", color: "white", py: 6 }}>
      <Container>
        <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start">
          {/* Left-aligned Grid item */}
          <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "white",fontSize: { xs: "1.3rem", md: "1.7rem" } }}>
              Interview Mitra
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              Interview Mitra offers an innovative Learning Management System (LMS) focused on upskilling, along with a comprehensive job portal to connect skilled individuals with job opportunities.
            </Typography>
          </Grid>

          {/* Centered Grid item */}
          <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "white",fontSize: { xs: "1.3rem", md: "1.7rem" } }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, my: 0.5, color: "white" }}>
              <Home sx={{ mr: 1, color: "black" }} /> Rajajinagar, Bangalore-560010
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, my: 0.5, color: "white" }}>
              <Email sx={{ mr: 1, color: "black" }} /> info@interviewmitra.com
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, my: 0.5, color: "white" }}>
              <Phone sx={{ mr: 1, color: "black" }} /> +91 7338430816
            </Typography>
           
          </Grid>

          {/* Right-aligned Grid item */}
          <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: "center", md: "right", } }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: "white",
                textAlign: { xs: "center", md: "center",}, // Center only on desktop
              }}
            >
          
            Follow Us
             
            </Typography>
            <Box display="flex" gap={1} justifyContent={{ xs: "center", md: "flex-end" }}>
              {[
                { icon: Facebook, color: "#2a9d8f" },
                { icon: Twitter, color: "#2a9d8f" },
                { icon: Google, color: "#2a9d8f" },
                { icon: Instagram, color: "#2a9d8f" },
                { icon: LinkedIn, color: "#2a9d8f" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href="#"
                  sx={{
                    color: social.color,
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.8)" },
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

        </Grid>
      </Container>
      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 4 }} />
      <Box sx={{ textAlign: "center", opacity: 0.8 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} WakinSoftwares Bharat Pvt Ltd. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
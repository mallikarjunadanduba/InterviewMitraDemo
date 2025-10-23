import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ScrollAnimation from "../../../ui-component/extended/ScrollAnimation";
import product2 from "../../../assets/images/products/job-portal.png";
import product3 from "../../../assets/images/products/Hr payroll.jpg";
import product4 from "../../../assets/images/products/background verification.jpg";

const CustomCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledImage = styled("img")({
  width: "90px",
  height: "90px",
  objectFit: "contain",
  borderRadius: "10px",
});

const products = [
  {
    id: 1,
    title: "Candidate Digital Profiling",
    lottie: "https://lottie.host/3259af4c-c4c5-4cdd-bf15-0938f70ad2ae/kQwmooEPZF.lottie",
    text: "Creates a comprehensive digital profile for candidates, assessing their skills, experience, and personality traits through data analysis.",
  },
  {
    id: 2,
    title: "AI-Based Entrance Tests",
    lottie: "https://lottie.host/d8f842e1-d238-41cb-abcd-5284bd18edc5/gAOPEfyHLV.lottie",
    text: "Utilizes artificial intelligence to design customized entrance tests, evaluating candidates' knowledge and aptitude with precision.",
  },
  {
    id: 3,
    title: "AI-Based Mockup Interview",
    lottie: "https://lottie.host/e2c37066-fb30-436b-9ff0-f5e3887ec7ad/c41HeOHUdX.lottie",
    text: "Simulates realistic interview scenarios using AI, offering candidates a chance to practice and improve their responses in a virtual environment.",
  },
  {
    id: 4,
    title: "Job Opportunities",
    lottie: "https://lottie.host/f36aeaa2-58c5-4f02-adbe-e2d83a9349c0/IdvqsPdC42.lottie",
    text: "Provides personalized job recommendations and connects candidates with relevant opportunities based on their skills, qualifications, and career goals.",
  },
];

const Products = () => {
  return (
    <Box sx={{ backgroundColor: "#f7f7f8", padding: "50px 20px" }}>
      <Grid container spacing={4} alignItems="stretch" justifyContent="center">
        
        {/* Heading inside Grid to align with cards */}
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <ScrollAnimation animation="slideRight" delay={0.1} duration={0.6}>
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                color: "#2a9d8f",
                mb: 3,
                fontSize: { xs: "1.3rem", md: "1.7rem" },
                textAlign: "left",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  display: "block",
                  width: "100px",
                  height: "3px",
                  backgroundColor: "#2a9d8f",
                  position: "absolute",
                  bottom: "50%",
                  left: "100%",
                  marginLeft: "10px",
                },
              }}
            >
              JOB PORTAL
            </Typography>
          </ScrollAnimation>
        </Grid>

        {/* Product Cards Section */}
        {products.map((product, idx) => (
          <Grid key={product.id} item xs={12} sm={6} md={6} lg={5}>
            <ScrollAnimation animation="slideUp" delay={0.1 * idx} duration={0.6}>
              <CustomCard>
                <CardContent sx={{ flex: "1", paddingRight: "15px" }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: "10px" }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: "justify" }}>
                    {product.text}
                  </Typography>
                </CardContent>

                {/* Conditionally render image or Lottie animation */}
                {product.lottie ? (
                  <DotLottieReact src={product.lottie} loop autoplay style={{ width: 150, height: 150 }} />
                ) : (
                  <StyledImage src={product.image} alt={product.title} />
                )}
              </CustomCard>
            </ScrollAnimation>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Products;
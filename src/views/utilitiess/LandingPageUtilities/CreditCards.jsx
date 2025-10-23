import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import credit from "../../../assets/images/credit/video_sessions-removebg-preview.png";
import loan from "../../../assets/images/credit/Interactive_sessions-removebg-preview.png";
import microloan from "../../../assets/images/credit/test.png";
import business from "../../../assets/images/credit/support-removebg-preview.png";
import ScrollAnimation from "../../../ui-component/extended/ScrollAnimation";


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
  width: "150px",
  height: "150px",
  objectFit: "contain",
  borderRadius: "10px",
});

const cards = [
  {
    id: 1,
    title: "High-Quality Video Sessions",
    image: credit,
    text: "Offers engaging, high-quality video sessions that cover essential topics, ensuring effective learning. Paired with detailed notes and supplementary materials.",
  },
  {
    id: 2,
    title: "Live Interactive Sessions",
    image: loan,
    text: "Facilitates real-time interaction between trainers and candidates, enabling direct Q&A, collaboration, and live discussions for an engaging and interactive learning experience.",
  },
  {
    id: 3,
    title: "Tests & Assessments",
    image: microloan,
    text: "Assessments designed to track learner progress and understanding, including quizzes, assignments, and exams to evaluate knowledge and skills.",
  },
  {
    id: 4,
    title: "24/7 Support",
    image: business,
    text: "Round-the-clock assistance for candidates with technical issues, ensuring a seamless learning experience and minimal disruptions.",
  },
];

const CreditCard = () => {
  return (
    <Box
    sx={{
      backgroundColor: "#f7f7f8",
      padding: "50px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Grid container spacing={4} alignItems="stretch" justifyContent="center">
      {/* Heading inside Grid to align with the cards */}
      <Grid item xs={12} sm={12} md={12} lg={10}>
        <ScrollAnimation animation="slideRight" delay={0.1} duration={0.6}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: "#2a9d8f",
              mb: 3,
              fontSize: { xs: "1.3rem", md: "1.7rem" },
              textAlign: "left", // Aligns text with cards
              position: "relative",
              display: "inline-block",
              // Ensures it aligns with the grid layout
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
            UPSKILL LMS
          </Typography>
        </ScrollAnimation>
      </Grid>
  
      {/* Cards Section */}
      {cards.map((card, idx) => (
        <Grid key={card.id} item xs={12} sm={6} md={6} lg={5}>
          <ScrollAnimation animation="slideUp" delay={0.1 * idx} duration={0.6}>
            <CustomCard>
              <CardContent sx={{ flex: "1", paddingRight: "15px" }}>
                <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: "10px" }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: "justify" }}>
                  {card.text}
                </Typography>
              </CardContent>
              <StyledImage src={card.image} alt={card.title} />
            </CustomCard>
          </ScrollAnimation>
        </Grid>
      ))}
    </Grid>
  </Box>
  
  );
};

export default CreditCard;
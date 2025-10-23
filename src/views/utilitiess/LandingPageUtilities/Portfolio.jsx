import React, { useState, useEffect } from "react";
import { Container, Button, Typography, Box, Card, CardMedia, CardContent, Grid } from "@mui/material";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "BaseUrl";
import ScrollAnimation from "../../../ui-component/extended/ScrollAnimation";
import image from "../../../assets/images/underline/undeline_image-removebg-preview.png";

const categories = ["promo", "successstory"];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("promo");
  const [promoData, setPromoData] = useState([]);
  const [successStoryData, setSuccessStoryData] = useState([]);
  const navigate = useNavigate();

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/promo/v1/getAllPromoByPagination/0/10?pageNumber=0&pageSize=10`);
        const data = await response.json();
        setPromoData(data.content);
      } catch (error) {
        console.error("Error fetching promo data:", error);
      }
    };
    fetchPromoData();
  }, []);

  useEffect(() => {
    const fetchSuccessStoryData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/success/v1/getAllSuccessStoryByPagination/0/10?pageNumber=0&pageSize=10`);
        setSuccessStoryData(response.data.content);
      } catch (error) {
        console.error("Error fetching success story data:", error);
      }
    };
    fetchSuccessStoryData();
  }, []);

  const filteredData = selectedCategory === "promo" ? promoData : successStoryData;

  const handleViewMore = () => {
    if (selectedCategory === "promo") {
      navigate("/viewmorepromo");
    } else if (selectedCategory === "successstory") {
      navigate("/viewmoresuccess");
    }
  };

  return (
  
 <>
  <Box sx={{ backgroundColor: "#f7f7f8", padding: "50px 20px" }}>
  <Grid container spacing={4} alignItems="stretch" justifyContent="center">
    {/* Heading inside Grid to align with cards */}
    <Grid item xs={12} sm={12} md={12} lg={10}>
      <ScrollAnimation animation="slideUp" delay={0.2} duration={0.8}>
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
          OUR PORTFOLIO
        </Typography>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeIn" delay={0.4} duration={0.6}>
        <Box sx={{ display: "flex", justifyContent: "initial", gap: 2, mb: 3 }}>
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <Button
                variant={selectedCategory === category ? "contained" : "outlined"}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: selectedCategory === category ? "white" : "#2a9d8f",
                  backgroundColor: selectedCategory === category ? "#2a9d8f" : "transparent",
                  borderRadius: "20px",
                  px: 3,
                  transition: "0.3s",
                  "&:hover": { backgroundColor: "#2a9d8f", color: "white" },
                }}
              >
                {category.toUpperCase()}
              </Button>
            </motion.div>
          ))}
        </Box>
      </ScrollAnimation>

      {/* Carousel Section */}
      <ScrollAnimation animation="fadeIn" delay={0.6} duration={0.8}>
        <Carousel
          key={selectedCategory}
          infinite
          autoPlay
          autoPlaySpeed={2000}
          transitionDuration={600}
          removeArrowOnDeviceType={["mobile"]}
          swipeable
          draggable
          arrows
          responsive={{
            superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 4 },
            desktop: { breakpoint: { max: 1200, min: 900 }, items: 3 },
            tablet: { breakpoint: { max: 900, min: 600 }, items: 2 },
            mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
          }}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <Box key={index} sx={{ px: 1 }}>
                <br />
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    component={motion.div}
                    whileHover={{ 
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                    sx={{ 
                      boxShadow: 5, 
                      borderRadius: "15px", 
                      transition: "0.3s", 
                      "&:hover": { boxShadow: 10 } 
                    }}
                  >
                    <CardContent>
                      {selectedCategory === "successstory" ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardMedia
                            component="img"
                            image={ImageUrl + item.photoPath}
                            alt={item.successstoryName}
                            sx={{ height: "150px", objectFit: "cover", borderRadius: "10px" }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                            <iframe
                              title={item.promoName}
                              width="100%"
                              height="150px"
                              src={`https://www.youtube.com/embed/${item.youTube}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ position: "absolute", top: 0, left: 0 }}
                            />
                          </Box>
                        </motion.div>
                      )}

                      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2, textAlign: "center" }}>
                        {selectedCategory === "successstory" ? item.successstoryName : item.promoName}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
                <br />
              </Box>
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
              No items available.
            </Typography>
          )}
        </Carousel>
      </ScrollAnimation>

      {/* View More Button */}
      <ScrollAnimation animation="slideUp" delay={0.8} duration={0.6}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <motion.div
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              onClick={handleViewMore}
              sx={{
                backgroundColor: "#2a9d8f",
                "&:hover": { backgroundColor: "#2a9d8f" },
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "20px",
                px: 3,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(27, 185, 234, 0.3)",
              }}
            >
              View More
            </Button>
          </motion.div>
        </Box>
      </ScrollAnimation>
    </Grid>
  </Grid>
</Box>
 </>
    

  );
};

export default Portfolio;
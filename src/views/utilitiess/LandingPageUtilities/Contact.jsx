import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import backgroundImage from "../../../assets/images/background/blue-abstract-gradient-wave-wallpaper.jpg";
import { Element } from "react-scroll";
import ScrollAnimation from "../../../ui-component/extended/ScrollAnimation";



export default function Contact() {

  return (
    <>

      <Element name="contact-section">

        <Box
          id="contact-section"
          sx={{
            padding: { xs: "1rem", md: "2rem" },
            backgroundColor: "#f9f9f9",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background blur overlay */}



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
                    textAlign: "left", // Aligns text with cards
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
                  CONTACT US
                </Typography>
              </ScrollAnimation>
            </Grid>
          </Grid>

          <Box sx={{ padding: { xs: "1rem", md: "2rem" } }}>
            <Grid container spacing={3}>
              {/* Map Section */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
              >
                <ScrollAnimation animation="slideLeft" delay={0.4} duration={0.8}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        boxShadow: 3,
                        width: "100%",
                        margin: "0 auto",
                        borderRadius: "12px",
                        overflow: "hidden",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6877380767055!2d77.5549860753426!3d12.991813214434293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d0472f5db25%3A0x20e52bbe461f628e!2sKWINTALENT%20LABS%20PVT.%20LTD.!5e0!3m2!1sen!2sin!4v1740124849993!5m2!1sen!2sin"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Google Maps"
                      ></iframe>
                    </Card>
                  </motion.div>
                </ScrollAnimation>
              </Grid>

              {/* Contact Form Section */}
              <Grid
                item
                xs={12}
                sm={12}
                md={8}
                lg={8}
                xl={8}
              >
                <ScrollAnimation animation="slideRight" delay={0.6} duration={0.8}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card
                      sx={{
                        padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                        boxShadow: 3,
                        width: { xs: "90%", sm: "95%", md: "90%" },
                        margin: "0 auto",
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      fontWeight: "bold",
                      color: "#2a9d8f",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Send Us a Message
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#2a9d8f",
                            },
                            "&:hover fieldset": {
                              borderColor: "#2a9d8f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Email"
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#2a9d8f",
                            },
                            "&:hover fieldset": {
                              borderColor: "#2a9d8f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#2a9d8f",
                            },
                            "&:hover fieldset": {
                              borderColor: "#2a9d8f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        variant="outlined"
                        size="small"
                        multiline
                        rows={4}
                        sx={{
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#2a9d8f",
                            },
                            "&:hover fieldset": {
                              borderColor: "#2a9d8f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#2a9d8f",
                              width: { xs: "100%", sm: "100%", md: "100%" },
                              padding: "0.75rem",
                              fontSize: "1rem",
                              fontWeight: "bold",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "#2a9d8f",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                              },
                            }}
                          >
                            Send Message
                          </Button>
                        </motion.div>
                      </Box>
                    </Grid>
                  </Grid>
                    </Card>
                  </motion.div>
                </ScrollAnimation>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Element>
    </>

  );
}
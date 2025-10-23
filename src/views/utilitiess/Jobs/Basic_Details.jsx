import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { BaseUrl } from "BaseUrl";
import useSecureImage from "hooks/useSecureImage";

const Basic_Details = ({ profileData }) => {
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const coverImageUrl = useSecureImage(coverImage, user.accessToken);
  const profileImageUrl = useSecureImage(profileImage, user.accessToken);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const jobSeekerId = parseInt(user?.seekerId);
        const response = await axios.get(
          `${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${jobSeekerId}`,
          { headers }
        );
        if (response.data) {
          if (response.data.jobseekerProfilePicPath)
            setProfileImage(response.data.jobseekerProfilePicPath);
          if (response.data.jobseekerProfileCoverPicPath)
            setCoverImage(response.data.jobseekerProfileCoverPicPath);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "250px", sm: "300px", md: "400px" },
        borderRadius: "8px",
        marginBottom: { xs: "20px", md: "50px" },
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: { xs: "column", md: "row" },
        padding: { xs: "20px", md: "0" },
      }}
    >
      {/* Profile Circle - Mobile: Top, Desktop: Left Side */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "120px", sm: "150px", md: "400px" },
          height: { xs: "120px", sm: "150px", md: "100%" },
          marginLeft: { xs: "0", md: "0px" },
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Profile Circle */}
        <Box
          sx={{
            width: { xs: "120px", sm: "150px", md: "100%" },
            height: { xs: "120px", sm: "150px", md: "100%" },
            borderRadius: "50%",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            border: { xs: "2px solid white", md: "4px solid white" },
            borderRight: { xs: "2px solid white", md: "none" },
            borderTop: { xs: "2px solid white", md: "none" },
          }}
        >
          {!profileImage ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
            </Box>
          ) : (
            <img
              src={profileImageUrl}
              alt="Profile"
              style={{
                width: "90%",
                height: "90%",
                borderRadius: "50%",
                objectFit: "cover",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </Box>
        {!profileImage && (
          <Typography
            variant="h6"
            sx={{
              color: "#666666",
              fontSize: { xs: "12px", sm: "14px", md: "18px" },
              fontWeight: "normal",
              mt: { xs: 1, md: 0 },
              display: { xs: "block", md: "none" },
            }}
          >
            Profile Image
          </Typography>
        )}
      </Box>

      {/* Cover Rectangle - Mobile: Bottom, Desktop: Right Side */}
      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          top: { xs: "auto", md: "0" },
          left: { xs: "auto", md: "200px" },
          right: { xs: "auto", md: "0" },
          width: { xs: "100%", md: "auto" },
          height: { xs: "100px", md: "100%" },
          backgroundColor: coverImageUrl ? "transparent" : "#fff",
          backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: { xs: "8px", md: "0" },
          mt: { xs: 2, md: 0 },
        }}
      >
        {!coverImageUrl && (
          <Typography
            variant="h6"
            sx={{
              color: "#666666",
              fontSize: { xs: "12px", sm: "14px", md: "18px" },
              fontWeight: "normal",
            }}
          >
            Cover Image
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Basic_Details;

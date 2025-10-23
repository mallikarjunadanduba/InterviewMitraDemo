import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseUrl } from "BaseUrl";
import {
  saveOrUpdateJobSeekerProfilePic,
  saveOrUpdateJobSeekerProfileCoverPic,
} from "views/API/jobSeekerProfileApi";
import useSecureImage from "hooks/useSecureImage";

const BasicDetails = ({ profileData }) => {
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
        console.log(response.data);
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

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    const response = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + user.accessToken,
      },
    });
    if (response.data.responseCode === 201 && response.data.status === "SUCCESS") {
      return response.data.fileName;
    } else {
      throw new Error("File upload failed");
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
      const fileName = await uploadFile(file);
      const payload = {
        jobseekerProfileId,
        jobseekerProfilePicName: fileName,
        jobSeekerDto: { seekerId: parseInt(user?.seekerId) },
      };
      await saveOrUpdateJobSeekerProfilePic(payload, headers);
      setProfileImage(`${BaseUrl}/file/downloadFile?filePath=${fileName}`);
      Swal.fire("Success", "Profile image uploaded successfully", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
      const fileName = await uploadFile(file);
      const payload = {
        jobseekerProfileId,
        jobseekerProfileCoverPicName: fileName,
        jobSeekerDto: { seekerId: parseInt(user?.seekerId) },
      };
      await saveOrUpdateJobSeekerProfileCoverPic(payload, headers);
      setCoverImage(`${BaseUrl}/file/downloadFile?filePath=${fileName}`);
      Swal.fire("Success", "Cover image uploaded successfully", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

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
              <CameraAltIcon
                sx={{
                  fontSize: { xs: "20px", sm: "22px", md: "24px" },
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
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

        {/* Profile Camera Button */}
        <input
          type="file"
          accept="image/*"
          id="profile-image-input"
          style={{ display: "none" }}
          onChange={handleProfileImageChange}
        />
        <label htmlFor="profile-image-input">
          <IconButton
            component="span"
            sx={{
              position: "absolute",
              bottom: { xs: "0", md: "50%" },
              left: { xs: "50%", md: "50%" },
              transform: { xs: "translate(-50%, 50%)", md: "translate(-50%, 50%)" },
              backgroundColor: "#0095a5",
              color: "white",
              width: { xs: "28px", sm: "32px", md: "40px" },
              height: { xs: "28px", sm: "32px", md: "40px" },
              "&:hover": { backgroundColor: "#f8a12d" },
            }}
          >
            <CameraAltIcon sx={{ fontSize: { xs: "14px", sm: "16px", md: "20px" } }} />
          </IconButton>
        </label>
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

        {/* Edit Cover Button */}
        <input
          type="file"
          accept="image/*"
          id="cover-image-input"
          style={{ display: "none" }}
          onChange={handleCoverImageChange}
        />
        <label htmlFor="cover-image-input">
          <IconButton
            component="span"
            sx={{
              position: "absolute",
              top: { xs: "8px", sm: "10px", md: "20px" },
              right: { xs: "8px", sm: "10px", md: "20px" },
              backgroundColor: "#0095a5",
              color: "white",
              width: { xs: "28px", sm: "32px", md: "40px" },
              height: { xs: "28px", sm: "32px", md: "40px" },
              "&:hover": { backgroundColor: "#f8a12d", color: "#fff" },
            }}
          >
            <EditIcon sx={{ fontSize: { xs: "14px", sm: "16px", md: "20px" } }} />
          </IconButton>
        </label>
      </Box>
    </Box>
  );
};

export default BasicDetails;

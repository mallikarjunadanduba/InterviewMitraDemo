import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { createVideo, deleteVideo, getVideoById, getBy_ViedoId, updateVideo, } from "views/API/UploadDetailsApi";

const UploadDetails = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploads, setUploads] = useState([]);
  const [videoIds, setVideoIds] = useState([]);

  const [formData, setFormData] = useState({
    videoLink: "",
    subject: "",
  });

  // Extract YouTube ID from various URL formats
  const getYouTubeId = (url) => {
    if (!url) return null;

    if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }

    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    }

    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }

    return url;
  };

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  // Load existing uploads from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
        const response = await getVideoById(headers, jobseekerProfileId); 

        if (response?.data) {
          const formattedUploads = response.data.map((video) => {
            const youtubeId = getYouTubeId(video.videoLink);
            return {
              subject: video.subject,
              youtubeId,
              videoLink: `https://www.youtube.com/embed/${youtubeId}`,
              originalLink: video.videoLink
            };
          });
          
          // Store video IDs separately
          const ids = response.data.map(video => video.videoId);
          setVideoIds(ids);
          setUploads(formattedUploads);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setUploads([]);
        setVideoIds([]);
      }
    };

    fetchVideos();
  }, []);

  const handleOpen = async (index = null) => {
    if (index !== null) {
      try {
        setEditIndex(index);
        const videoId = videoIds[index];

        const response = await getBy_ViedoId(headers, videoId);
        const video = response;

        if (video) {
          const youtubeId = getYouTubeId(video.videoLink);
          setFormData({
            videoLink: video.videoLink,
            subject: video.subject || "",
            videoId: video.videoId || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch video details:", err);
        Swal.fire("Error", "Could not fetch video details", "error");
      }
    } else {
      setEditIndex(null);
      setFormData({
        videoLink: "",
        subject: "",
        videoId: null,
      });
    }

    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!formData.subject.trim()) {
      setErrors({ ...errors, subject: "Subject is required." });
      return;
    }
    if (!formData.videoLink.trim()) {
      setErrors({ ...errors, videoLink: "Video link is required." });
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const jobSeekerId = user?.seekerId;
    const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

    const youtubeId = getYouTubeId(formData.videoLink);

    const payload = {
      videoId: editIndex !== null ? videoIds[editIndex] : undefined,
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: jobseekerProfileId },
      subject: formData.subject,
      videoLink: youtubeId,
    };

    try {
      if (editIndex !== null) {
        await updateVideo(payload, headers);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Video updated successfully!",
        });
      } else {
        const response = await createVideo(payload, headers);
        // Since the API response has data: null, we'll need to fetch the video ID differently
        // For now, we'll add a placeholder and let the useEffect refetch the data
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Video added successfully!",
        });
        
        // Refetch videos to get the updated list with proper IDs
        const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
        const updatedResponse = await getVideoById(headers, jobseekerProfileId);
        if (updatedResponse?.data) {
          const formattedUploads = updatedResponse.data.map((video) => {
            const youtubeId = getYouTubeId(video.videoLink);
            return {
              subject: video.subject,
              youtubeId,
              videoLink: `https://www.youtube.com/embed/${youtubeId}`,
              originalLink: video.videoLink
            };
          });
          
          const ids = updatedResponse.data.map(video => video.videoId);
          setVideoIds(ids);
          setUploads(formattedUploads);
        }
      }

      // For edit operations, update the local state
      if (editIndex !== null) {
        const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
        const newVideo = {
          youtubeId,
          subject: formData.subject,
          videoLink: embedUrl,
          originalLink: formData.videoLink,
        };
        
        const updatedUploads = [...uploads];
        updatedUploads[editIndex] = newVideo;
        setUploads(updatedUploads);
      }

      setFormData({
        videoLink: "",
        subject: "",
        videoId: null,
      });
      setEditIndex(null);
      setOpen(false);
    } catch (error) {
      console.error("Error saving video:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save video. Please try again.",
      });
    }
  };

  const handleDelete = async (index) => {
    try {
      const videoId = videoIds[index];

      const result = await deleteVideo(videoId, headers);

      if (result) {
        setUploads(prev => prev.filter((_, i) => i !== index));
        setVideoIds(prev => prev.filter((_, i) => i !== index));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Video has been deleted.",
        });
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete video. Please try again.",
      });
    }
  };

  return (
    <Box sx={{mt:-2}}>
      {uploads.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No videos uploaded yet
          </Typography>
          <Button
            onClick={() => handleOpen()}
            variant="outlined"
            startIcon={<Add />}
          >
            Add Video
          </Button>
        </Box>
      ) : (
        uploads.map((upload, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: 'white',
              position: 'relative',
            }}
          >
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Subject:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{upload.subject}</span>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title="Edit record">
                  <IconButton 
                    onClick={() => handleOpen(index)} 
                    size="small"
                    sx={{ 
                      color: '#333',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete record">
                  <IconButton
                    onClick={() => handleDelete(index)}
                    size="small"
                    sx={{ 
                      color: '#d32f2f',
                      '&:hover': { backgroundColor: 'rgba(211,47,47,0.04)' }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {upload.videoLink && (
              <Box
                sx={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 1,
                  boxShadow: 1,
                  mb: 2,
                }}
              >
                <iframe
                  src={upload.videoLink}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Embedded video ${index}`}
                />
              </Box>
            )}
          </Box>
        ))
      )}

      {uploads.length > 0 && (
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Tooltip title="Add another video">
            <span>
              <Button
                onClick={() => handleOpen()}
                variant="text"
                sx={{ 
                  color: '#00bcd4',
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: '16px',
                  lineHeight: '20px',
                  letterSpacing: '0.35px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  '&:hover': { 
                    backgroundColor: 'rgba(0,188,212,0.04)' 
                  }
                }}
              >
                Add More +
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? "Edit Video" : "Add Video"}
        </DialogTitle>
        <DialogContent>
          {[
            { label: "Subject", key: "subject" },
            { label: "YouTube Video URL", key: "videoLink", helperText: "Paste a YouTube URL (e.g., https://www.youtube.com/watch?v=...)" },
          ].map(({ label, key, helperText }) => (
            <TextField
              key={key}
              label={label}
              fullWidth
              value={formData[key]}
              onChange={(e) => {
                setFormData({ ...formData, [key]: e.target.value });
                setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
              }}
              error={!!errors[key]}
              helperText={errors[key] || helperText}
              required
              sx={{ mt: 2 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            {editIndex !== null ? "Update" : "Add"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadDetails;

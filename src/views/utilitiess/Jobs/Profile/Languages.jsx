import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { createLanguage, deleteLanguage, getLanguageByProfileId, getLanguageId, updateLanguage } from "views/API/LanguageApi";

const Languages = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [languageId, setLanguageId] = useState(null);
  const [languageName, setLanguageName] = useState("");
  const [languages, setLanguages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user?.accessToken,
  };

  // Fetch languages when the component mounts
  useEffect(() => {
    const fetchLanguages = async () => {
      const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

      if (!jobseekerProfileId) {
        console.log("No jobseekerProfileId found in sessionStorage");
        setLanguages([]);
        return;
      }

      try {
        const response = await getLanguageByProfileId(headers, jobseekerProfileId);

        // Handle different response formats
        let languagesData = [];
        if (response && response.data) {
          languagesData = Array.isArray(response.data) ? response.data : [response.data];
        }

        setLanguages(languagesData);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setLanguages([]);
      }
    };

    fetchLanguages();
  }, []);

  // Open dialog and fetch data if editing
  const handleOpen = async (langId = null) => {
    if (langId) {
      try {
        const response = await getLanguageId(langId, headers);
        console.log("Fetched Language Details:", response);
        setLanguageId(response.languageId); // Dynamically set languageId
        setLanguageName(response.languageName || "");
        setEditId(langId);
      } catch (error) {
        console.error("Error fetching language by ID:", error);
      }
    } else {
      setLanguageId(null);
      setLanguageName("");
      setEditId(null);
    }
    setErrorMessage("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Check if language already exists (case-insensitive)
  const isLanguageExists = (languageName, excludeId = null) => {
    const trimmedName = languageName.trim().toLowerCase();
    return languages.some(
      lang => lang.languageName && lang.languageName.toLowerCase() === trimmedName && lang.languageId !== excludeId
    );
  };

  const handleSave = async () => {
    if (!languageName.trim()) {
      setErrorMessage("Language name cannot be empty.");
      return;
    }

    // Check if language already exists (case-insensitive)
    const trimmedLanguageName = languageName.trim();

    if (isLanguageExists(trimmedLanguageName, editId)) {
      setErrorMessage(`Language "${trimmedLanguageName}" already exists.`);
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const jobSeekerId = parseInt(user?.seekerId);
    const jobseekerProfileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));

    const requestData = {
      languageId: editId ? editId : 0,
      languageName: trimmedLanguageName,
      jobSeekerDtoList: {
        seekerId: jobSeekerId
      },
      jobSeekerProfileDtoList: {
        jobseekerProfileId: jobseekerProfileId
      }
    };

    try {
      if (editId) {
        // Call updateLanguage when editing
        await updateLanguage(requestData, headers);
      } else {
        // Call createLanguage when adding
        await createLanguage(requestData, headers);
      }

      handleClose();

      // Refresh the language list after update
      try {
        const updatedLanguages = await getLanguageByProfileId(headers, jobseekerProfileId);
        console.log("Refreshed languages response:", updatedLanguages);

        let languagesData = [];
        if (updatedLanguages && updatedLanguages.data) {
          languagesData = Array.isArray(updatedLanguages.data) ? updatedLanguages.data : [updatedLanguages.data];
        }

        setLanguages(languagesData);
      } catch (error) {
        console.error("Error refreshing languages:", error);
        // Don't show error to user as the save was successful
      }

    } catch (error) {
      console.error("Error saving language:", error);
      // Check if it's a duplicate key error
      if (error.response?.data?.errorMessage?.includes("duplicate key value")) {
        setErrorMessage(`Language "${trimmedLanguageName}" already exists.`);
      } else {
        setErrorMessage("Error saving language. Please try again.");
      }
    }
  };



  const handleDelete = async (langId) => {
    const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

    if (!jobseekerProfileId) {
      console.log("No jobseekerProfileId found for delete operation");
      return;
    }

    try {
      await deleteLanguage(langId, headers); // Call the API to delete the language

      // Refresh the language list after deletion
      try {
        const updatedLanguages = await getLanguageByProfileId(headers, jobseekerProfileId);
        console.log("Languages after delete:", updatedLanguages);

        let languagesData = [];
        if (updatedLanguages && updatedLanguages.data) {
          languagesData = Array.isArray(updatedLanguages.data) ? updatedLanguages.data : [updatedLanguages.data];
        }

        setLanguages(languagesData);
      } catch (error) {
        console.error("Error refreshing languages after delete:", error);
        // Remove the deleted item from local state as fallback
        setLanguages(prev => prev.filter(lang => lang.languageId !== langId));
      }
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  return (
    <Box sx={{ mt: -1 }}>
      <Divider sx={{ my: 2 }} />
      {languages.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No languages added yet
          </Typography>
          <Button
            onClick={() => handleOpen(null)}
            variant="outlined"
            startIcon={<Add />}
          >
            Add Language
          </Button>
        </Box>
      ) : (
        languages.map((lang) => (
          <Box
            key={lang.languageId}
            sx={{
              backgroundColor: 'white',
              position: 'relative',
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Language:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{lang.languageName}</span>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title="Edit record">
                  <IconButton
                    onClick={() => handleOpen(lang.languageId)}
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
                    onClick={() => handleDelete(lang.languageId)}
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
          </Box>
        ))
      )}

      {languages.length > 0 && (
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Tooltip title="Add another language">
            <span>
              <Button
                onClick={() => handleOpen(null)}
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
        <DialogTitle>{editId ? "Edit Language" : "Add Language"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            label="Language"
            variant="outlined"
            fullWidth
            value={languageName}
            onChange={(e) => {
              setLanguageName(e.target.value);
              setErrorMessage("");
            }}
            error={!!errorMessage}
            helperText={errorMessage}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#0095a5" },
                "&:hover fieldset": { borderColor: "#0095a5" },
                "&.Mui-focused fieldset": { borderColor: "#0095a5" },
              },
              "& .MuiInputLabel-root": { color: "#0095a5" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#0095a5" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: "#0095a5" }}>
            {editId ? "Update" : "Add"}
          </Button>
          <Button onClick={handleClose} sx={{ color: "#0095a5" }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Languages;
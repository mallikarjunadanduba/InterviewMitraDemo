import React, { useState } from "react";
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
  Container,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material"; // Import icons

const About = () => {
  const [open, setOpen] = useState(false);
  const [aboutText, setAboutText] = useState(""); // Initially empty
  const [tempText, setTempText] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track if editing or adding

  // Open dialog for adding or editing
  const handleOpen = (editing = false) => {
    setIsEditing(editing);
    setTempText(editing ? aboutText : ""); // Load existing text if editing
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Save new or edited content
  const handleSave = () => {
    if (tempText.trim()) {
      setAboutText(tempText); // Set new text
    }
    setOpen(false);
  };

  // Delete content
  const handleDelete = () => {
    setAboutText(""); // Clear text
  };

  return (
    <Container maxWidth="xl" sx={{ border: "1px solid #ddd", borderRadius: 2, padding: 2, backgroundColor: "#fff" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">About Me</Typography>
        <IconButton onClick={() => handleOpen(false)} style={{ color: "#0095a5" }}>
          <Add /> {/* Add button to insert new content */}
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* About Text & Icons */}
      {aboutText ? (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", flex: 1 }}>
            {aboutText}
          </Typography>
          <Box>
            <IconButton onClick={() => handleOpen(true)} sx={{ color: "#0095a5" }}>
              <Edit /> {/* Edit button */}
            </IconButton>
            <IconButton onClick={handleDelete} color="error">
              <Delete /> {/* Delete button */}
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ color: "gray", fontStyle: "italic" }}>
          Click + to add something about yourself...
        </Typography>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit About Me" : "Add About Me"}</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <br />
          <TextField
            label="Write about yourself"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#0095a5" }, // Default border color
                "&:hover fieldset": { borderColor: "#0095a5" }, // Hover effect
                "&.Mui-focused fieldset": { borderColor: "#0095a5" }, // Focused effect
              },
              "& .MuiInputLabel-root": {
                color: "#0095a5", // Label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0095a5", // Focused label color
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: "#0095a5" }}>
            Add
          </Button>
          <Button onClick={handleClose} sx={{ color: "#0095a5" }}>Cancel</Button>

        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default About;




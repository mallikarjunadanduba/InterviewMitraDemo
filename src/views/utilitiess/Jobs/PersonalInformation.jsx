import React, { useState } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';

const PersonalInformation = ({ onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    phone: '',
    email: '',
    candidateType: 'fresher',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Title/Sub Heading"
          name="title"
          value={formData.title}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Candidate Type</InputLabel>
          <Select
            name="candidateType"
            value={formData.candidateType}
            onChange={handleChange}
            label="Candidate Type"
          >
            <MenuItem value="fresher">Fresher</MenuItem>
            <MenuItem value="experienced">Experienced</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Personal Information
        </Button>
      </Grid>
    </Grid>
  );
};

export default PersonalInformation;
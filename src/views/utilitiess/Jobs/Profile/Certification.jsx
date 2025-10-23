import React, { useState, useRef, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Grid,
    Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { BaseUrl } from "BaseUrl";
import {
    createCertificate,
    deleteCertificate,
    getCertificateBy_Id,
    getCertificateDetails,
    updateCertificate,
} from "views/API/CertificateApi";
import AuthImage from "ImageUrlExtracter/AuthImage";

const Certification = () => {
    const [certifications, setCertifications] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newCert, setNewCert] = useState({
        certificateName: "",
        fileName: ""
    });
    const [errors, setErrors] = useState({ certificateName: false });
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const inputRef = useRef(null);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + user.accessToken
    };

    const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

    // Fetch certificates from API
    useEffect(() => {

        const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

        const fetchCertificates = async () => {

            try {
                const response = await getCertificateBy_Id(headers, jobseekerProfileId);
                if (response.data) {
                    setCertifications(response.data);
                }
            } catch (error) {
                console.error("Error fetching certificates:", error);
            }
        };

        fetchCertificates();
    }, []);

    const handleOpenDialog = async (index = null) => {
        if (index !== null) {
            const cert = certifications[index];

            try {
                // Fetch certificate details by ID
                const response = await getCertificateDetails(cert.certificateId, headers);
                console.log(response);

                if (response) {
                    setNewCert({
                        certificateName: response.certificateName,
                        fileName: response.fileName,
                    });

                    setFileName(response.fileName);

                    // **Save the filePath for previewing the image**
                    setSelectedFile(`${ImageUrl}${response.filePath}`);
                }
            } catch (error) {
                console.error("Error fetching certificate details:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch certificate details.",
                });
                return;
            }

            setEditingIndex(index);
        } else {
            // Reset for adding new certificate
            setNewCert({ certificateName: "", fileName: "" });
            setFileName("");
            setSelectedFile(null);
            setEditingIndex(null);
        }

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingIndex(null);
    };

    const handleChange = (e, field) => {
        setNewCert((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    };

    const onFileChange = (e) => {
        setFileName(e.target.files[0].name);
        setSelectedFile(e.target.files[0]);
    };

    const onFileUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setErrors((prevErrors) => ({ ...prevErrors, selectedFile: true }));
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Please select a file before uploading!",
            });
            return;
        }

        const data = new FormData();
        data.append("file", selectedFile);

        try {
            Swal.fire({
                title: "Uploading...",
                text: "Please wait while your file is being uploaded.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
                headers: {
                    "content-type": "multipart/form-data",
                    Authorization: "Bearer " + user.accessToken,
                },
            });

            if (response.data.responseCode === 201 && response.data.status === "SUCCESS") {
                const { fileName } = response.data;

                setNewCert((prev) => ({
                    ...prev,
                    fileName: fileName,  // Set the uploaded file name in newCert
                }));

                setFileName(fileName);

                Swal.fire({
                    target: document.getElementById("your-dialog-id"),
                    icon: "success",
                    title: "File Uploaded",
                    text: response.data.message,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error("File upload failed", error);
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "File upload failed. Please try again.",
            });
        }
    };


    const handleSaveCertification = async (e) => {
        e.preventDefault();

        let newErrors = { certificateName: false };

        if (!newCert.certificateName.trim()) {
            newErrors.certificateName = true;
            setErrors(newErrors);
            return;
        }

        const user = JSON.parse(sessionStorage.getItem("user"));
        const jobSeekerId = parseInt(user?.seekerId);
        const jobseekerProfileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));

        if (!jobSeekerId || !jobseekerProfileId) {
            await Swal.fire({
                icon: "error",
                title: "Missing Data",
                text: "User details are missing. Please log in again.",
                confirmButtonText: "OK",
            });
            return;
        }

        let payload = {
            certificateName: newCert.certificateName,
            fileName: newCert.fileName, // Ensure fileName is included
            jobSeekerDtoList: { seekerId: jobSeekerId },
            jobSeekerProfileDtoList: { jobseekerProfileId: jobseekerProfileId },
        };

        try {
            if (editingIndex !== null) {
                // Update existing certificate
                payload.certificateId = certifications[editingIndex].certificateId;
                await updateCertificate(payload, headers);
            } else {
                // Create new certificate
                await createCertificate(payload, headers);
            }

            // Refresh certificates list
            const response = await getCertificateBy_Id(headers, jobSeekerId);
            setCertifications(response.data || []);

            // Reset form
            setNewCert({ certificateName: "", fileName: "" });
            setFileName("");
            setErrors({ certificateName: false });
            setSelectedFile(null);
            setEditingIndex(null);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error saving certificate:", error);
            Swal.fire({
                icon: "error",
                title: "Save Failed",
                text: "There was an issue saving the certificate. Please try again.",
            });
        }
    };


    const handleDeleteCertification = async (index, certificateId) => {
        try {
            const isDeleted = await deleteCertificate(certificateId, headers);

            if (isDeleted) {
                // Remove the certification from the UI using the index
                setCertifications((prev) => prev.filter((_, i) => i !== index));
            }
        } catch (error) {
            console.error("Error deleting certificate:", error);
        }
    };

    return (
        <Box sx={{mt:-2}}>
            {certifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No certificates added yet
                    </Typography>
                    <Button
                        onClick={() => handleOpenDialog()}
                        variant="outlined"
                        startIcon={<Add />}
                    >
                        Add Certificate
                    </Button>
                </Box>
            ) : (
                certifications.map((cert, index) => {
                    const imageUrl = cert.filePath ? `${ImageUrl}${cert.filePath}` : "";

                    return (
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: 'white',
                                position: 'relative',
                            }}
                        >
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
                                    {cert.filePath && (
                                        <AuthImage
                                            filePath={cert.filePath}
                                            alt={cert.certificateName}
                                            style={{ width: 120, height: 80, borderRadius: 5 }}
                                        />
                                    )}
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <span style={{ color: '#666', fontWeight: 400 }}>Certificate Name:</span>{' '}
                                            <span style={{ fontWeight: 600 }}>{cert.certificateName}</span>
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", gap: 1, position: 'absolute', top: 16, right: 16 }}>
                                    <Tooltip title="Edit record">
                                        <IconButton 
                                            onClick={() => handleOpenDialog(index, cert.certificateId)} 
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
                                            onClick={() => handleDeleteCertification(index, cert.certificateId)}
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
                    );
                })
            )}

            {certifications.length > 0 && (
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Tooltip title="Add another certificate">
                        <span>
                            <Button
                                onClick={() => handleOpenDialog()}
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth id="your-dialog-id">
                <DialogTitle>{editingIndex !== null ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Certificate Name*"
                        value={newCert.certificateName}
                        onChange={(e) => handleChange(e, "certificateName")}
                        margin="normal"
                        required
                        error={errors.certificateName}
                        helperText={errors.certificateName ? "Certificate Name is required" : ""}
                    />

                    <Box mt={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="File Name"
                                value={fileName}
                                disabled
                                error={!!fileError}
                                helperText={fileError}
                                InputProps={{
                                    endAdornment: (
                                        <Button variant="contained" color="primary" onClick={onFileUpload}>
                                            Upload
                                        </Button>
                                    )
                                }}
                            />
                            <input type="file" onChange={onFileChange} ref={inputRef} style={{ marginTop: 20 }} />
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleSaveCertification} variant="contained" sx={{ backgroundColor: "#0095a5" }}>
                        {editingIndex !== null ? "Save" : "Add"}
                    </Button>
                    <Button onClick={handleCloseDialog} sx={{ color: "#0095a5" }}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Certification;
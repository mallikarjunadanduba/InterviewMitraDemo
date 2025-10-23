import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Tooltip,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { createproject, deleteProject, getProjectById, getProjectId, updateProject } from "views/API/ProjectApi";

const ProjectDetails = () => {
    const [projects, setProjects] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [newProject, setNewProject] = useState({
        projectName: "",
        description: "",
        projectUrl: "",
        skill: "",
    });
    const [errors, setErrors] = useState({});

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + user.accessToken
    };


    // Fetch projects details
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

            const response = await getProjectById(headers, jobseekerProfileId);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleChange = (e, field) => {
        setNewProject((prev) => ({ ...prev, [field]: e.target.value }));


        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleOpenDialog = async (index = null) => {
        setErrors({ projectName: "", description: "", projectUrl: "", skill: "" });

        if (index !== null) {
            const project = projects[index];

            try {

                const response = await getProjectId(headers, project.projectId);
                console.log(response);


                setNewProject({
                    projectName: response.projectName || "",
                    description: response.description || "",
                    projectUrl: response.projectUrl || "",
                    skill: response.skill || "",
                });

                setProjectId(project.projectId);
                setEditingIndex(index);
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        } else {
            setNewProject({ projectName: "", description: "", projectUrl: "", skill: "" });
            setProjectId(null);
            setEditingIndex(null);
        }

        setOpenDialog(true);
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProject({ projectName: "", description: "", projectUrl: "", skill: "" });
        setEditingIndex(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newProject.projectName.trim()) {
            newErrors.projectName = "Project Name is required";
        }
        if (!newProject.description.trim()) {
            newErrors.description = "Project Description is required";
        }
        if (!newProject.skill.trim()) {
            newErrors.skill = "Skill is required";
        }
        if (!newProject.projectUrl.trim()) {
            newErrors.projectUrl = "Project URL is required";
        } else if (!/^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(newProject.projectUrl.trim())) {
            newErrors.projectUrl = "Enter a valid URL (e.g., https://example.com)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProject = async () => {
        if (!validateForm()) {
            return; 
        }
    
        const user = JSON.parse(sessionStorage.getItem("user"));
        const jobSeekerId = parseInt(user?.seekerId);
        const jobseekerProfileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    
        const projectData = {
            ...(projectId && { projectId }), // Only include projectId if updating
            jobSeekerDtoList: { seekerId: jobSeekerId },
            jobSeekerProfileDtoList: { jobseekerProfileId: jobseekerProfileId},
            projectName: newProject.projectName,
            description: newProject.description,
            projectUrl: newProject.projectUrl,
            skill: newProject.skill,
        };
    
        try {
            if (projectId) {
                await updateProject(projectData, headers);
            } else {
                await createproject(projectData, headers);
            }
    
            handleCloseDialog();
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };
    




    const handleRemoveProject = async (index) => {
        const project = projects[index];
    
        try {
            await deleteProject(project.projectId, headers);
            setProjects((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };
    

    return (
        <Box sx={{mt:-2}}>
            {projects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No projects added yet
                    </Typography>
                    <Button
                        onClick={() => handleOpenDialog()}
                        variant="outlined"
                        startIcon={<Add />}
                    >
                        Add Project
                    </Button>
                </Box>
            ) : (
                projects.map((proj, index) => (
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
                                    <span style={{ color: '#666', fontWeight: 400 }}>Project Name:</span>{' '}
                                    <span style={{ fontWeight: 600 }}>{proj.projectName}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <span style={{ color: '#666', fontWeight: 400 }}>Description:</span>{' '}
                                    <span style={{ fontWeight: 600 }}>{proj.description}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <span style={{ color: '#666', fontWeight: 400 }}>Skill:</span>{' '}
                                    <span style={{ fontWeight: 600 }}>{proj.skill}</span>
                                </Typography>
                                <Typography variant="body2">
                                    <span style={{ color: '#666', fontWeight: 400 }}>Project URL:</span>{' '}
                                    <a 
                                        href={proj.projectUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                            fontWeight: 600, 
                                            color: '#00bcd4', 
                                            textDecoration: 'none' 
                                        }}
                                    >
                                        {proj.projectUrl}
                                    </a>
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, position: 'absolute', top: 16, right: 16 }}>
                                <Tooltip title="Edit record">
                                    <IconButton 
                                        onClick={() => handleOpenDialog(index)} 
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
                                        onClick={() => handleRemoveProject(index)}
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

            {projects.length > 0 && (
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Tooltip title="Add another project">
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingIndex !== null ? "Edit Project" : "Add Project"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Project Name*"
                        value={newProject.projectName}
                        onChange={(e) => handleChange(e, "projectName")}
                        margin="normal"
                        required
                        error={!!errors.projectName}
                        helperText={errors.projectName}
                    />
                    <TextField
                        fullWidth
                        label="Project Description*"
                        value={newProject.description}
                        onChange={(e) => handleChange(e, "description")}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <TextField
                        fullWidth
                        label="Project URL*"
                        value={newProject.projectUrl}
                        onChange={(e) => handleChange(e, "projectUrl")}
                        margin="normal"
                        required
                        error={!!errors.projectUrl}
                        helperText={errors.projectUrl}
                    />
                    <TextField
                        fullWidth
                        label="Skill*"
                        value={newProject.skill}
                        onChange={(e) => handleChange(e, "skill")}
                        margin="normal"
                        required
                        error={!!errors.skill}
                        helperText={errors.skill}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveProject} variant="contained" sx={{ backgroundColor: "#0095a5" }}>{editingIndex !== null ? "Save" : "Add"}</Button>
                    <Button onClick={handleCloseDialog} sx={{ color: "#0095a5" }}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectDetails;
import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button, Box } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';
import { useNavigate } from 'react-router-dom';
import useSecureImage from 'hooks/useSecureImage';

const ResumeData = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coverImage, setCoverImage] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const resumeRef = useRef();
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const jobseekerProfileId = sessionStorage.getItem('jobseekerProfileId');

    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user?.accessToken
    };

    const coverImageUrl = useSecureImage(coverImage, user?.accessToken);
    const profileImageUrl = useSecureImage(profileImage, user?.accessToken);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch digital profile data
                const digitalResponse = await axios.get(
                    `${BaseUrl}/jobseekerprofile/v1/getDigitalJobSeekerProfileById/${jobseekerProfileId}`,
                    { headers }
                );
                setProfile(digitalResponse.data);

                // Fetch profile images
                const jobSeekerId = parseInt(user?.seekerId);
                const profileResponse = await axios.get(
                    `${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${jobSeekerId}`,
                    { headers }
                );
                
                if (profileResponse.data) {
                    if (profileResponse.data.jobseekerProfilePicPath) {
                        setProfileImage(profileResponse.data.jobseekerProfilePicPath);
                    }
                    if (profileResponse.data.jobseekerProfileCoverPicPath) {
                        setCoverImage(profileResponse.data.jobseekerProfileCoverPicPath);
                    }
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching resume data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [jobseekerProfileId, user?.seekerId]);

    const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
        pageStyle: `
            @page {
                size: A4;
                margin: 15mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    margin: 0;
                    padding: 0;
                    font-family: 'Times New Roman', 'Times', serif;
                }
                .resume-container {
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                }
                .section {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                header {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                h1, h2, h3 {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                /* Ensure proper page breaks */
                .page-break {
                    page-break-before: always;
                    break-before: page;
                }
                /* Remove browser-added headers/footers */
                @page {
                    margin: 15mm;
                    size: A4;
                }
            }
        `,
        documentTitle: `${profile?.jobseekerProfileName || 'Resume'}`,
    });

    const handleDownloadPDF = () => {
        const input = resumeRef.current;

        html2canvas(input, {
            scale: 2,
            logging: false,
            useCORS: true,
            letterRendering: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${profile?.jobseekerProfileName || 'resume'}.pdf`);
        });
    };

    if (loading) return <div>Loading resume...</div>;
    if (!profile) return <div>No data found.</div>;

    const {
        jobseekerProfileName,
        email,
        mobileNumber,
        description,
        digitalCurrentEmploymentDto,
        digitalExperienceDto,
        digitalEducationDto,
        digitalJobSeekerSkillDto,
        digitalJobSeekerProfileProjectDto,
        digitalJobSeekerProfileCertificateDto,
        digitalJobSeekerLanguageDto,
        digitalJobSeekerCourseDto,
        digitalSocialmediaDto,
        digitalAwardDto
    } = profile;

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                    >
                        Print Resume
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </Button>
                </Box>
            </Box>

            <div ref={resumeRef} style={{
                padding: '0',
                fontFamily: "'Times New Roman', 'Times', serif",
                maxWidth: '210mm',
                margin: '0 auto',
                backgroundColor: 'white',
                color: '#000000',
                lineHeight: '1.4',
                fontSize: '11pt',
                minHeight: '297mm'
            }} className="resume-container">
                {/* Professional Header */}
                <header style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '15mm 0 10mm 0',
                    borderBottom: '2px solid #000000',
                    marginBottom: '8mm',
                    pageBreakAfter: 'avoid',
                    minHeight: '45mm'
                }}>
                    {/* Profile Image */}
                    <div style={{
                        width: '35mm',
                        height: '35mm',
                        borderRadius: '50%',
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        border: '2px solid #000000',
                        marginRight: '15mm',
                        marginTop: '0'
                    }}>
                        {profileImageUrl ? (
                            <img 
                                src={profileImageUrl}
                                alt="Profile"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <div style={{
                                fontSize: '18pt',
                                fontWeight: 'bold',
                                color: '#000000'
                            }}>
                                {jobseekerProfileName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    
                    {/* Header Content */}
                    <div style={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        paddingTop: '2mm'
                    }}>
                        <h1 style={{
                            margin: '0 0 6mm 0',
                            fontSize: '24pt',
                            fontWeight: 'bold',
                            letterSpacing: '1pt',
                            textTransform: 'uppercase',
                            color: '#000000',
                            lineHeight: '1.1'
                        }}>
                            {jobseekerProfileName}
                        </h1>
                        <div style={{
                            fontSize: '12pt',
                            lineHeight: '1.6'
                        }}>
                            <div style={{ marginBottom: '2mm' }}>
                                <strong>Email:</strong> {email}
                            </div>
                            <div>
                                <strong>Phone:</strong> {mobileNumber}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ 
                    padding: '0 15mm',
                    marginTop: '5mm'
                }}>
                    {/* Professional Summary */}
                    {description && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Professional Summary
                            </h2>
                            <p style={{ 
                                margin: '4mm 0 0 0', 
                                fontSize: '11pt', 
                                lineHeight: '1.4',
                                color: '#000000',
                                textAlign: 'justify'
                            }}>
                                {description}
                            </p>
                        </section>
                    )}

                    {/* Current Employment */}
                    {digitalCurrentEmploymentDto && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Current Employment
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '3mm'
                                }}>
                                    <div>
                                        <h3 style={{
                                            margin: '0 0 1mm 0',
                                            fontSize: '12pt',
                                            fontWeight: 'bold',
                                            color: '#000000'
                                        }}>
                                            {digitalCurrentEmploymentDto.jobTitle}
                                        </h3>
                                        <p style={{
                                            margin: '0',
                                            fontSize: '11pt',
                                            color: '#000000',
                                            fontWeight: 'bold'
                                        }}>
                                            {digitalCurrentEmploymentDto.companyName}
                                        </p>
                                    </div>
                                    <div style={{
                                        background: '#000000',
                                        color: 'white',
                                        padding: '1mm 3mm',
                                        fontSize: '9pt',
                                        fontWeight: 'bold'
                                    }}>
                                        Current
                                    </div>
                                </div>
                                
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8mm',
                                    marginBottom: '3mm'
                                }}>
                                    <div>
                                        <span style={{
                                            fontSize: '10pt',
                                            color: '#000000',
                                            fontWeight: 'bold'
                                        }}>
                                            Skills: 
                                        </span>
                                        <span style={{ fontSize: '11pt', marginLeft: '2mm' }}>
                                            {digitalCurrentEmploymentDto.skill}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{
                                            fontSize: '10pt',
                                            color: '#000000',
                                            fontWeight: 'bold'
                                        }}>
                                            Notice Period: 
                                        </span>
                                        <span style={{ fontSize: '11pt', marginLeft: '2mm' }}>
                                            {digitalCurrentEmploymentDto.noticePeriod}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{
                                            fontSize: '10pt',
                                            color: '#000000',
                                            fontWeight: 'bold'
                                        }}>
                                            CTC: 
                                        </span>
                                        <span style={{ fontSize: '11pt', marginLeft: '2mm' }}>
                                            {digitalCurrentEmploymentDto.currentctc} LPA
                                        </span>
                                    </div>
                                </div>
                                
                                {digitalCurrentEmploymentDto.jobDescription && (
                                    <div>
                                        <p style={{
                                            margin: '0',
                                            fontSize: '11pt',
                                            color: '#000000',
                                            lineHeight: '1.4',
                                            textAlign: 'justify'
                                        }}>
                                            {digitalCurrentEmploymentDto.jobDescription}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Work Experience */}
                    {digitalExperienceDto?.length > 0 && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Professional Experience
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                {digitalExperienceDto.map((exp, index) => (
                                    <div key={exp.experienceId} style={{
                                        marginBottom: '6mm',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '2mm'
                                        }}>
                                            <div>
                                                <h3 style={{
                                                    margin: '0 0 1mm 0',
                                                    fontSize: '12pt',
                                                    fontWeight: 'bold',
                                                    color: '#000000'
                                                }}>
                                                    {exp.designation}
                                                </h3>
                                                <p style={{
                                                    margin: '0',
                                                    fontSize: '11pt',
                                                    color: '#000000',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {exp.companyName}
                                                </p>
                                            </div>
                                            <div style={{
                                                fontSize: '10pt',
                                                color: '#000000',
                                                fontWeight: 'bold'
                                            }}>
                                                {formatDate(exp.fromDate)} - {formatDate(exp.toDate)}
                                            </div>
                                        </div>
                                        
                                        {exp.description && (
                                            <p style={{
                                                margin: '0',
                                                fontSize: '11pt',
                                                color: '#000000',
                                                lineHeight: '1.4',
                                                textAlign: 'justify'
                                            }}>
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {digitalEducationDto?.length > 0 && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Education
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                {digitalEducationDto.map((edu) => (
                                    <div key={edu.educationId} style={{
                                        marginBottom: '4mm',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '1mm'
                                        }}>
                                            <div>
                                                <h3 style={{
                                                    margin: '0 0 1mm 0',
                                                    fontSize: '12pt',
                                                    fontWeight: 'bold',
                                                    color: '#000000'
                                                }}>
                                                    {edu.educationName}
                                                </h3>
                                                <p style={{
                                                    margin: '0',
                                                    fontSize: '11pt',
                                                    color: '#000000',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {edu.instituteName}
                                                </p>
                                            </div>
                                            <div style={{
                                                fontSize: '10pt',
                                                color: '#000000',
                                                fontWeight: 'bold'
                                            }}>
                                                {formatDate(edu.fromDate)} - {formatDate(edu.toDate)}
                                            </div>
                                        </div>
                                        <p style={{
                                            margin: '0',
                                            fontSize: '11pt',
                                            color: '#000000'
                                        }}>
                                            <strong>Score:</strong> {edu.percentage}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills & Languages */}
                    {(digitalJobSeekerSkillDto?.length > 0 || digitalJobSeekerLanguageDto?.length > 0) && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Skills & Languages
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '8mm',
                                    alignItems: 'start'
                                }}>
                                    {/* Skills Column */}
                                    {digitalJobSeekerSkillDto?.length > 0 && (
                                        <div>
                                            <h3 style={{
                                                color: '#000000',
                                                fontSize: '12pt',
                                                fontWeight: 'bold',
                                                margin: '0 0 3mm 0',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5pt',
                                                borderBottom: '1pt solid #000000',
                                                paddingBottom: '1mm'
                                            }}>
                                                Technical Skills
                                            </h3>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '2mm'
                                            }}>
                                                {digitalJobSeekerSkillDto.map(skill => (
                                                    <span
                                                        key={skill.skillId}
                                                        style={{
                                                            background: '#000000',
                                                            color: 'white',
                                                            padding: '1mm 3mm',
                                                            fontSize: '10pt',
                                                            fontWeight: 'bold',
                                                            marginBottom: '1mm'
                                                        }}
                                                    >
                                                        {skill.skillName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Languages Column */}
                                    {digitalJobSeekerLanguageDto?.length > 0 && (
                                        <div>
                                            <h3 style={{
                                                color: '#000000',
                                                fontSize: '12pt',
                                                fontWeight: 'bold',
                                                margin: '0 0 3mm 0',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5pt',
                                                borderBottom: '1pt solid #000000',
                                                paddingBottom: '1mm'
                                            }}>
                                                Languages
                                            </h3>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '2mm'
                                            }}>
                                                {digitalJobSeekerLanguageDto.map(lang => (
                                                    <span
                                                        key={lang.languageId}
                                                        style={{
                                                            background: '#f5f5f5',
                                                            padding: '1mm 3mm',
                                                            fontSize: '10pt',
                                                            fontWeight: 'bold',
                                                            marginBottom: '1mm',
                                                            border: '1px solid #000000'
                                                        }}
                                                    >
                                                        {lang.languageName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {digitalJobSeekerProfileProjectDto?.length > 0 && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Projects
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                {digitalJobSeekerProfileProjectDto.map(project => (
                                    <div key={project.projectId} style={{
                                        marginBottom: '4mm',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <h3 style={{
                                            margin: '0 0 1mm 0',
                                            fontSize: '12pt',
                                            fontWeight: 'bold',
                                            color: '#000000'
                                        }}>
                                            {project.projectName}
                                        </h3>
                                        {project.projectUrl && (
                                            <p style={{ margin: '0 0 2mm 0', fontSize: '10pt' }}>
                                                <strong>Link:</strong> {project.projectUrl}
                                            </p>
                                        )}
                                        <p style={{
                                            margin: '0',
                                            fontSize: '11pt',
                                            color: '#000000',
                                            lineHeight: '1.4',
                                            textAlign: 'justify'
                                        }}>
                                            {project.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certificates & Awards */}
                    {(digitalJobSeekerProfileCertificateDto?.length > 0 || digitalAwardDto?.length > 0) && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Certifications & Awards
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '8mm',
                                    alignItems: 'start'
                                }}>
                                    {/* Certificates Column */}
                                    {digitalJobSeekerProfileCertificateDto?.length > 0 && (
                                        <div>
                                            <h3 style={{
                                                color: '#000000',
                                                fontSize: '12pt',
                                                fontWeight: 'bold',
                                                margin: '0 0 3mm 0',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5pt',
                                                borderBottom: '1pt solid #000000',
                                                paddingBottom: '1mm'
                                            }}>
                                                Certifications
                                            </h3>
                                            {digitalJobSeekerProfileCertificateDto.map(cert => (
                                                <div key={cert.certificateId} style={{
                                                    marginBottom: '2mm',
                                                    pageBreakInside: 'avoid'
                                                }}>
                                                    <p style={{
                                                        margin: '0',
                                                        fontSize: '11pt',
                                                        fontWeight: 'bold',
                                                        color: '#000000'
                                                    }}>
                                                        {cert.certificateName}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Awards Column */}
                                    {digitalAwardDto?.length > 0 && (
                                        <div>
                                            <h3 style={{
                                                color: '#000000',
                                                fontSize: '12pt',
                                                fontWeight: 'bold',
                                                margin: '0 0 3mm 0',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5pt',
                                                borderBottom: '1pt solid #000000',
                                                paddingBottom: '1mm'
                                            }}>
                                                Awards & Achievements
                                            </h3>
                                            {digitalAwardDto.map(award => (
                                                <div key={award.awardId} style={{
                                                    marginBottom: '2mm',
                                                    pageBreakInside: 'avoid'
                                                }}>
                                                    <p style={{
                                                        margin: '0',
                                                        fontSize: '11pt',
                                                        fontWeight: 'bold',
                                                        color: '#000000'
                                                    }}>
                                                        {award.awardName}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}


                    {/* Courses */}
                    {digitalJobSeekerCourseDto?.length > 0 && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Courses
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                {digitalJobSeekerCourseDto.map(course => (
                                    <div key={course.courseId} style={{
                                        marginBottom: '3mm',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <h3 style={{
                                            margin: '0 0 1mm 0',
                                            fontSize: '12pt',
                                            fontWeight: 'bold',
                                            color: '#000000'
                                        }}>
                                            {course.courseName}
                                        </h3>
                                        <p style={{
                                            margin: '0',
                                            fontSize: '11pt',
                                            color: '#000000',
                                            lineHeight: '1.4'
                                        }}>
                                            {course.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Social Media */}
                    {digitalSocialmediaDto?.length > 0 && (
                        <section className="section" style={{ 
                            marginBottom: '8mm',
                            pageBreakInside: 'avoid'
                        }}>
                            <h2 style={{
                                color: '#000000',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                margin: '0 0 4mm 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1pt',
                                borderBottom: '1pt solid #000000',
                                paddingBottom: '2mm'
                            }}>
                                Social Media
                            </h2>
                            <div style={{ marginTop: '4mm' }}>
                                {digitalSocialmediaDto.map(media => (
                                    <div key={media.socialmediaId} style={{
                                        marginBottom: '2mm',
                                        fontSize: '11pt'
                                    }}>
                                        <strong style={{
                                            display: 'inline-block',
                                            width: '25mm',
                                            color: '#000000'
                                        }}>
                                            {media.socialmediaName}:
                                        </strong>
                                        <span style={{ color: '#000000' }}>
                                            {media.socialmediaLink}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </Box>
    );
};

export default ResumeData;
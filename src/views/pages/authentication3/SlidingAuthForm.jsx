import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Divider,
  MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  LocationCity as LocationCityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';
import Google from 'assets/images/icons/social-google.svg';
import logSvg from 'assets/images/img/log.svg';
import registerSvg from 'assets/images/img/register.svg';

const SlidingAuthForm = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mailId: '',
    mobileNumber: '',
    password: '',
    education: '',
    university: '',
    otp: ''
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${BaseUrl}/jobseeker/v1/userLogin`, {
        userName: values.userName,
        password: values.password
      });

      if (response.data.status === 'FAILED') {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: response.data.errorMessage,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            container: 'custom-swal-container'
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        setErrors({ submit: response.data.errorMessage });
      } else {
        sessionStorage.setItem('user', JSON.stringify(response.data));
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Login Successful',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          customClass: {
            container: 'custom-swal-container'
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        navigate('/jobs');
      }
    } catch (error) {
      console.error('API error:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'An error occurred. Please try again.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          container: 'custom-swal-container'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const response = await axios.post(`${BaseUrl}/jobseeker/v1/register`, {
        fullName: values.fullName,
        mailId: values.mailId,
        mobileNumber: values.mobileNumber,
        otp: values.otp,
        password: values.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.responseCode === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'User Registration Successful.'
        });
        resetForm();
        navigate('/login');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.errorMessage || 'An error occurred during registration.'
        });
        setErrors({ submit: response.data.errorMessage });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.errorMessage || error.message || 'Something went wrong. Please try again.'
      });
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const educationOptions = [
    'Bachelor of Technology',
    'Master of Technology',
    'Bachelor of Science',
    'Master of Science',
    'Master of Information Technology'
  ];
  const universityOptions = [
    'Delhi University',
    'IIT Bombay',
    'IIT Delhi',
    'NIT Trichy',
    'Other'
  ];

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setFormData({
      fullName: '',
      mailId: '',
      mobileNumber: '',
      password: '',
      education: '',
      university: '',
      otp: ''
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '100vh', sm: '100vh', md: '100vh' },
        backgroundColor: '#fff',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: '20px 10px', sm: '20px 15px', md: '20px 20px' },
        marginTop: { xs: '0', sm: '0', md: '40px' }
      }}
    >
      {/* Background Circle */}
      <Box
        sx={{
          position: 'absolute',
          height: { xs: '1200px', sm: '1800px', md: '2000px' },
          width: { xs: '1200px', sm: '1800px', md: '2000px' },
          top: { xs: '-30%', sm: '-15%', md: '-10%' },
          right: isSignUpMode ? { xs: '50%', sm: '47%', md: '48%' } : { xs: '50%', sm: '47%', md: '48%' },
          transform: isSignUpMode 
            ? { xs: 'translate(50%, -50%)', sm: 'translate(100%, -50%)', md: 'translate(100%, -50%)' }
            : { xs: 'translate(50%, -50%)', sm: 'translateY(-50%)', md: 'translateY(-50%)' },
          background: 'linear-gradient(-45deg, #2a9d8f 0%, #03045e 100%)',
          borderRadius: '50%',
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'transform 1.8s ease-in-out'
        }}
      />

      {/* Mobile Content Overlay - Simple container */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none', md: 'none' },
          position: 'absolute',
          top: { xs: '8%', sm: '20%' },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          maxWidth: '350px',
          width: '90%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px',
          marginTop: { xs: '50px', sm: '0', md: '0' }
        }}
        onClick={toggleMode}
      >
        {/* Title */}
        <Typography
          sx={{
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '12px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          {isSignUpMode ? 'Welcome back!' : 'New to Interview Mitra?'}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.8rem',
            fontWeight: 400,
            textAlign: 'center',
            lineHeight: 1.4,
            marginBottom: '20px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}
        >
          {isSignUpMode 
            ? 'Ready to continue your interview preparation journey? Sign in to access your personalized practice sessions and track your progress.'
            : 'Join thousands of students who are acing their interviews with our AI-powered practice platform. Get personalized feedback and boost your confidence!'
          }
        </Typography>

        {/* Action Button */}
        <Box
          sx={{
            backgroundColor: '#2a9d8f',
            borderRadius: '25px',
            padding: '10px 24px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#1e7a6b',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(42, 157, 143, 0.3)'
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {isSignUpMode ? 'Sign In' : 'Sign Up'}
          </Typography>
        </Box>
      </Box>

      {/* Forms Container */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '60%', sm: '50%', md: '50%' },
          left: isSignUpMode ? { xs: '50%', sm: '30%', md: '25%' } : { xs: '50%', sm: '70%', md: '75%' },
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%', md: '50%' },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          transition: '1s 0.7s ease-in-out',
          maxWidth: { xs: '400px', sm: '450px', md: '500px' }
        }}
      >
        {/* Sign In Form */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: '1.5rem 1rem', sm: '2rem 1.5rem', md: '0 5rem' },
            opacity: isSignUpMode ? 0 : 1,
            zIndex: isSignUpMode ? 1 : 2,
            position: 'absolute',
            width: '100%',
            transition: 'all 0.2s 0.7s',
            backgroundColor: 'transparent'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
              color: '#2a9d8f',
              marginBottom: { xs: '8px', sm: '10px', md: '10px' },
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Sign in
          </Typography>

          <Formik
            initialValues={{
              userName: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              userName: Yup.string().max(255).required('enter the mobile number is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={handleLoginSubmit}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <Box component="form" onSubmit={handleSubmit} sx={{ 
                width: '100%', 
                maxWidth: { xs: '320px', sm: '350px', md: '380px' }, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}>
                <TextField
                  fullWidth
                  name="userName"
                  type="text"
                  placeholder="Mobile number"
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.userName && errors.userName)}
                  helperText={touched.userName && errors.userName}
                  required
                  sx={{
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '45px', sm: '50px', md: '55px' },
                      backgroundColor: '#f0f0f0',
                      height: { xs: '45px', sm: '50px', md: '55px' },
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: { xs: '50px', sm: '55px', md: '60px' },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      color: '#2a9d8f',
                      '&::placeholder': {
                        color: '#aaa',
                        fontWeight: 500
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: '#acacac', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  required
                  sx={{
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '45px', sm: '50px', md: '55px' },
                      backgroundColor: '#f0f0f0',
                      height: { xs: '45px', sm: '50px', md: '55px' },
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: { xs: '50px', sm: '55px', md: '60px' },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      color: '#2a9d8f',
                      '&::placeholder': {
                        color: '#aaa',
                        fontWeight: 500
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#acacac', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', margin: '10px 0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="remember"
                      style={{ marginRight: '8px', accentColor: '#2a9d8f' }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>
                      Remember me
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: '#2a9d8f',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot Password?
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    width: { xs: '120px', sm: '135px', md: '150px' },
                    backgroundColor: '#F4A261',
                    height: { xs: '40px', sm: '45px', md: '49px' },
                    borderRadius: { xs: '40px', sm: '45px', md: '49px' },
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    alignSelf: 'center',
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: '#e76f51'
                    }
                  }}
                >
                  Login
                </Button>

                {errors.submit && (
                  <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
                    {errors.submit}
                  </Typography>
                )}

                <Typography
                  sx={{
                    padding: { xs: '0.5rem 0', sm: '0.6rem 0', md: '0.7rem 0' },
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    textAlign: 'center',
                    color: '#2a9d8f'
                  }}
                >
                  Or Sign in with social platforms
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.45rem' }}>
                  {[
                    { icon: <FacebookIcon />, color: '#3b5998' },
                    { icon: <TwitterIcon />, color: '#1da1f2' },
                    { icon: <GoogleIcon />, color: '#db4437' },
                    { icon: <LinkedInIcon />, color: '#0077b5' }
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        height: { xs: '36px', sm: '41px', md: '46px' },
                        width: { xs: '36px', sm: '41px', md: '46px' },
                        color: '#2a9d8f',
                        border: '1px solid #333',
                        borderRadius: '50%',
                        '&:hover': {
                          color: social.color,
                          borderColor: social.color
                        }
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            )}
          </Formik>
        </Paper>

        {/* Sign Up Form */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: '1.5rem 1rem', sm: '2rem 1.5rem', md: '0 5rem' },
            opacity: isSignUpMode ? 1 : 0,
            zIndex: isSignUpMode ? 2 : 1,
            position: 'absolute',
            width: '100%',
            transition: 'all 0.2s 0.7s',
            backgroundColor: 'transparent',
            marginTop: { xs: '80px', sm: '0', md: '0' }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
              color: '#2a9d8f',
              marginBottom: { xs: '8px', sm: '10px', md: '10px' },
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Sign up
          </Typography>

          <Formik
            initialValues={{
              fullName: '',
              mailId: '',
              mobileNumber: '',
              password: '',
              education: '',
              university: '',
              otp: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              fullName: Yup.string().max(255).required('Full Name is required'),
              mailId: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              mobileNumber: Yup.string()
                .matches(/^[0-9]{10}$/, 'Mobile Number must be 10 digits')
                .required('Mobile Number is required'),
              otp: Yup.string()
                .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
                .required('OTP is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={handleRegisterSubmit}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <Box component="form" onSubmit={handleSubmit} sx={{ 
                width: '100%', 
                maxWidth: { xs: '320px', sm: '350px', md: '380px' }, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}>
                <TextField
                  fullWidth
                  name="fullName"
                  placeholder="Full Name"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.fullName && errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                  required
                  sx={{
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '45px', sm: '50px', md: '55px' },
                      backgroundColor: '#f0f0f0',
                      height: { xs: '45px', sm: '50px', md: '55px' },
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: { xs: '50px', sm: '55px', md: '60px' },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      color: '#2a9d8f',
                      '&::placeholder': {
                        color: '#aaa',
                        fontWeight: 500
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#acacac', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  name="mailId"
                  type="email"
                  placeholder="Email"
                  value={values.mailId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.mailId && errors.mailId)}
                  helperText={touched.mailId && errors.mailId}
                  required
                  sx={{
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '45px', sm: '50px', md: '55px' },
                      backgroundColor: '#f0f0f0',
                      height: { xs: '45px', sm: '50px', md: '55px' },
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: { xs: '50px', sm: '55px', md: '60px' },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      color: '#2a9d8f',
                      '&::placeholder': {
                        color: '#aaa',
                        fontWeight: 500
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#acacac', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  name="mobileNumber"
                  type="tel"
                  placeholder="Mobile Number"
                  value={values.mobileNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.mobileNumber && errors.mobileNumber)}
                  helperText={touched.mobileNumber && errors.mobileNumber}
                  required
                  sx={{
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '45px', sm: '50px', md: '55px' },
                      backgroundColor: '#f0f0f0',
                      height: { xs: '45px', sm: '50px', md: '55px' },
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: { xs: '50px', sm: '55px', md: '60px' },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      color: '#2a9d8f',
                      '&::placeholder': {
                        color: '#aaa',
                        fontWeight: 500
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: '#acacac', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  name="otp"
                  type="text"
                  placeholder="OTP"
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.otp && errors.otp)}
                  helperText={touched.otp && errors.otp}
                  required
                  sx={{
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '45px', sm: '50px', md: '55px' },
                      backgroundColor: '#f0f0f0',
                      height: { xs: '45px', sm: '50px', md: '55px' },
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: { xs: '50px', sm: '55px', md: '60px' },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      color: '#2a9d8f',
                      '&::placeholder': {
                        color: '#aaa',
                        fontWeight: 500
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#acacac', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  required
                  sx={{
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '45px', sm: '50px', md: '55px' },
                      backgroundColor: '#f0f0f0',
                      height: { xs: '45px', sm: '50px', md: '55px' },
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: { xs: '50px', sm: '55px', md: '60px' },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      color: '#2a9d8f',
                      '&::placeholder': {
                        color: '#aaa',
                        fontWeight: 500
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#acacac', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    width: { xs: '120px', sm: '135px', md: '150px' },
                    backgroundColor: '#F4A261',
                    height: { xs: '40px', sm: '45px', md: '49px' },
                    borderRadius: { xs: '40px', sm: '45px', md: '49px' },
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    margin: { xs: '8px 0', sm: '10px 0', md: '10px 0' },
                    alignSelf: 'center',
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: '#e76f51'
                    }
                  }}
                >
                  Sign up
                </Button>

                {errors.submit && (
                  <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
                    {errors.submit}
                  </Typography>
                )}

                <Typography
                  sx={{
                    padding: '0.7rem 0',
                    fontSize: '1rem',
                    textAlign: 'center',
                    color: '#2a9d8f'
                  }}
                >
                  Or Sign up with social platforms
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.45rem' }}>
                  {[
                    { icon: <FacebookIcon />, color: '#3b5998' },
                    { icon: <TwitterIcon />, color: '#1da1f2' },
                    { icon: <GoogleIcon />, color: '#db4437' },
                    { icon: <LinkedInIcon />, color: '#0077b5' }
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        height: { xs: '36px', sm: '41px', md: '46px' },
                        width: { xs: '36px', sm: '41px', md: '46px' },
                        color: '#2a9d8f',
                        border: '1px solid #333',
                        borderRadius: '50%',
                        '&:hover': {
                          color: social.color,
                          borderColor: social.color
                        }
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            )}
          </Formik>
        </Paper>
      </Box>

      {/* Panels Container */}
      <Box
        sx={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          display: { xs: 'none', sm: 'grid', md: 'grid' },
          gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
          gridTemplateRows: { sm: '1fr', md: '1fr' },
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'column' },
            alignItems: { xs: 'center', sm: 'flex-end', md: 'flex-end' },
            justifyContent: { xs: 'center', sm: 'space-around', md: 'space-around' },
            textAlign: 'center',
            padding: { xs: '2rem 5%', sm: '2.5rem 8%', md: '3rem 17% 2rem 12%' },
            gridColumn: '1 / 2',
            gridRow: '1 / 2',
            pointerEvents: isSignUpMode ? 'none' : 'all',
            transform: isSignUpMode ? 'translateX(-800px)' : 'translateX(0)',
            transition: 'transform 0.9s ease-in-out',
            transitionDelay: '0.6s'
          }}
        >
          <Box
            sx={{
              color: '#fff',
              transform: isSignUpMode ? 'translateX(-800px)' : 'translateX(0)',
              transition: 'transform 0.9s ease-in-out',
              transitionDelay: '0.6s',
              paddingRight: { xs: '0', sm: '15%', md: 0 }
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                lineHeight: 1,
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                marginBottom: { xs: '0.5rem', sm: '0.6rem', md: '0.7rem' }
              }}
            >
              New to Interview Mitra?
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.95rem' },
                padding: { xs: '0.3rem 0', sm: '0.5rem 0', md: '0.7rem 0' },
                marginBottom: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
              }}
            >
              Join thousands of students who are acing their interviews with our AI-powered practice platform. Get personalized feedback and boost your confidence!
            </Typography>
            <Button
              onClick={toggleMode}
              sx={{
                margin: 0,
                background: 'none',
                border: '2px solid #fff',
                width: { xs: '100px', sm: '110px', md: '130px' },
                height: { xs: '30px', sm: '35px', md: '41px' },
                fontWeight: 600,
                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                color: '#fff',
                textTransform: 'none',
                pointerEvents: 'auto',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Sign up
            </Button>
          </Box>
          <Box
            component="img"
            src={logSvg}
            alt="Sign up illustration"
            sx={{
              width: { xs: '150px', sm: '200px', md: '100%' },
              transition: 'transform 1.1s ease-in-out',
              transitionDelay: '0.4s',
              transform: isSignUpMode ? 'translateX(-800px)' : 'translateX(0)'
            }}
          />
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: isMobile ? 'space-around' : 'space-around',
            textAlign: 'center',
            padding: isMobile ? '2.5rem 8%' : '3rem 12% 2rem 17%',
            gridColumn: isMobile ? '1 / 2' : '2 / 3',
            gridRow: isMobile ? '3 / 4' : '1 / 2',
            pointerEvents: isSignUpMode ? 'all' : 'none',
            transform: isSignUpMode ? 'translateX(0)' : (isMobile ? 'translateY(300px)' : 'translateX(800px)'),
            transition: 'transform 0.9s ease-in-out',
            transitionDelay: '0.6s'
          }}
        >
          <Box
            sx={{
              color: '#fff',
              transform: isSignUpMode ? 'translateX(0)' : (isMobile ? 'translateY(300px)' : 'translateX(800px)'),
              transition: 'transform 0.9s ease-in-out',
              transitionDelay: '0.6s',
              paddingRight: isMobile ? '15%' : 0
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                lineHeight: 1,
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                marginBottom: '0.7rem'
              }}
            >
              Welcome back!
            </Typography>
            <Typography
              sx={{
                fontSize: isMobile ? '0.7rem' : '0.95rem',
                padding: isMobile ? '0.5rem 0' : '0.7rem 0',
                marginBottom: '1rem'
              }}
            >
              Ready to continue your interview preparation journey? Sign in to access your personalized practice sessions and track your progress.
            </Typography>
            <Button
              onClick={toggleMode}
              sx={{
                margin: 0,
                background: 'none',
                border: '2px solid #fff',
                width: isMobile ? '110px' : '130px',
                height: isMobile ? '35px' : '41px',
                fontWeight: 600,
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                color: '#fff',
                textTransform: 'none',
                pointerEvents: 'auto',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Sign in
            </Button>
          </Box>
          <Box
            component="img"
            src={registerSvg}
            alt="Sign in illustration"
            sx={{
              width: isMobile ? '200px' : '100%',
              transition: 'transform 1.1s ease-in-out',
              transitionDelay: '0.4s',
              transform: isSignUpMode ? 'translateX(0)' : (isMobile ? 'translateY(300px)' : 'translateX(800px)')
            }}
          />
        </Box>
      </Box>

    </Box>
  );
};

export default SlidingAuthForm;

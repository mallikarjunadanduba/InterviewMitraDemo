import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material-UI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Third Party
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import axios from 'axios';

// Project Imports
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// Assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { BaseUrl } from 'BaseUrl';

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const navigate = useNavigate(); // Initialize navigation

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={1}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign up with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ alignItems: 'center', display: 'flex' }}>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            <Button
              variant="outlined"
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`
              }}
              disableRipple
              disabled
            >
              OR
            </Button>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          fullName: '',
          mailId: '',
          mobileNumber: '',
          otp: '',
          password: '',
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
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          try {
            const response = await axios.post(
              `${BaseUrl}/jobseeker/v1/register`,
              {
                fullName: values.fullName,
                mailId: values.mailId,
                mobileNumber: values.mobileNumber,
                otp: values.otp,
                password: values.password
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            if (response.data.responseCode === 201) {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message || 'User Registration Successful.'
              });
              resetForm(); // Reset form fields
              navigate('/login'); // Navigate to login page
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.data.errorMessage || 'An error occurred during registration.'
              });
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
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              {/* First Row */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  margin="dense"
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.fullName && errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2a9d8f',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  margin="dense"
                  name="mailId"
                  type="email"
                  value={values.mailId}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.mailId && errors.mailId)}
                  helperText={touched.mailId && errors.mailId}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2a9d8f',
                      },
                    },
                  }}
                />
              </Grid>
              
              {/* Second Row */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  margin="dense"
                  name="mobileNumber"
                  type="text"
                  value={values.mobileNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.mobileNumber && errors.mobileNumber)}
                  helperText={touched.mobileNumber && errors.mobileNumber}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2a9d8f',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="OTP"
                  margin="dense"
                  name="otp"
                  type="text"
                  value={values.otp}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.otp && errors.otp)}
                  helperText={touched.otp && errors.otp}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2a9d8f',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2a9d8f',
                      },
                    },
                  }}
                />
              </Grid>
              
              {/* Password Row - Full Width */}
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#2a9d8f',
                    },
                    '&:hover fieldset': {
                      borderColor: '#2a9d8f',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2a9d8f',
                    },
                  },
                }}>
                  <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password-register"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-register">
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 1 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" style={{ backgroundColor: "#2a9d8f" }}>
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;

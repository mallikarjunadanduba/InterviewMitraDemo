import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// material-ui
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
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';
import { Link } from 'react-router-dom';
import { BaseUrl } from '../../../../BaseUrl';
import Swal from 'sweetalert2';

// API URL
const API_URL = `${BaseUrl}/jobseeker/v1/userLogin`;

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const navigate = useNavigate();

  const googleHandler = async () => {
    console.error('Login');
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLoginSubmit = (values, { setSubmitting, setErrors }) => {
    axios
      .post(API_URL, {
        userName: values.userName,
        password: values.password
      })
      .then((response) => {
        console.log('API response:', response.data);
        if (response.data.status === 'FAILED') {
          // Show error message using Swal.fire
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
          // Set errors in the form
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

          const container = document.querySelector('.swal2-container');
          if (container) {
            container.style.marginTop = '80px';
          }

          navigate('/jobs');
        }
        setSubmitting(false);
      })
      .catch((error) => {
        console.error('API error:', error);
        // Show error message using Swal.fire
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
        // Set errors in the form
        setErrors({ submit: 'An error occurred. Please try again.' });
        setSubmitting(false);
      });
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={1}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={googleHandler}
              size="large"
              variant="outlined"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
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
            <Typography variant="subtitle1">Sign in with Username </Typography>
          </Box>
        </Grid>
      </Grid>

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
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.userName && errors.userName)}
              sx={{
                ...theme.typography.customInput,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#2a9d8f', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#2a9d8f', // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2a9d8f', // Border color when focused
                  },
                },
              }}
            >
              <InputLabel htmlFor="outlined-adornment-userName-login">Mobile number</InputLabel>
              <OutlinedInput
                id="outlined-adornment-userName-login"
                type="text"
                value={values.userName}
                name="userName"
                onBlur={handleBlur}
                onChange={handleChange}
                label="mobile number"
              />
              {touched.userName && errors.userName && (
                <FormHelperText error id="standard-weight-helper-text-userName-login">
                  {errors.userName}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{
                ...theme.typography.customInput,
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
            >
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
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
                label="Password"
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.5}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="checked"
                    style={{ color: '#2a9d8f' }}
                  />
                }
                label="Remember me"
              />
              <Typography
                variant="subtitle1"
                sx={{ textDecoration: 'none', cursor: 'pointer', color: '#2a9d8f' }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <div>
              <Box sx={{ mt: 1 }}>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: '#2a9d8f', color: 'black' }}
                  disabled={isSubmitting}
                >
                  <span style={{ color: 'white' }}>Sign in</span>
                </Button>
              </Box>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;

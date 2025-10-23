import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { BaseUrl } from 'BaseUrl';

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleLoginSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // First, send the POST request to generate OTP
      const postResponse = await axios.post(`${BaseUrl}/login/v1/generateOtp`, {
        mobileNumber: values.mobileNumber
      });
  
      const postResult = postResponse.data;
  
      if (postResult.responseCode === 1000) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: postResult.message,
          showConfirmButton: false,
          timer: 3000,
          toast: true
        });
  
        // After successfully generating OTP, make a GET request
        const getResponse = await axios.get(
          `https://wsproducts.cloudjiffy.net/kwinlabsuser/jobseeker/v1/forgotPassword/${values.mobileNumber}`
        );
  
        const getResult = getResponse.data;
  
        // Display response from GET request
        Swal.fire({
          position: 'top-end',
          icon: getResult.responseCode === 1000 ? 'success' : 'error',
          title: getResult.message,
          showConfirmButton: false,
          timer: 3000,
          toast: true
        });
  
        // Store mobile number in sessionStorage and navigate to reset password page
        sessionStorage.setItem('mobileNumber', values.mobileNumber);
        navigate('/reset-password');
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: postResult.errorMessage || postResult.message,
          showConfirmButton: false,
          timer: 3000,
          toast: true
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'An error occurred. Please try again.',
        showConfirmButton: false,
        timer: 3000,
        toast: true
      });
    }
    setSubmitting(false);
  };
  

  return (
    <Formik
      initialValues={{
        mobileNumber: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        mobileNumber: Yup.string().required('Mobile Number is required')
      })}
      onSubmit={handleLoginSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.mobileNumber && errors.mobileNumber)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-mobileNumber-forgot">Mobile Number</InputLabel>
            <OutlinedInput
              id="outlined-adornment-mobileNumber-forgot"
              type="text"
              value={values.mobileNumber}
              name="mobileNumber"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Mobile Number"
            />
            {touched.mobileNumber && errors.mobileNumber && (
              <FormHelperText error id="standard-weight-helper-text-mobileNumber-forgot">
                {errors.mobileNumber}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button disableElevation fullWidth size="large" type="submit" variant="contained" style={{backgroundColor:"#1bb9ea"}} disabled={isSubmitting}>
                Send OTP
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthForgotPassword;

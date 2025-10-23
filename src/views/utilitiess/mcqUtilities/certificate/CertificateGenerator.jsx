import { useReducer, useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import styles from './certificateGenerator.module.scss';
import Modal from './Modal';
import Certificate from './Certificate';
import { Box } from '@mui/system';

const initialState = {
  name: 'Edukart',
  course: 'Full Stack Development',
  dateOfConductStart: '2024-01-20',
  dateOfConductEnd: '2024-06-20',
  signature: '',
  signatureDetails: 'CEO, Edukart'
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TEXT_CHANGE':
      return { ...state, [action.field]: action.payload };
    default:
      return state;
  }
};

const CertificateGenerator = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formState, dispatch] = useReducer(reducer, initialState);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const { name, course, dateOfConductStart, dateOfConductEnd, signature, signatureDetails } = formState;

    if (name && course && dateOfConductStart && dateOfConductEnd && signature && signatureDetails) {
      console.log('🔥💻 rj ~ form submitted!!!: ', formState);
      setIsOpenModal(true);
    } else {
      alert('Please fill all details');
    }
  };

  const handleTextChange = (e) => {
    dispatch({ type: 'TEXT_CHANGE', field: e.target.name, payload: e.target.value });
  };

  return (
    <>
      <Box className={styles.wrapper} sx={{ margin: { xs: -4, sm: -4 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <div className={styles.container}>
              <form onSubmit={handleSubmitForm}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Name" name="name" value={formState.name} onChange={handleTextChange} variant="outlined" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Course"
                      name="course"
                      value={formState.course}
                      onChange={handleTextChange}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      name="dateOfConductStart"
                      value={formState.dateOfConductStart}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      name="dateOfConductEnd"
                      value={formState.dateOfConductEnd}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Signature"
                      type="file"
                      name="signature"
                      onChange={(e) => {
                        const selected = e.target.files[0];
                        const objectUrl = URL.createObjectURL(selected);
                        dispatch({ type: 'TEXT_CHANGE', field: e.target.name, payload: { ...selected, preview: objectUrl } });
                      }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Signature Details"
                      name="signatureDetails"
                      value={formState.signatureDetails}
                      onChange={handleTextChange}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        '&:hover': {
                          color: '#fff',
                          background: 'rgb(26, 26, 100)'
                        },
                        color: '#fff',
                        background: 'rgb(26, 26, 100)'
                      }}
                    >
                      Generate Certificate
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <div className={styles.container}>
              <Certificate {...formState} />
            </div>
          </Grid>
        </Grid>
      </Box>

      <Modal isOpen={isOpenModal} handleClose={() => setIsOpenModal(false)}>
        <Certificate {...formState} />
      </Modal>
    </>
  );
};

export default CertificateGenerator;

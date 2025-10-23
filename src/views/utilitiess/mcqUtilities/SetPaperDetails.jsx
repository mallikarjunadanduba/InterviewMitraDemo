import React, { useEffect, useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import {
  Typography,
  Grid,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Button
} from '@mui/material';
import { Box } from '@mui/system';
import MainCard from 'ui-component/cards/MainCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import PrintIcon from '@mui/icons-material/Print';

const SetPaperDetails = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const [mcqData, setMcqData] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('mcqResponseData'));
    setMcqData(data);
  }, []);

  if (!mcqData) {
    return <Typography>Loading...</Typography>;
  }

  const cellStyle = { border: '1px solid gray', textAlign: 'center', padding: 1, width: '100px', minHeight: '60px' };

  return (
    <MainCard ref={printRef}>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Questions</Typography>
        </Grid>

        <Grid item xs={12} container justifyContent="flex-end">
          <Grid item className="no-print">
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                background: '#00563B',
                padding: 1,
                textAlign: 'center',
                borderRadius: '5px',
                width: { xs: '100%', sm: '100%' },
                mb: { xs: 1, sm: 0 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              Save
              <TurnedInNotIcon sx={{ ml: 1 }} />
            </Typography>
          </Grid>
          <Grid item className="no-print" sx={{ ml: { sm: 2 } }}>
            <ReactToPrint
              trigger={() => (
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    background: '#00563B',
                    padding: 1,
                    textAlign: 'center',
                    borderRadius: '5px',
                    width: { xs: '100%', sm: '100%' },
                    mb: { xs: 1, sm: 0 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  Print
                  <PrintIcon sx={{ ml: 1 }} />
                </Typography>
              )}
              content={() => printRef.current}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ border: '1px solid gray', borderRadius: '5px', mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: '1px solid gray', textAlign: 'center', padding: 1, width: '100px' }}>
                    <Typography sx={{ color: '#00563B', fontWeight: 600 }} variant="h3">
                      Q No.
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={6} sx={{ border: '1px solid gray', textAlign: 'center', padding: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, color: '#00563B' }}>
                      Question
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid gray', padding: 1, width: '200px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', padding: 1 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <IconButton sx={{ backgroundColor: 'white', marginBottom: 0.5, border: '1px solid gray' }}>
                          <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="body2">Undo</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <IconButton sx={{ backgroundColor: 'white', marginBottom: 0.5, border: '1px solid gray' }}>
                          <ArrowForwardIcon />
                        </IconButton>
                        <Typography variant="body2">Redo</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {mcqData.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell sx={cellStyle}>
                        <Typography sx={{ color: '#00563B' }} variant="h4">
                          {index + 1}
                        </Typography>
                        <Typography sx={{ background: '#0BDA51', color: '#fff', width: '100%', borderRadius: '5px', p: 1, mt: 1.5 }}>
                          {item.mode}
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={6} sx={{ border: '1px solid gray', textAlign: 'start', padding: 1 }}>
                        <Typography variant="h4" sx={{ color: '#800080', fontWeight: 600 }}>
                          {item.question}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: '1px solid gray', padding: 1, width: '200px' }}>
                        <Box variant="h4" sx={{ display: 'flex', justifyContent: 'space-evenly', color: '#B31B1B', fontWeight: 600 }}>
                          Replace By
                        </Box>
                      </TableCell>
                    </TableRow>

                    {['a', 'b', 'c', 'd'].map((option, optIndex) => (
                      <TableRow key={optIndex}>
                        <TableCell sx={cellStyle}>
                          <Typography sx={{ color: '#00563B' }} variant="h4">
                            {option.toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={6} sx={{ border: '1px solid gray', textAlign: 'start', padding: 1 }}>
                          <Typography variant="h4" sx={{ color: '#800080', fontWeight: 600 }}>
                            {item[option]}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: '1px solid gray', padding: 1, width: '200px', height: '50px' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            {option === 'a' && (
                              <>
                                <Button>Easy</Button>
                                <Button>Moderate</Button>
                              </>
                            )}
                            {option === 'b' && (
                              <>
                                <Button>difficult</Button>
                                <Button>New</Button>
                              </>
                            )}
                            {(option === 'c' || option === 'd') && <></>}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SetPaperDetails;

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { fetchBanner, addBanner, deleteBanner, getAdvertiseById, updatedAdvertise } from 'views/API/BannerApi';
import { BaseUrl } from 'BaseUrl';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Container, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { DeleteForever, Edit } from '@mui/icons-material';

const columns = [
  { id: 'advertisementId', label: 'ID' },
  { id: 'advertisementName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'file', label: 'File' },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const Banner = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [advertisement, setAdvertisement] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    advertisementName: '',
    description: '',
    fileName: ''
  });
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [advertisementId, setAdvertisementId] = useState(null);
  const inputRef = useRef(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  const FetchData = async () => {
    try {
      const res = await fetchBanner(headers);
      const fetchedData = res.data.content;

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          advertisementId: p.advertisementId,
          advertisementName: p.advertisementName,
          description: p.description,
          file:
            p.filePath === null ? (
              'NO IMAGE FOUND'
            ) : (
              <img src={ImageUrl + p.filePath} alt={p.fileName} style={{ width: 100, height: 50 }} />
            ),
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setAdvertisement(tableData);
      } else {
        setAdvertisement([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const postData = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        if (editMode) {
          const updatedData = {
            ...userdata,
            advertisementId,
            updatedBy: { userId: user.userId }
          };
          await updatedAdvertise(updatedData, headers);
        } else {
          await addBanner(userdata, headers);
        }
        setUserData({ advertisementName: '', description: '', fileName: '' });
        inputRef.current.value = null;
        setRefreshTrigger((prev) => !prev);
        setOpen(false);
      } catch (error) {
        console.error('Error saving advertisement:', error);
      }
    }
  };

  const onFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Please select a file');
      return;
    }
    const data = new FormData();
    data.append('file', selectedFile);

    try {
      const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: 'Bearer ' + user.accessToken
        }
      });
      setFileName(res.data.fileName);
      alert(res.data.message);
      setUserData({ ...userdata, fileName: res.data.fileName });
      setFileError('');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onFileChange = (e) => {
    setFileName(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.advertisementName || userdata.advertisementName.trim() === '') {
      newErrors.advertisementName = 'Enter the Advertisement name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.fileName || userdata.fileName.trim() === '') {
      newErrors.fileName = 'Select the file';
    }

    return newErrors;
  };

  const changeHandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value,
      createdBy: { userId: user.userId }
    });

    setErrors({
      ...errors,
      [e.target.name]: null
    });
  };

  const handleAddBanner = () => {
    setEditMode(false);
    setUserData({
      advertisementName: '',
      description: '',
      fileName: ''
    });
    setOpen(true);
  };

  const handleEdit = async (advertisementId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getAdvertiseById(advertisementId, headers);
      const det = res.data;

      setAdvertisementId(det.advertisementId);
      setUserData({
        advertisementName: det.advertisementName,
        description: det.description,
        fileName: det.fileName
      });
    } catch (error) {
      console.error('Error fetching advertisement details:', error);
    }
  };

  const handleDelete = async (advertisementId) => {
    try {
      await deleteBanner(advertisementId, headers);
      FetchData();
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Banner</span>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
            onClick={handleAddBanner}
          >
            Add
            <AddIcon sx={{ color: '#fff' }} />
          </Button>
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {advertisement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.advertisementId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton onClick={() => handleEdit(row.advertisementId)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.advertisementId)} color="error">
                            <DeleteForever />
                          </IconButton>
                        </>
                      ) : (
                        row[column.id]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={advertisement.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Advertisement' : 'Add Advertisement'}</DialogTitle>
        <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Advertisement Name"
                name="advertisementName"
                value={userdata.advertisementName}
                onChange={changeHandler}
                error={!!errors.advertisementName}
                helperText={errors.advertisementName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={userdata.description}
                onChange={changeHandler}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                id="fileName"
                label="File Name"
                name="fileName"
                autoComplete="fileName"
                value={userdata.fileName}
                disabled
                helperText={errors.fileName}
                error={!!errors.fileName}
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
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default Banner;

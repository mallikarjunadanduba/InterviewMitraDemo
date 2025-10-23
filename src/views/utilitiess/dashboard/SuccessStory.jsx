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
import { BaseUrl } from 'BaseUrl';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box } from '@mui/system';
import { Button, Dialog, DialogActions, DialogTitle, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import DeleteForever from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { addSuccess, deleteSuccess, fetchSuccess, getSuccessById, updatedSuccess } from 'views/API/SuccessStoryApi';

const columns = [
  { id: 'successstoryId', label: 'ID' },
  { id: 'successstoryName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'file', label: 'File' },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const SuccessStory = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [news, setNews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [successstoryId, setSuccessstoryId] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [userdata, setUserData] = useState({
    successstoryName: '',
    description: ''
  });

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
    Authorization: `Bearer ${user.accessToken}`
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  const fetchData = async () => {
    try {
      const res = await fetchSuccess(headers);
      const fetchedData = res.data.content;

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          successstoryId: p.successstoryId,
          successstoryName: p.successstoryName,
          description: p.description,
          file: p.photoPath ? <img src={ImageUrl + p.photoPath} alt={p.photoName} style={{ width: 100, height: 50 }} /> : 'NO IMAGE FOUND',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setNews(tableData);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.successstoryName.trim()) {
      newErrors.successstoryName = 'Enter the News';
    }

    if (!userdata.description.trim()) {
      newErrors.description = 'Enter the Description';
    }

    if (!userdata.photoName || userdata.photoName.trim() === '') {
      newErrors.photoName = 'Select the file';
    }

    return newErrors;
  };

  const changeHandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: null
    }));
  };

  const handleDelete = async (successstoryId) => {
    try {
      await deleteSuccess(successstoryId, headers);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleEdit = async (successstoryId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getSuccessById(successstoryId, headers);
      const det = res.data;

      setSuccessstoryId(det.successstoryId);
      setUserData({
        successstoryName: det.successstoryName,
        description: det.description,
        photoName: det.photoName
      });
    } catch (error) {
      console.error('Error fetching news by ID:', error);
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
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      setPhotoName(res.data.fileName);
      setUserData((prevData) => ({ ...prevData, photoName: res.data.fileName }));
      setFileError('');
      alert(res.data.message);
      console.log(res.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onFileChange = (e) => {
    setPhotoName(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };

  const postData = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    console.log(userdata);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        if (editMode) {
          const updatedData = {
            ...userdata,
            successstoryId,
            updatedBy: { userId: user.userId }
          };
          await updatedSuccess(updatedData, headers);
        } else {
          const newData = {
            ...userdata,
            createdBy: { userId: user.userId }
          };
          await addSuccess(newData, headers);
        }
        setUserData({ successstoryName: '', description: '', photoName: '' });
        inputRef.current.value = null;
        setRefreshTrigger((prev) => !prev);
        setOpen(false);
      } catch (error) {
        console.error('Error saving news:', error);
      }
    }
  };

  const handleAddNews = () => {
    setEditMode(false);
    setUserData({
      successstoryName: '',
      description: '',
      photoName: ''
    });
    setOpen(true);
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>SuccessStory</span>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
            onClick={handleAddNews}
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
              {news.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.successstoryId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton onClick={() => handleEdit(row.successstoryId)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.successstoryId)} color="error">
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
          count={news.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit SuccessStory' : 'Add SuccessStory'}</DialogTitle>
        <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SuccessStory Name"
                name="successstoryName"
                value={userdata.successstoryName}
                onChange={changeHandler}
                error={!!errors.successstoryName}
                helperText={errors.successstoryName}
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
                id="photoName"
                label="File Name"
                name="photoName"
                autoComplete="photoName"
                value={userdata.photoName}
                disabled
                helperText={errors.photoName}
                error={!!errors.photoName}
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

export default SuccessStory;

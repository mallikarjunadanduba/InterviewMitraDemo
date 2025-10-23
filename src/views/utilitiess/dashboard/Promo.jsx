import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Box
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import { deletePromo, fetchPromo, getPromoById, postPromoData, updatedPromo } from 'views/API/PromoApi';

const columns = [
  { id: 'promoId', label: 'ID' },
  { id: 'promoName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'youTube', label: 'Youtube' },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const Promo = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [promo, setPromo] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [promoId, setPromoId] = useState(null);
  const inputRef = useRef(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [userdata, setUserData] = useState({
    promoName: '',
    description: '',
    youTube: ''
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
    Authorization: 'Bearer ' + user.accessToken
  };

  const changeHandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: null
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.promoName || userdata.promoName.trim() === '') {
      newErrors.promoName = 'Enter the Advertisement name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.youTube || userdata.youTube.trim() === '') {
      newErrors.youTube = 'Enter Youtube URL';
    }

    return newErrors;
  };

  const fetchData = async () => {
    try {
      const res = await fetchPromo(headers);
      const fetchedData = res.content;

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          promoId: p.promoId,
          promoName: p.promoName,
          description: p.description,
          youTube: p.youTube,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));

        setPromo(tableData);
      } else {
        setPromo([]);
      }
    } catch (error) {
      console.error('Error fetching promo data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    await deletePromo(headers, id);
    fetchData();
  };

  const handleEdit = async (id) => {
    setEditMode(true); // Set editMode to true
    setOpen(true);

    try {
      // Fetch promo details by id
      const res = await getPromoById(headers, id);
      const det = res.data;

      if (det) {
        // Set promoId and userData with fetched data
        setPromoId(det.promoId);
        setUserData({
          promoName: det.promoName,
          description: det.description,
          youTube: det.youTube
        });
      } else {
        // Handle case where no data is returned
        console.error('No promo data found for id:', id);
      }
    } catch (error) {
      console.error('Error fetching promo details:', error);
    }
  };

  const handleAddPromo = () => {
    setEditMode(false);
    setUserData({
      promoName: '',
      description: '',
      youTube: ''
    });
    setOpen(true);
  };

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
            promoId,
            updatedBy: { userId: user.userId }
          };

          // Correct order of arguments
          await updatedPromo(updatedData, headers);
        } else {
          await postPromoData(
            {
              ...userdata,
              createdBy: { userId: user.userId }
            },
            headers
          );
        }
        setUserData({ promoName: '', description: '', youTube: '' });
        inputRef.current.value = null;
        setRefreshTrigger((prev) => !prev);
        setOpen(false);
      } catch (error) {
        console.error('Error saving promo:', error);
      }
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Promo</span>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
            onClick={handleAddPromo}
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
              {promo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.promoId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton onClick={() => handleEdit(row.promoId)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.promoId)} color="error">
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
          count={promo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Promo' : 'Add Promo'}</DialogTitle>
        <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Promo Name"
                name="promoName"
                value={userdata.promoName}
                onChange={changeHandler}
                error={!!errors.promoName}
                helperText={errors.promoName}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="YouTube URL"
                name="youTube"
                value={userdata.youTube}
                onChange={changeHandler}
                error={!!errors.youTube}
                helperText={errors.youTube}
                inputRef={inputRef}
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ pt: 3 }}>
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

export default Promo;

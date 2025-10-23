import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Container,
  IconButton,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';

import { fetchAcademyCategories, fetchAcademyCourses } from 'views/API/AcademyCategoryApi';

const columns = [
  { id: 'courseId', label: 'ID' },
  { id: 'courseName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'discount', label: 'Discount' },
  { id: 'handlingFee', label: 'Handling Fee' },
  { id: 'sellingPrice', label: 'Selling Price' },
  { id: 'subscriptionDays', label: 'Subscription Days' },
  { id: 'trailPeriod', label: 'Trail Period' },
  { id: 'categoryName', label: 'Category Name', minWidth: 150 },
  { id: 'videoUrl', label: 'Video URL' },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const UpSkillCourses = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    courseName: '',
    description: '',
    discount: '',
    handlingFee: '',
    sellingPrice: '',
    subscriptionDays: '',
    trailPeriod: '',
    videoUrl: '',
    categoryId: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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

  const FetchData = async () => {
    try {
      const res = await fetchAcademyCourses(headers);
      const fetchedData = res.data.content;

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          courseId: p.courseId,
          courseName: p.courseName,
          description: p.description,
          discount: p.discount,
          handlingFee: p.handlingFee,
          sellingPrice: p.sellingPrice,
          subscriptionDays: p.subscriptionDays,
          trailPeriod: p.trailPeriod,
          categoryName: p.upskillCategoryDtoList ? p.upskillCategoryDtoList.categoryName : 'No Category', // Category name added
          videoUrl: p.videoUrl,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setCourses(tableData);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetchAcademyCategories(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
        const categoryData = sortedData.map((c) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName
        }));
        setCategories(categoryData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    FetchData();
    fetchCategories();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.courseName || userdata.courseName.trim() === '') {
      newErrors.courseName = 'Enter the course name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }
    if (!userdata.videoUrl || userdata.videoUrl.trim() === '') {
      newErrors.videoUrl = 'Enter the videoUrl';
    }

    if (!userdata.categoryId) {
      newErrors.categoryId = 'Select a category';
    }

    return newErrors;
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

  const handleAddBanner = () => {
    setEditMode(false);
    setUserData({
      courseName: '',
      description: '',
      discount: '',
      handlingFee: '',
      sellingPrice: '',
      subscriptionDays: '',
      trailPeriod: '',
      videoUrl: '',
      categoryId: ''
    });
    setOpen(true);
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Academy Courses</span>
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
              {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.categoryId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton color="error">
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
          count={courses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Courses' : 'Add Courses'}</DialogTitle>
        <Box component="form" noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                name="courseName"
                value={userdata.courseName}
                onChange={changeHandler}
                error={!!errors.courseName}
                helperText={errors.courseName}
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
                fullWidth
                label="Discount"
                name="discount"
                value={userdata.discount}
                onChange={changeHandler}
                error={!!errors.discount}
                helperText={errors.discount}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="HandlingFee"
                name="handlingFee"
                value={userdata.handlingFee}
                onChange={changeHandler}
                error={!!errors.handlingFee}
                helperText={errors.handlingFee}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Selling Price"
                name="sellingPrice"
                value={userdata.sellingPrice}
                onChange={changeHandler}
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subscription Days"
                name="subscriptionDays"
                value={userdata.subscriptionDays}
                onChange={changeHandler}
                error={!!errors.subscriptionDays}
                helperText={errors.subscriptionDays}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trail Period "
                name="trailPeriod"
                value={userdata.trailPeriod}
                onChange={changeHandler}
                error={!!errors.trailPeriod}
                helperText={errors.trailPeriod}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={userdata.categoryId}
                  onChange={changeHandler}
                  error={!!errors.categoryId}
                  helperText={errors.categoryId}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="VideoUrl "
                name="videoUrl"
                value={userdata.videoUrl}
                onChange={changeHandler}
                error={!!errors.videoUrl}
                helperText={errors.videoUrl}
              />
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

export default UpSkillCourses;

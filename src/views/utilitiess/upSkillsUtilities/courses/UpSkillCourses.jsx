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
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import { formatDate } from 'utils/dateUtils';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import Swal from "sweetalert2";
import {
  fetchUpskillsCoursesPagination,
  getUpskillsCourseById,
  createCourse,
  updateUpskillsCourse,
  deleteUpskillsCourse
} from 'views/API/UpskillsCourseApi';
import { fetchUpSkillsAllCategories } from 'views/API/UpskillsCategoryApi';
import YouTubePlayer from 'YoutubePlayer/YouTubePlayer';

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

// ✅ Course Card View Component
const CourseCardView = ({ courses, onEdit, onDelete, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  return (
    <>
      <Grid container spacing={3}>
        {currentCourses.map((course) => (
          <Grid item xs={12} key={course.courseId}>
            <Card
              sx={{
                border: '2px solid #00afb5',
                boxShadow: '0 8px 32px rgba(0, 180, 216, 0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 180, 216, 0.2)',
                  borderColor: '#008a8f'
                },
                overflow: 'hidden',
                borderRadius: 3
              }}
            >
              <Box sx={{ display: 'flex', height: 280 }}>
                {/* Left Side - Video */}
                <Box sx={{ 
                  width: '40%', 
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRight: '1px solid #e0e0e0'
                }}>
                  {course.videoUrl ? (
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%',
                      position: 'relative',
                      '& iframe': {
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }
                    }}>
                      <YouTubePlayer videoUrl={course.videoUrl} height="100%" width="100%" />
                    </Box>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d',
                      textAlign: 'center',
                      p: 1
                    }}>
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1
                      }}>
                        <Typography variant="h5" sx={{ color: '#adb5bd' }}>
                          🎥
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                        No Video
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Right Side - Metadata */}
                <Box sx={{ 
                  width: '60%', 
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}>
                  {/* Header Section */}
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#00afb5', 
                        fontWeight: 700,
                        mb: 1,
                        lineHeight: 1.2,
                        fontSize: '1.1rem'
                      }}
                    >
                      {course.courseName}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6c757d',
                        mb: 1.5,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.85rem'
                      }}
                    >
                      {course.description}
                    </Typography>

                    {/* Category Badge */}
                    <Box sx={{ mb: 1.5 }}>
                      <Typography 
                        variant="caption" 
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      >
                        {course.categoryName}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pricing Section */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 700, fontSize: '1.1rem' }}>
                        ₹{course.sellingPrice || '0'}
                      </Typography>
                      {course.discount && (
                        <Typography 
                          variant="caption" 
                          sx={{
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 0.5,
                            ml: 1,
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        >
                          {course.discount}% OFF
                        </Typography>
                      )}
                    </Box>

                    {/* Additional Details */}
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500, fontSize: '0.7rem' }}>
                          Trial Period
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {course.trailPeriod || 0} days
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500, fontSize: '0.7rem' }}>
                          Subscription
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {course.subscriptionDays || 0} days
                        </Typography>
                      </Grid>
                      {course.handlingFee && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500, fontSize: '0.7rem' }}>
                            Handling Fee
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            ₹{course.handlingFee}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  {/* Footer Section */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#6c757d',
                        fontSize: '0.7rem'
                      }}
                    >
                      Created: {course.insertedDate} | Updated: {course.updatedDate}
                    </Typography>
                    
                    {/* Action Buttons */}
                    <Box>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => onEdit(course)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => onDelete(course)}
                      >
                        <DeleteForever />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Pagination for Cards */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={courses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Box>
    </>
  );
};

const UpSkillCourses = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
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
      const res = await fetchUpSkillsCourses(headers);
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
      const res = await fetchUpSkillsCategories(headers);
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

  const handleEdit = (course) => {
    setEditMode(true);
    setUserData({
      courseName: course.courseName,
      description: course.description,
      discount: course.discount,
      handlingFee: course.handlingFee,
      sellingPrice: course.sellingPrice,
      subscriptionDays: course.subscriptionDays,
      trailPeriod: course.trailPeriod,
      videoUrl: course.videoUrl,
      categoryId: course.categoryId
    });
    setOpen(true);
  };

  const handleDelete = (course) => {
    // Add delete functionality here
    console.log('Delete course:', course);
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Upskills Courses</span>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="table" aria-label="table view">
                <ViewList />
              </ToggleButton>
              <ToggleButton value="card" aria-label="card view">
                <ViewModule />
              </ToggleButton>
            </ToggleButtonGroup>
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
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      
      {viewMode === 'table' ? (
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.courseId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            <IconButton color="primary" onClick={() => handleEdit(row)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(row)}>
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
      ) : (
        <CourseCardView
          courses={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
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

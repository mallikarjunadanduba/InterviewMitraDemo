import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
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
  FormControl,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { fetchUpSkillsCourses, fetchUpSkillsModules } from 'views/API/UpskillsCategoryApi';

const columns = [
  { id: 'moduleId', label: 'ID' },
  { id: 'moduleName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'courseName', label: 'Course Name', minWidth: 150 },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const UpSkillModules = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    moduleName: '',
    description: '',
    courseId: ''
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

  const fetchModules = async () => {
    try {
      const res = await fetchUpSkillsModules(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          moduleId: p.moduleId,
          moduleName: p.moduleName,
          description: p.description,
          courseName: p.upskillCourseDToList && p.upskillCourseDToList.length > 0 ? p.upskillCourseDToList[0].courseName : 'No Course Name',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setModules(tableData);
      } else {
        setModules([]);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetchUpSkillsCourses(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.courseName.localeCompare(b.courseName));
        const courseData = sortedData.map((c) => ({
          courseId: c.courseId,
          courseName: c.courseName
        }));
        setCourses(courseData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchCourses();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.moduleName || userdata.moduleName.trim() === '') {
      newErrors.moduleName = 'Enter the module name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.courseId) {
      newErrors.courseId = 'Select a course';
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
      moduleName: '',
      description: '',
      courseId: ''
    });
    setOpen(true);
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Handle save logic here
      setOpen(false);
      setRefreshTrigger(!refreshTrigger); // Trigger refresh to update the list
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Upskills Modules</span>
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
              {modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.moduleId}>
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
                        row[column.id] || 'No Data' // Default text if no data
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
          count={modules.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Module' : 'Add Module'}</DialogTitle>
        <Box
          component="form"
          noValidate
          sx={{ p: 3 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Name"
                name="moduleName"
                value={userdata.moduleName}
                onChange={changeHandler}
                error={!!errors.moduleName}
                helperText={errors.moduleName}
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
              <FormControl fullWidth error={!!errors.courseId}>
                <InputLabel>Course</InputLabel>
                <Select name="courseId" value={userdata.courseId} onChange={changeHandler}>
                  {courses.map((course) => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.courseId && <FormHelperText>{errors.courseId}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default UpSkillModules;

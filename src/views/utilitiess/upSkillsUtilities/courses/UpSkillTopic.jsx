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
  FormHelperText,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { fetchUpSkillsCourses, fetchUpSkillsModules, fetchUpSkillsTopics } from 'views/API/UpskillsCategoryApi';

const columns = [
  { id: 'topicId', label: 'ID' },
  { id: 'topicName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'moduleName', label: 'Module', minWidth: 150 },
  { id: 'videoUrl', label: 'VideoUrl' },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const UpSkillTopics = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [topics, setTopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    topicName: '',
    description: '',
    moduleId: '',
    videoUrl: ''
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

  const fetchData = async () => {
    try {
      const res = await fetchUpSkillsTopics(headers);
      const fetchedData = res.data.content;
      console.log(fetchedData);
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          topicId: p.topicId,
          topicName: p.topicName,
          description: p.description,
          moduleName: p.upskillModuleDtoList ? p.upskillModuleDtoList.moduleName : 'No Module Name',
          videoUrl: p.videoUrl,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setTopics(tableData);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetchUpSkillsModules(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
        const moduleData = sortedData.map((c) => ({
          moduleId: c.moduleId,
          moduleName: c.moduleName
        }));
        setModules(moduleData);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchModules();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.topicName || userdata.topicName.trim() === '') {
      newErrors.topicName = 'Enter the topic name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }
    if (!userdata.videoUrl || userdata.videoUrl.trim() === '') {
      newErrors.videoUrl = 'Enter the videoUrl';
    }

    if (!userdata.moduleId) {
      newErrors.moduleId = 'Select a module';
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
      topicName: '',
      description: '',
      moduleId: '',
      videoUrl: ''
    });
    setOpen(true);
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setOpen(false);
      setRefreshTrigger(!refreshTrigger);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Upskills Topics</span>
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
              {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.topicId}>
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
                        row[column.id] || 'No Data'
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
          count={topics.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
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
                label="Topic Name"
                name="topicName"
                value={userdata.topicName}
                onChange={changeHandler}
                error={!!errors.topicName}
                helperText={errors.topicName}
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
              <FormControl fullWidth error={!!errors.moduleId}>
                <InputLabel id="module-select">Module</InputLabel>
                <Select labelId="module-select" name="moduleId" value={userdata.moduleId} onChange={changeHandler}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {modules.map((module) => (
                    <MenuItem key={module.moduleId} value={module.moduleId}>
                      {module.moduleName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.moduleId}</FormHelperText>
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

export default UpSkillTopics;

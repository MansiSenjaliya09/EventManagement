import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, FormHelperText } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { GridActionsCellItem } from "@mui/x-data-grid-pro";
import { deleteEvent, updateEvent } from '../redux/Slice/eventReducer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

const eventTypes = ['Sports', 'Music', 'General', 'Children', 'School'];

const EventList = () => {
  const events = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [errors, setErrors] = useState({});


  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to Delete?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteEvent(id));
        toast.success('Event deleted successfully!');
      }
    });
  };
  const handleUpdate = (id) => {
    const eventToUpdate = events.find(event => event.id === id);
    setCurrentEvent(eventToUpdate);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setCurrentEvent(null);
  };

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = currentEvent.startDate ? new Date(currentEvent.startDate) : null;
    const endDate = currentEvent.endDate ? new Date(currentEvent.endDate) : null;

    let errors = {};

    if (!startDate) {
      errors.startDate = 'Start date is required';
    } else if (startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }

    if (!endDate) {
      errors.endDate = 'End date is required';
    } else if (startDate && endDate < startDate) {
      errors.endDate = 'End date cannot be before the start date';
    }

    return errors;
  };

  const handleSave = () => {
    const dateErrors = validateDates();
    if (Object.keys(dateErrors).length > 0) {
      setErrors(dateErrors);
      return;
    }

    dispatch(updateEvent(currentEvent));
    toast.success('Event updated successfully!');
    setEditOpen(false);
    setCurrentEvent(null);
  };

  const columns = [
    { field: 'name', headerName: 'Event Name', width: 150 },
    { field: 'type', headerName: 'Event Type', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 150 },
    { field: 'endDate', headerName: 'End Date', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'handledBy', headerName: 'Handled By', width: 150 },
    { field: 'organisation', headerName: 'Organisation', width: 150 },
    { field: 'subEvents', headerName: 'Sub-Events', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(row.id)}
          color="secondary"
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Update"
          onClick={() => handleUpdate(row.id)}
          color="primary"
        />,
      ],
    },
  ];

  const rows = events.map((event) => ({
    ...event,
    startDate: event.startDate ? new Date(event.startDate).toLocaleDateString() : '',
    endDate: event.endDate ? new Date(event.endDate).toLocaleDateString() : '',
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Event List
      </Typography>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      </div>
      <Dialog open={editOpen} onClose={handleClose}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {currentEvent && (
            <ValidatorForm onSubmit={handleSave}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextValidator
                    type="text"
                    name="name"
                    value={currentEvent.name || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
                    validators={['required', 'minStringLength:3', 'maxStringLength:50', 'matchRegexp:^[A-Za-z ]+$']}
                    errorMessages={['This field is required', 'Minimum length is 3', 'Maximum length is 50', 'Name should not contain numbers or special characters']}
                    label="Event Name"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Event Type"
                    name="type"
                    value={currentEvent.type || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value })}
                    fullWidth
                    required
                  >
                    {eventTypes.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={currentEvent.startDate ? new Date(currentEvent.startDate) : null}
                      onChange={(date) => setCurrentEvent({ ...currentEvent, startDate: date ? date.toISOString() : null })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          error={!!errors.startDate}
                          helperText={errors.startDate}
                        />
                      )}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={currentEvent.endDate ? new Date(currentEvent.endDate) : null}
                      onChange={(date) => setCurrentEvent({ ...currentEvent, endDate: date ? date.toISOString() : null })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          error={!!errors.endDate}
                          helperText={errors.endDate}
                        />
                      )}
                      minDate={currentEvent.startDate ? new Date(currentEvent.startDate) : new Date()}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={currentEvent.description || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    type="text"
                    label="Handled By"
                    name="handledBy"
                    value={currentEvent.handledBy || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, handledBy: e.target.value })}
                    validators={['required', 'minStringLength:3', 'maxStringLength:50', 'matchRegexp:^[A-Za-z ]+$']}
                    errorMessages={['This field is required', 'Minimum length is 3', 'Maximum length is 50', 'Name should not contain numbers or special characters']}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    type="text"
                    label="Organisation"
                    name="organisation"
                    value={currentEvent.organisation || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, organisation: e.target.value })}
                    validators={['required', 'minStringLength:3', 'maxStringLength:50', 'matchRegexp:^[A-Za-z ]+$']}
                    errorMessages={['This field is required', 'Minimum length is 3', 'Maximum length is 50', 'Name should not contain numbers or special characters']}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    label="Total Number of Sub-Events"
                    name="subEvents"
                    type="number"
                    value={currentEvent.subEvents || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, subEvents: e.target.value })}
                    validators={['required', 'minNumber:0', 'maxNumber:5']}
                    errorMessages={['This field is required', 'Minimum value is 0', 'Maximum value is 5']}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Save Event
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                <Button onClick={handleClose} color="primary" variant="contained" fullWidth> 
                  Cancel
               </Button>
                </Grid>
              </Grid>
            </ValidatorForm>
          )}
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default EventList;

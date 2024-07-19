import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, MenuItem, Grid, Container, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addEvent } from '../redux/Slice/eventReducer';
import { v4 as uuidv4 } from 'uuid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const eventTypes = ['Sports', 'Music', 'General', 'Children', 'School'];

const EventForm = () => {
  const dispatch = useDispatch();
  const [event, setEvent] = useState({
    id: '',
    name: '',
    type: '',
    startDate: null,
    endDate: null,
    description: '',
    handledBy: '',
    organisation: '',
    subEvents: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (name, date) => {
    setEvent({
      ...event,
      [name]: date ? date.toISOString() : null,
    });
  };

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const startDate = event.startDate ? new Date(event.startDate) : null;
    const endDate = event.endDate ? new Date(event.endDate) : null;

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

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateDates()) {
      return;
    }

    dispatch(addEvent({ ...event, id: uuidv4() }));
    toast.success('Event added successfully!');
    setEvent({
      id: '',
      name: '',
      type: '',
      startDate: null,
      endDate: null,
      description: '',
      handledBy: '',
      organisation: '',
      subEvents: 0,
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Event
      </Typography>
      <ValidatorForm onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextValidator
              type="text"
              name="name"
              value={event.name}
              onChange={handleChange}
              validators={[
                'required',
                'minStringLength:3',
                'maxStringLength:50',
                'matchRegexp:^[A-Za-z ]+$'
              ]}
              errorMessages={[
                'This field is required',
                'Minimum length is 3',
                'Maximum length is 50',
                'Name should not contain numbers or special characters'
              ]}
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
              value={event.type}
              onChange={handleChange}
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
                label="Event Start Date"
                value={event.startDate ? new Date(event.startDate) : null}
                onChange={(date) => handleDateChange('startDate', date)}
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
                label="Event End Date"
                value={event.endDate ? new Date(event.endDate) : null}
                onChange={(date) => handleDateChange('endDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                  />
                )}
                minDate={event.startDate ? new Date(event.startDate) : new Date()}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Event Description"
              name="description"
              value={event.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextValidator
              type="text"
              label="Event Handled By"
              name="handledBy"
              value={event.handledBy}
              onChange={handleChange}
              validators={[
                'required',
                'minStringLength:3',
                'maxStringLength:50',
                'matchRegexp:^[A-Za-z ]+$'
              ]}
              errorMessages={[
                'This field is required',
                'Minimum length is 3',
                'Maximum length is 50',
                'Name should not contain numbers or special characters'
              ]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextValidator
              type="text"
              label="Event Organisation"
              name="organisation"
              value={event.organisation}
              onChange={handleChange}
              validators={[
                'required',
                'minStringLength:3',
                'maxStringLength:50',
                'matchRegexp:^[A-Za-z ]+$'
              ]}
              errorMessages={[
                'This field is required',
                'Minimum length is 3',
                'Maximum length is 50',
                'Name should not contain numbers or special characters'
              ]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextValidator
              label="Total Number of Sub-Events"
              name="subEvents"
              type="number"
              value={event.subEvents}
              onChange={handleChange}
              validators={[
                'required',
                'minNumber:0',
                'maxNumber:5'
              ]}
              errorMessages={[
                'This field is required',
                'Minimum value is 0',
                'Maximum value is 5'
              ]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Event
            </Button>
          </Grid>
        </Grid>
      </ValidatorForm>
      <ToastContainer />
    </Container>
  );
};

export default EventForm;

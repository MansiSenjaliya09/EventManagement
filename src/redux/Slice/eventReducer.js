import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('events');
    if (serializedState === null) {
      return [];
    }
    const parsedState = JSON.parse(serializedState);
    return parsedState.map(event => ({
      ...event,
      startDate: event.startDate ? new Date(event.startDate) : null,
      endDate: event.endDate ? new Date(event.endDate) : null,
    }));
  } catch (err) {
    return [];
  }
};


const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('events', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

const initialState = loadState();

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.push(action.payload);
      saveState(state);
    },
    updateEvent: (state, action) => {
      const index = state.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        saveState(state);
      }
    },
    deleteEvent: (state, action) => {
      const newState = state.filter(event => event.id !== action.payload);
      saveState(newState);
      return newState;
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;

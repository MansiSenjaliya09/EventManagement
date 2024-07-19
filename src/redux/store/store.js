
import { configureStore } from '@reduxjs/toolkit';
import eventReducer from '../Slice/eventReducer';
const store = configureStore({
  reducer: {
    events: eventReducer,
  },
});

export default store;

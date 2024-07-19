
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import NavBar from './components/NavBar';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<EventForm />} />
          <Route path="/events" element={<EventList />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;


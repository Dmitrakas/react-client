import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login';
import Registration from './components/Registration';
import UsersTable from './components/UsersTable';
import HomePage from './components/HomePage';
import React, { useState } from 'react';

function App() {
  const [ setCurrentUser] = useState(null);

  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/users" element={<UsersTable />} />
        </Routes>
      </Router>
  );
}

export default App;

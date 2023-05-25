import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1>Welcome to My App</h1>
        <p>Choose an option:</p>
        <div className="btn-group" role="group" aria-label="Options">
          <Link to="/login" className="btn btn-primary btn-outline-white rounded-pill mr-3">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-outline-white rounded-pill">
            Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

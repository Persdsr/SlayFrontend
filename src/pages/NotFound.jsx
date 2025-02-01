import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1 style={{ color: 'white' }}>404 - Not found</h1>
      <p style={{ color: 'white' }}>Unfortunately, there is no such page.</p>
      <Link to="/">Go back to the main page</Link>
    </div>
  );
};

export default NotFound;

import React from 'react';

const LoadingSpinner = () => (
  <div className="text-center">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p>Loading...</p>
  </div>
);

export default LoadingSpinner;

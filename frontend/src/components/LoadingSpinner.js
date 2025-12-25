// src/components/LoadingSpinner.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <div className="text-center my-5">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </Spinner>
  </div>
);

export default LoadingSpinner;
import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import '../dist/main.css'

export default function Loader() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Display the loader after a delay of 2000 milliseconds (2 seconds)
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 2000);

    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, []); // Run this effect only once on component mount

  return (
    <div className={`loader-container ${showLoader ? 'visible' : 'hidden'}`}>
      <Spinner animation="border" role="status" className="custom-spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}


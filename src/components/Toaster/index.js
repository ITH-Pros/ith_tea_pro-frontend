/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = ({ message, show, close }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = null;
    if (show) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            close();
            return 0;
          }
          return prevProgress + 33.3;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [show]);

  useEffect(() => {
    if (show) {
      toast.info(<div>{message}</div>, {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: progress / 100,
      })
    }
  }, [show]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={false}
      hideProgressBar
      closeOnClick={false}
      pauseOnHover={false}
      draggable={false}
    />
  );
};

export default Toaster;

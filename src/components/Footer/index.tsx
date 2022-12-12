import React from "react";

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-light text-muted position-absolute w-100 fixed-bottom">
      <div className="text-center p-4">
        2022 © 
        <a className="text-reset fw-bold" href="https://ith.tech">
          {` ITH tech.`}
        </a>
      </div>
    </footer>
  );
};

export default Footer;

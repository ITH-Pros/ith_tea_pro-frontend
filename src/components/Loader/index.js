import React from "react";
import './Loader.css';
const Loader = () => {
    return (
        <React.Fragment>
            <div className="loader-wrapper">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-shadow"></div>
                <div className="loader-shadow"></div>
                <div className="loader-shadow"></div>
            </div>
        </React.Fragment>
    )
}
export default Loader;
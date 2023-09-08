// import React from "react";
import './Loader.css'
import React from 'react';
import styled from 'styled-components'
import loader from '@assets/img/loader.png'

const Loader = () => {
  const Wrapper = styled.div``

  const TeaCupImage = styled.img`
    display: block;
    width: 200px;
    height: auto;
  `

  return (
    
      <div className="wrapper_loader">
        <div className="vertical-centered-box">
          <div className="content">
      
          <div class="loader"></div>

         
          </div>
        </div>
      </div>
  
  )
}

export default Loader;

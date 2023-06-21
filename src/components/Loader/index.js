// import React from "react";
import './Loader.css'
import React from 'react';
import styled from 'styled-components'

const Loader = () => {
  const Wrapper = styled.div``

  const TeaCupImage = styled.img`
    display: block;
    width: 200px;
    height: auto;
  `

  return (
    <Wrapper>
      <div className="wrapper_loader">
        <div className="vertical-centered-box">
          <div className="content">
            <div className="loader-circle"></div>
            <div className="loader-line-mask">
              <div className="loader-line"></div>
            </div>
            <div className="loader_wrap">
              <TeaCupImage src={require('../../assests/img/loader.png')} />
            </div>
          </div>
        </div>
        {/* <div className='loader_wrap'><TeaCupImage src={require("../../assests/img/loader.png")}  /> <small className='text-white'>Loading...</small> </div> */}
      </div>
    </Wrapper>
  )
}

export default Loader;

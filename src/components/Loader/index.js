// import React from "react";
// import './Loader.css';
// const Loader = () => {
//     return (
//         <React.Fragment>
//             <div className="loader-wrapper">
//                 <div className="loader-circle"></div>
//                 <div className="loader-circle"></div>
//                 <div className="loader-circle"></div>
//                 <div className="loader-shadow"></div>
//                 <div className="loader-shadow"></div>
//                 <div className="loader-shadow"></div>
//             </div>
//         </React.Fragment>
//     )
// }
// export default Loader;
import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = () => {
  const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    pointer-events: none;
  `;

  const TeaCupWrapper = styled.div`
    position: relative;
  `;

  const TeaCupImage = styled.img`
    display: block;
    width: 200px;
    height: auto;
  `;

  const pourAnimation = keyframes`
    from {
      transform: translateY(-100%);
    }

    to {
      transform: translateY(100%);
    }
  `;

  const TeaPourAnimation = styled.div`
    position: absolute;
    bottom: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 20%;
    height: 20%;
    background: url('https://unsplash.com/search/photos/tea-pouring') no-repeat center center;
    background-size: cover;
    animation: ${pourAnimation} 2s ease-in-out infinite;
  `;

  return (
    <Wrapper>
      <TeaCupWrapper>
              <TeaCupImage src={require("../../assests/img/loader.png")}  />
        <TeaPourAnimation />
      </TeaCupWrapper>
    </Wrapper>
  );
};

export default Loader;

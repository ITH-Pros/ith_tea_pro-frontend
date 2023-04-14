// import React from "react";
import './Loader.css';
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

 

  return (
    <Wrapper>
      <div className='wrapper_loader'>
              <div className='loader_wrap'><TeaCupImage src={require("../../assests/img/loader.png")}  /> <small className='text-white'>Loading...</small> </div>
     
      </div>
    </Wrapper>
  );
};

export default Loader;

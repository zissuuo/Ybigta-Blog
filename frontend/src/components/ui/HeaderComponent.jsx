// HeaderComponent.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Header = styled.div`
  display: flex;
  height: 40px;
  //justify-content: space-between;
  //align-items: center;
`;

const HeaderLogo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
`;

const ClickableBoxLogo = styled(HeaderLogo)`
  cursor: pointer;
`;



const HeaderComponent = ({ children }) => {
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <Header>
        <ClickableBoxLogo onClick={() => navigateTo('/')}>
          <img src={process.env.PUBLIC_URL + '/ybigta_logo.svg'} style = {{height: "100%"}}/>
        </ClickableBoxLogo>
    </Header>
  );
};

export default HeaderComponent;

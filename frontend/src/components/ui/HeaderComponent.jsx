import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Header = styled.div`
  padding-left: 48px;
  padding-right: 48px;
  display: flex;
  height: 5rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d4d4d4;
`;

const HeaderLogo = styled.div`
  width: 102px;
  height: 40px;
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
  // const navigateTo = (path) => {
  //   navigate(path);
  // };

  const redirectToExternalSite = () => {
    window.location.href = 'https://ybigta.org/';
  };

  return (
    <Header>
        <ClickableBoxLogo onClick={redirectToExternalSite}>
          <img src={process.env.PUBLIC_URL + '/ybigta_logo.svg'} style = {{height: "100%"}}/>
        </ClickableBoxLogo>
    </Header>
  );
};

export default HeaderComponent;

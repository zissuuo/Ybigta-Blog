import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Header = styled.div`
  padding-left: 48px;
  padding-right: 48px;
  display: flex;
  height: 5rem;
  justify-content: space-between; /* 수정됨 */
  align-items: center;
  border-bottom: 1px solid #d4d4d4;
`;

/* 우측에 비어있는 박스를 추가하여 균형을 맞춤. */
const RightBox = styled.div`
  width: 102px; /* 로고와 동일한 크기로 설정하여 균형을 유지 */
  height: 40px;
`;

const HeaderLogo = styled.div`
  width: 102px;
  height: 40px;
  justify-content: flex-start;
  cursor: pointer;
`;

const PageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClickableBox = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  color: #000000;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: "Pretendard-Medium";
  &:hover {
    background-color: #e5e5e5;
    color: #3b82f6;
  }
`;

const ClickableBoxLogo = styled(HeaderLogo)`
  cursor: pointer;
`;

const HeaderComponent = ({ children }) => {
  const navigate = useNavigate();

  const redirectToHome = () => {
    window.location.href = "https://ybigta.org/";
  };

  const redirectToArchive = () => {
    window.location.href = "https://ybigta.gitbook.io/archive/";
  };

  return (
    <Header>
      <ClickableBoxLogo onClick={redirectToHome}>
        <img
          src={process.env.PUBLIC_URL + "/ybigta_logo.svg"}
          style={{ height: "100%" }}
          alt="logo"
        />
      </ClickableBoxLogo>
      <PageBox>
        <ClickableBox>About</ClickableBox>
        <ClickableBox onClick={redirectToArchive}>Archive</ClickableBox>
        <ClickableBox>Wiki</ClickableBox>
        <ClickableBox onClick={() => navigate("/")}>Blog</ClickableBox>
      </PageBox>
      <RightBox />
    </Header>
  );
};

export default HeaderComponent;

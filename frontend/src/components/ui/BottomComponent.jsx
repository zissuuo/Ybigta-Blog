import React from "react";
import styled, { css } from "styled-components";

const BottomArea = styled.div`
  padding-top: 48px;
  padding-left: 48px;
  padding-right: 48px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 200px;
  margin-top: 50px;
  border-top: 1px solid #d4d4d4;
`;

const HeaderLogo = styled.div`
  width: 102px;
  height: 40px;
  justify-content: flex-start;
  cursor: pointer;
`;

const Text = styled.div`
  font-size: 12px;
  margin-top: 10px;
  font-family: "Pretendard-Medium", sans-serif;
`;

const BottomComponent = ({ children }) => {
  const redirectToHome = () => {
    window.location.href = "https://ybigta.org/";
  };

  const redirectInstagram = () => {
    window.location.href = "https://www.instagram.com/yonsei_ybigta/";
  };

  return (
    <BottomArea>
      <div>
        <HeaderLogo onClick={redirectToHome}>
          <img
            src={process.env.PUBLIC_URL + "/ybigta_logo.svg"}
            style={{ height: "100%" }}
            alt="logo"
          />
        </HeaderLogo>
        <Text>© 2024 연세대학교 빅데이터학회 Ybigta. All right reserved.</Text>
      </div>
      <Text onClick={redirectInstagram}>Click here to see our SNS</Text>
    </BottomArea>
  );
};

export default BottomComponent;

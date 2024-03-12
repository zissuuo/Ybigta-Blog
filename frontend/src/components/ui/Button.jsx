import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    font-size: 16px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
`;


function Button({ title, onClick, className }) {
    return <StyledButton className={className} onClick={onClick}>{title || "button"}</StyledButton>;
}

export default Button;
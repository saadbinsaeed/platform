/* @flow */
import React from 'react';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';

type CourtesyProps = {
    message: string
};

const StyledDiv = styled.div`
    padding-top: 50px;
    text-align: center;
    color: #888;
    h2, i, i:before {
        color: #888;
    }
    i, i:before {
        line-height: 1 !important;
        font-size: 100px !important;
    }
`;

const Courtesy = ({ message }: CourtesyProps) => {
    return (
        <StyledDiv>
            <Icon type="mdi" name="alert-circle-outline" size="xl" />
            <h2>{message}</h2>
        </StyledDiv>
    );
};

export default Courtesy;

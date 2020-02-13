/* @flow */
import React from 'react';
import styled from 'styled-components';

const HrStyle = styled.hr`
    height:0;
    border: 0;
    margin: 0;
    border-bottom: solid 1px ${ ( { theme } ) => 'rgba(255,255,255,0.2)' };
`;

const Hr = (props: Object) => {
    return (
        <HrStyle {...props} />
    );
};

export default Hr;

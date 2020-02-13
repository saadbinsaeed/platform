/* @flow */
import React from 'react';
import styled from 'styled-components';

const RadioGroupCss = ({ children }: Object) => {
    return <radiogroup>{children}</radiogroup>;
};

const RadioGroup = styled(RadioGroupCss)`
    font-size: inherit;
`;

export default RadioGroup;

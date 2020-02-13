/* @flow */
import React from 'react';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';

const PanelContentStyle = styled.div`
   padding: ${( { padding, theme } ) => theme && padding ? `${padding}rem` : '1rem' };
`;

const PanelContent = (props: Object) => {
    const { children } = props;
    return (
        <PanelContentStyle {...props}>
            {children}
        </PanelContentStyle>
    );
};

PanelContent.propTypes = {
    children: ChildrenProp
};

export default PanelContent;
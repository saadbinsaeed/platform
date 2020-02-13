/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';

const ContainerStyle = styled.div`
  display: block;
  position: relative;
  padding: ${( { noPadding } ) => noPadding ? '0' : '1rem' };
  max-width: ${( { width } ) => width ? `${width}px` : '' };
  margin: ${( { leftAligned } ) => leftAligned ? '' : '0 auto' };
`;

const Container = (props: Object) => {
    return (
        <ContainerStyle {...props}>
            {props.children}
        </ContainerStyle>
    );
};

Container.propTypes = {
    width: PropTypes.string,
    leftAligned: PropTypes.bool,
    noPadding: PropTypes.bool,
    isStyled: PropTypes.bool,
    children: ChildrenProp
};

export default Container;

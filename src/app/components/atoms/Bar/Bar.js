/* @flow */
/**
 * Define list of properties that we need to
 * have in this simple component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';

const BarStyle = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   height: ${({ theme }) => theme.bar.height};
   padding: 0 1rem;
`;


const Bar = ( props: Object ) => {

    const { children, className } = props;

    return (

        <BarStyle {...props} {...className}>
            { children }
        </BarStyle>

    );

};

Bar.propTypes = {
    children: ChildrenProp,
    className: PropTypes.string
};

export default Bar;

/* @flow */

// LIBRARY IMPORTS
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// UI IMPORTS

// STYLE IMPORTS
const ListStyle = styled.div`
  display: block;
  order-collapse: separate;
  width: 100%;
  margin:0;
  padding:0;
  background: transparent;
`;


const List = (props: Object) => {
    return (
        <ListStyle {...props}>
            {props.children}
        </ListStyle>
    );
};

List.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default List;

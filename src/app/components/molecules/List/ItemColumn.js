// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';

const ItemColumnStyle = styled.div`
    ${({ grow }) => grow ? 'flex: 1;' : ''};
    padding: .5rem;
      &:last-child {
        margin-left: auto;
      }
    ${({ textwrap }) => textwrap ? 'white-space: wrap;' : 'white-space: nowrap; text-overflow: ellipsis; overflow: hidden;' };
    ${({ shrink }) => shrink ? 'flex-shrink: 0;' : '' };
`;


const ItemColumn = (props: Object) => {
    const { children, grow, wrap, shrink } = props;
    return (
        <ItemColumnStyle shrink={shrink} textwrap={wrap} grow={grow}>
            {children}
        </ItemColumnStyle>
    );
};

ItemColumn.propTypes = {
    children: ChildrenProp,
    grow: PropTypes.bool,
    wrap: PropTypes.bool,
};

export default ItemColumn;

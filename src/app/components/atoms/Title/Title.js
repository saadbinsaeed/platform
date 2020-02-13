// LIBRARY IMPORTS
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HeaderTagProps } from 'app/utils/propTypes/common';
//import { ifProp } from 'styled-tools';

const TitleBase = styled.span`
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
  a {
    color: ${({ theme }) => theme.base.textColor};
  }
`;

const Title = (props) => {
    const { as } = props;
    const setTitleAs = props.as;
    const TitleStyle = TitleBase.withComponent(setTitleAs);

    return (
        <TitleStyle as={as} {...props}>
            {props.children}
        </TitleStyle>
    );
};

Title.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    as: HeaderTagProps
};

Title.defaultProps = {
    as: 'h3'
};


export default Title;

/* @flow */

import PropTypes from 'prop-types';
import { compose, pure, setPropTypes } from 'recompose';
import styled from 'styled-components';
// UI IMPORTS

// STYLE IMPORTS
const ListItemStyle = styled.div`
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    ${({ raised, theme }) => (theme && raised ? `box-shadow: ${theme.shadow.z1}; padding: .5rem; background: ${theme.widget.background}; margin-bottom: 1rem; ` : 'padding: .5rem 0;')};
    ${({ small }) => (small ? 'padding: 0; font-size: 0.8rem' : '')};
`;

export default compose(
    pure,
    setPropTypes({
        onClick: PropTypes.func,
        raised: PropTypes.bool,
        small: PropTypes.bool,
        children: PropTypes.any,
    })
)(ListItemStyle);

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Indicator = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2em;
        height: 2em;
        padding: .5em;
        line-height: 3em;
        text-align: center;
        border-radius: 500rem;
        color: ${( { color, theme, colorHex } ) => theme && (color || colorHex) ? 'white' : theme.base.textColor };
        background:  ${( { color, theme, colorHex } ) => theme && (color || colorHex) ? colorHex || theme.color[ color ] : 'none' };
        box-shadow: ${( { shadow, theme } ) => theme && shadow ? theme.shadow.z1 : '' };
`;

/**
 * Renders a button.
 *
 * @example <Button color="red" loading icon="delete" onClick="() => { alert('deleted') }" />
 *
 * For a complete list of all the available icons refer to https://materialdesignicons.com/
 */
const RoundedIndicator = (props) => {

    const { count, color, shadow, colorHex, ...rest } = props;

    return (
        <Indicator count={count} colorHex={colorHex} color={color} shadow={shadow} {...rest}>
            {count}
        </Indicator>
    );
};

RoundedIndicator.propTypes = {
    count: PropTypes.number,
    color: PropTypes.string,
    colorHex: PropTypes.string,
    shadow: PropTypes.bool,
};

RoundedIndicator.defaultProps = {
    count: 0,
    color: 'primary',
    colorHex: '',
    shadow: false
};

export default RoundedIndicator;

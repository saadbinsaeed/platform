/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProgressBarStyle = styled.div`
    display: block;
    background:  ${({ color, theme })=> color ? `${color}44` : `${theme.progressBar.color}44`};
    border-radius: 0;
    height: 0.3rem;
    overflow: hidden;
`;

const ProgressLine = styled.div`
    display: block;
    width: ${({ value }) => value || 0}%;
    background: ${({ color, theme })=> color || theme.progressBar.color};
    height: 0.3rem;
`;

/**
 * ProgressBar
 */
class ProgressBar extends PureComponent<Object, Object> {

    /**
     * Define our props
     */
    static propTypes = {
        value: PropTypes.number.isRequired,
        color: PropTypes.string,
    };

    static defaultProps = {
        value: 0,
    }

    /**
     * Render our progress bar based on % value
     */
    render() {
        const { value, color } = this.props;
        return (
            <ProgressBarStyle color={color}>
                <ProgressLine value={value} color={color} />
            </ProgressBarStyle>
        );
    }
}

export default ProgressBar;
